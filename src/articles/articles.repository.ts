import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import {
  Article,
  ArticleDetails,
  ArticleInputs,
  DeleteArticleResult,
  EditArticleInputs,
  GetArticleResult,
  GetArticlesResult
} from './articles.interfaces';
import { Comment } from '../comments/comments.interfaces';
import { uuid } from 'uuidv4';
import { unmarshal } from '../../shared/helper-functions';

export class ArticlesRepository {
  private readonly docClient: DynamoDB;

  constructor(docClient: DynamoDB) {
    this.docClient = docClient;
  }

  constructArticleTagParams = (articleId: string): DynamoDB.QueryInput => {
    return {
      TableName: 'test_articles',
      IndexName: 'gsi1_idx',
      KeyConditionExpression: '#article_link_pk = :val and begins_with(#article_link_sk, :hash)',
      ExpressionAttributeNames: {
        '#article_link_pk': 'article_link_pk',
        '#article_link_sk': 'article_link_sk'
      },
      ExpressionAttributeValues: {
        ':val': {
          S: articleId
        },
        ':hash': {
          S: '#'
        }
      }
    };
  };

  public async getArticles(): Promise<GetArticlesResult> {
    try {
      const params: DynamoDB.QueryInput = {
        TableName: 'test_articles',
        KeyConditionExpression: '#entities = :val',
        ExpressionAttributeNames: {
          '#entities': 'entities'
        },
        ExpressionAttributeValues: {
          ':val': {
            S: 'ARTICLE'
          },
        },
        Limit: 5
      };

      const articlesResponse: PromiseResult<DynamoDB.QueryOutput, AWSError> =
        await this.docClient.query(params).promise();

      const articles = unmarshal(articlesResponse.Items) as Article[];

      const result: GetArticlesResult = { items: articles };

      return result;
    } catch (e) {
      console.log('Error in Article repo fn getArticles, throwing error up one level');
      throw e;
    }
  }

  public async getArticle(articleId: string): Promise<DynamoDB.QueryOutput> {
    try {
      const params: DynamoDB.QueryInput = {
        TableName: 'test_articles',
        IndexName: 'gsi1_idx',
        KeyConditionExpression: '#article_link_pk = :val',
        ExpressionAttributeNames: {
          '#article_link_pk': 'article_link_pk'
        },
        ExpressionAttributeValues: {
          ':val': {
            S: articleId
          }
        },
        ScanIndexForward: false,
      };

      const articlesResponse: PromiseResult<DynamoDB.QueryOutput, AWSError> =
        await this.docClient.query(params).promise();

      return articlesResponse;

    } catch (e) {
      console.log('Error in Article repo fn getArticle, throwing error up one level');
      throw e;
    }
  }

  public async getArticlePreview(articleId: string): Promise<GetArticleResult> {
    try {
      const params: DynamoDB.QueryInput = {
        TableName: 'test_articles',
        IndexName: 'gsi1_idx',
        KeyConditionExpression: '#article_link_pk = :val and #article_link_sk = :vall',
        ExpressionAttributeNames: {
          '#article_link_pk': 'article_link_pk',
          '#article_link_sk': 'article_link_sk'
        },
        ExpressionAttributeValues: {
          ':val': { S: articleId },
          ':vall': { S: 'D' }
        },
        ReturnConsumedCapacity: 'TOTAL'
      };

      const articlesResponse: PromiseResult<DynamoDB.QueryOutput, AWSError> =
        await this.docClient.query(params).promise();

      const articleItems = unmarshal(articlesResponse.Items) as ArticleDetails[];
      const articleDetails = articleItems.find(item => item.article_link_sk === 'D');

      if (!articleDetails) {
        return { item: undefined };
      }

      const result: GetArticleResult = { item: articleDetails as Article };
      return result;

    } catch (e) {
      console.log('Error in Article repo fn getArticlePreview, throwing error up one level');
      throw e;
    }
  }

  public constructGetRelatedArticlesParams(tagId: string) {
    const params: DynamoDB.QueryInput = {
      TableName: 'test_articles',
      KeyConditionExpression: '#entities = :val',
      ExpressionAttributeNames: {
        '#entities': 'entities'
      },
      ExpressionAttributeValues: {
        ':val': { S: tagId },
      },
    };
    return params;
  }

  public async getRelatedArticlesByTags(tags: string[]): Promise<DynamoDB.QueryOutput[]> {
    try {
      const getRelatedPromises = tags.map(tag =>
        this.docClient.query(this.constructGetRelatedArticlesParams(tag)).promise());
      const getTagArticlesResponse = await Promise.all(getRelatedPromises);

      if (!getTagArticlesResponse) {
        throw new Error('No related articles can be fetched!');
      }

      return getTagArticlesResponse;
    } catch (e) {
      console.log('Error in Article repo fn getRelatedArticlesByTags, throwing error up one level');
      throw e;
    }
  }

