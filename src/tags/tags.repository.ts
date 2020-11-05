import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import {
  DeleteTagResult,
  GetTagArticleResult,
  GetTagArticlesResult,
  GetTagResult,
  Tag,
  TagArticle,
  TagArticleInputs,
  TagInputs
} from './tags.interfaces';
import { uuid } from 'uuidv4';
import { unmarshal } from '../../shared/helper-functions';

export class TagsRepository {
  private readonly docClient: DynamoDB;

  constructor(docClient: DynamoDB) {
    this.docClient = docClient;
  }

  public async createTag(tag: TagInputs): Promise<GetTagResult> {
    try {
      const params: DynamoDB.PutItemInput = {
        TableName: 'test_articles',
        Item: {
          'entities': { S: 'TAG' },
          'entities_sort': { S: uuid() },
          'title': { S: tag.title }
        }
      };

      const createTagResponse: PromiseResult<DynamoDB.QueryOutput, AWSError> =
        await this.docClient.putItem(params).promise();

      const createdTag: Tag = unmarshal(params.Item) as Tag;

      if (!createTagResponse) {
        return { item: undefined };
      }
      const result: GetTagResult = { item: createdTag };

      return result;
    } catch (e) {
      console.log('Error in Tags repo fn createTag, throwing error up one level');
      throw e;
    }
  }

  public async createTagArticle(tagArticle: TagArticleInputs): Promise<GetTagArticleResult> {
    try {
      const params: DynamoDB.PutItemInput = {
        TableName: 'test_articles',
        Item: {
          'entities': { S: tagArticle.tag_id },
          'entities_sort': { S: tagArticle.article_date },
          'article_link_pk': { S: tagArticle.article_id },
          'article_link_sk': { S: '#' }
        }
      };

      const createTagArticleResponse: PromiseResult<DynamoDB.QueryOutput, AWSError> =
        await this.docClient.putItem(params).promise();

      const createdTagArticle: TagArticle = unmarshal(params.Item) as TagArticle;

      if (!createTagArticleResponse) {
        return { item: undefined };
      }
      const result: GetTagArticleResult = { item: createdTagArticle };

      return result;
    } catch (e) {
      console.log('Error in Tags repo fn createTagArticle, throwing error up one level');
      throw e;
    }
  }

  public async deleteTag(tagId: string): Promise<DeleteTagResult> {
    try {
      const params: DynamoDB.DeleteItemInput = {
        TableName: 'test_articles',
        Key: {
          'entities': { S: 'TAG' },
          'entities_sort': { S: tagId }
        }
      };

      const createTagArticleResponse: PromiseResult<DynamoDB.DeleteItemOutput, AWSError> =
        await this.docClient.deleteItem(params).promise();

      if (!createTagArticleResponse) {
        return { item: undefined };
      }
      const result: DeleteTagResult = { item: 'Tag deleted successfully' };

      return result;
    } catch (e) {
      console.log('Error in Tags repo fn deleteTag, throwing error up one level');
      throw e;
    }
  }

  public async deleteTagRelation(tagId: string, articleDate: string): Promise<DeleteTagResult> {
    try {
      const params: DynamoDB.DeleteItemInput = {
        TableName: 'test_articles',
        Key: {
          'entities': { S: tagId },
          'entities_sort': { S: articleDate }
        }
      };

      const createTagArticleResponse: PromiseResult<DynamoDB.DeleteItemOutput, AWSError> =
        await this.docClient.deleteItem(params).promise();

      if (!createTagArticleResponse) {
        return { item: undefined };
      }
      const result: DeleteTagResult = { item: 'TagRelation deleted successfully' };

      return result;
    } catch (e) {
      console.log('Error in Tags repo fn deleteTagRelation, throwing error up one level');
      throw e;
    }
  }

  public async getTagArticles(tagId: string): Promise<GetTagArticlesResult> {
    try {
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

      const getTagArticleResponse: PromiseResult<DynamoDB.QueryOutput, AWSError> =
        await this.docClient.query(params).promise();

      const tagArticles: TagArticle[] = unmarshal(getTagArticleResponse.Items) as TagArticle[];

      if (!getTagArticleResponse) {
        return { items: undefined };
      }
      const result: GetTagArticlesResult = { items: tagArticles };

      return result;
    } catch (e) {
      console.log('Error in Tags repo fn getTagArticles, throwing error up one level');
      throw e;
    }
  }

  public async updateArticleRelations(
    articleId: string,
    articleDate: string,
    tagsToAdd: string[],
    tagsToRemove: string[]
  ): Promise<DeleteTagResult> {
    try {
      let writeRequests: DynamoDB.WriteRequest[] = [];

      tagsToAdd.forEach(tag => {
        writeRequests.push(
          {
            PutRequest: {
              Item: {
                entities: { S: tag },
                entities_sort: { S: articleDate },
                article_link_pk: { S: articleId },
                article_link_sk: { S: '#' }
              }
            }
          }
        );
      });

      tagsToRemove.forEach(tag => {
        writeRequests.push(
          {
            DeleteRequest: {
              Key: {
                entities: { S: tag },
                entities_sort: { S: articleDate }
              }
            }
          }
        );
      });

      let params: DynamoDB.BatchWriteItemInput = {
        RequestItems: {
          'test_articles': writeRequests
        }
      };

      const getTagArticleResponse: PromiseResult<DynamoDB.BatchWriteItemOutput, AWSError> =
        await this.docClient.batchWriteItem(params).promise();

      return {
        item: `Relations created successfully! ${articleId}, Uprocessed: ${getTagArticleResponse.UnprocessedItems}`
      };
    } catch (e) {
      console.log('Error in Tags repo fn createArticleRelations, throwing error up one level');
      throw e;
    }
  }
}
