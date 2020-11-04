import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import {
  Article,
  ArticleDetails,
  ArticleInputs,
  GetArticleResult,
  GetArticlesResult,
  RelatedArticle
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

  public async getArticle(articleId: string): Promise<GetArticleResult> {
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

      const articleItems = unmarshal(articlesResponse.Items);
      const articleDetails = articleItems.find(item => item.article_link_sk === 'D') as ArticleDetails;

      if (!articleDetails) {
        return { item: undefined };
      }

      const articleComments = articleItems.filter(item =>
        item.article_link_sk !== 'D' && item.article_link_sk !== '#') as Comment[];

      const article: Article = {
        ...articleDetails,
        comments: articleComments
      };

      const result: GetArticleResult = { item: article };
      return result;

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

      const articleItems = unmarshal(articlesResponse.Items);
      const articleDetails = articleItems.find(item => item.article_link_sk === 'D') as ArticleDetails;

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

  public async getRelatedArticlesByTags(aId: string, tags: string[]): Promise<GetArticlesResult> {
    try {
      const getRelatedPromises = tags.map(tag =>
        this.docClient.query(this.constructGetRelatedArticlesParams(tag)).promise());
      const getTagArticlesResponse = await Promise.all(getRelatedPromises);

      const relatedArticles: RelatedArticle[] = [];

      // Going through all tags(and the articles assigned to them), counting each article id ocurence in the tags
      // We want to return the related articles as the articles most occured in the tags of the current article 
      getTagArticlesResponse.forEach(response => {
        const tagArticles = unmarshal(response.Items);

        if (tagArticles) {
          tagArticles.forEach(article => {
            const relatedArticle = relatedArticles.find(el => el.articleId === article.article_link_pk);

            if (relatedArticle) {
              relatedArticle.count += 1;
            } else {
              // Do not add the article for which we get the related articles
              if (article.article_link_pk !== aId) {
                const newRelatedArticle: RelatedArticle = {
                  articleId: article.article_link_pk,
                  count: 1,
                  date: article.entities_sort
                };

                relatedArticles.push(newRelatedArticle);
              }
            }
          });
        }
      });

      //Sorting by count, then by date
      relatedArticles.sort((a, b) => {
        if (a.count > b.count) {
          return -1;
        } else if (a.count < b.count) {
          return 1;
        }
        const date1 = new Date(a.date);
        const date2 = new Date(a.date);

        if (date1.getTime() > date2.getTime()) {
          return -1;
        } else if (date1.getTime() < date2.getTime()) {
          return 1;
        }
        return 0;
      });

      const previewedArticles: RelatedArticle[] = relatedArticles.slice(0, 3); //getting only the first 3 elements 
      const articlePreviewPromises: Promise<GetArticleResult>[] =
        previewedArticles.map(previewArticle => this.getArticlePreview(previewArticle.articleId));

      const articles: GetArticlesResult = { items: [] };
      if (!articlePreviewPromises) {
        return articles;
      }
      const articlePreviews = await Promise.all(articlePreviewPromises);
      if (!articlePreviews) {
        return articles;
      }

      articlePreviews.forEach(articlePreview => {
        if (articlePreview.item) {
          articles.items?.push(articlePreview.item);
        }
      });

      const result: GetArticlesResult = articles;
      return result;
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

      const createdArticle: Article = unmarshal([params.Item]);

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

  public async updateNewTagsArticle(articleDate: string, tags: string[]): Promise<GetArticleResult> {
    try {
      const params: DynamoDB.UpdateItemInput = {
        TableName: 'test_articles',
        Key: {
          'entities': { S: 'ARTICLE' },
          'entities_sort': { S: articleDate }
        },
        UpdateExpression: 'SET tags = :tags',
        ExpressionAttributeValues: {
          ':tags': { SS: tags }
        },
        ReturnValues: 'UPDATED_NEW'
      };

      const updateTagResponse: PromiseResult<DynamoDB.UpdateItemOutput, AWSError> =
        await this.docClient.updateItem(params).promise();


      const updatedTag = unmarshal([updateTagResponse.Attributes]) as (Article | undefined);
      if (!updateTagResponse) {
        return { item: undefined };
      }
      const result: GetArticleResult = { item: updatedTag as (Article | undefined) };

      return result;
    } catch (e) {
      console.log('Error in Article repo fn updateNewTagsArticle, throwing error up one level');
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


      const updatedTag = unmarshal([updateTagResponse.Attributes]) as (Article | undefined);
      if (!updateTagResponse) {
        return { item: undefined };
      }
      const result: GetArticleResult = { item: updatedTag as (Article | undefined) };

      return result;
    } catch (e) {
      console.log('Error in Article repo fn removeArticleTag, throwing error up one level');
      throw e;
    }
  }
}