  public async createArticle(article: ArticleInputs): Promise<GetArticleResult> {
    try {
      const creationDate = new Date().toISOString();
      const params: DynamoDB.PutItemInput = {
        TableName: 'test_articles',
        Item: {
          'entities': { S: 'ARTICLE' },
          'entities_sort': { S: creationDate },
          'article_link_pk': { S: uuid() },
          'article_link_sk': { S: 'D' },
          'title': { S: article.title },
          'body': { S: article.body },
          'tags': { SS: article.tags }
        }
      };

      const createArticleResponse: PromiseResult<DynamoDB.QueryOutput, AWSError> =
        await this.docClient.putItem(params).promise();

      const createdArticle: Article = unmarshal(params.Item);

      if (!createArticleResponse) {
        return { item: undefined };
      }

      const result: GetArticleResult = { item: createdArticle as (Article | undefined) };

      return result;
    } catch (e) {
      console.log('Error in Article repo fn createArticle, throwing error up one level');
      throw e;
    }
  }

  public async editArticle(editArticleInputs: EditArticleInputs): Promise<GetArticleResult> {
    try {
      let params: DynamoDB.UpdateItemInput = {
        TableName: 'test_articles',
        Key: {
          'entities': { S: 'ARTICLE' },
          'entities_sort': { S: editArticleInputs.articleDate }
        },
        ReturnValues: 'UPDATED_OLD'
      };
      // Empty Array! DynamoDB doesn't let us store empty String Sets, so we are deleting the whole attribute
      if (!editArticleInputs.tags.length) {
        params.UpdateExpression = 'SET title=:title, body=:body REMOVE tags';
        params.ExpressionAttributeValues = {
          ':title': { S: editArticleInputs.title },
          ':body': { S: editArticleInputs.body }
        };
      } else {
        params.UpdateExpression = 'SET title = :title, body=:body, tags=:tags';
        params.ExpressionAttributeValues = {
          ':title': { S: editArticleInputs.title },
          ':body': { S: editArticleInputs.body },
          ':tags': { SS: editArticleInputs.tags }
        };
      }

      const updateArticleResponse: PromiseResult<DynamoDB.UpdateItemOutput, AWSError> =
        await this.docClient.updateItem(params).promise();

      const updatedArticle: Article = unmarshal(updateArticleResponse.Attributes) as Article;

      if (!updateArticleResponse) {
        return { item: undefined };
      }

      const result: GetArticleResult = { item: updatedArticle };

      return result;
    } catch (e) {
      console.log('Error in Article repo fn editArticle, throwing error up one level');
      throw e;
    }
  }

  public async removeArticleTag(articleDate: string, tagId: string): Promise<GetArticleResult> {
    try {
      const params: DynamoDB.UpdateItemInput = {
        TableName: 'test_articles',
        Key: {
          'entities': { S: 'ARTICLE' },
          'entities_sort': { S: articleDate }
        },
        UpdateExpression: 'DELETE tags :tag',
        ExpressionAttributeValues: {
          ':tag': { SS: [tagId] }
        },
        ReturnValues: 'ALL_NEW'
      };

      const updateTagResponse: PromiseResult<DynamoDB.UpdateItemOutput, AWSError> =
        await this.docClient.updateItem(params).promise();


      const updatedTag = unmarshal(updateTagResponse.Attributes) as (Article | undefined);
      if (!updateTagResponse) {
        return { item: undefined };
      }
      const result: GetArticleResult = { item: updatedTag };

      return result;
    } catch (e) {
      console.log('Error in Article repo fn removeArticleTag, throwing error up one level');
      throw e;
    }
  }

  public async deleteArticle(articleDate: string): Promise<DeleteArticleResult> {
    try {
      const params: DynamoDB.DeleteItemInput = {
        TableName: 'test_articles',
        Key: {
          'entities': { S: 'ARTICLE' },
          'entities_sort': { S: articleDate }
        }
      };

      const deleteArticleResponse: PromiseResult<DynamoDB.DeleteItemOutput, AWSError> =
        await this.docClient.deleteItem(params).promise();

      if (!deleteArticleResponse) {
        return { item: undefined };
      }
      const result: DeleteArticleResult = { item: 'Article deleted successfully' };

      return result;
    } catch (e) {
      console.log('Error in Tags repo fn deleteTag, throwing error up one level');
      throw e;
    }
  }
}
