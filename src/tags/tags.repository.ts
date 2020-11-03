import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {
  DeleteTagResult,
  GetTagArticleResult,
  GetTagResult,
  Tag,
  TagArticle,
  TagArticleInputs,
  TagInputs
} from './tags.interfaces';
import { uuid } from 'uuidv4';

export class TagsRepository {
  private readonly docClient: DocumentClient;

  constructor(docClient: DocumentClient) {
    this.docClient = docClient;
  }

  public async createTag(tag: TagInputs): Promise<GetTagResult> {
    try {
      const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'test_articles',
        Item: {
          'entities': 'TAG',
          'entities_sort': uuid(),
          'title': tag.title
        }
      };

      const createTagResponse: PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError> =
        await this.docClient.put(params).promise();

      if (!createTagResponse) {
        return { item: undefined };
      }
      const result: GetTagResult = { item: params.Item as (Tag | undefined) };

      return result;
    } catch (e) {
      console.log('Error in Tags repo fn createTag, throwing error up one level');
      throw e;
    }
  }

  public async createTagArticle(tagArticle: TagArticleInputs): Promise<GetTagArticleResult> {
    try {
      const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'test_articles',
        Item: {
          'entities': tagArticle.tag_id,
          'entities_sort': tagArticle.article_date,
          'article_link_pk': tagArticle.article_id,
          'article_link_sk': '#'
        }
      };

      const createTagArticleResponse: PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError> =
        await this.docClient.put(params).promise();

      if (!createTagArticleResponse) {
        return { item: undefined };
      }
      const result: GetTagArticleResult = { item: params.Item as (TagArticle | undefined) };

      return result;
    } catch (e) {
      console.log('Error in Tags repo fn createTagArticle, throwing error up one level');
      throw e;
    }
  }

  public async deleteTag(tagId: string): Promise<DeleteTagResult> {
    try {
      const params: DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: 'test_articles',
        Key: {
          'entities': 'TAG',
          'entities_sort': tagId
        }
      };

      const createTagArticleResponse: PromiseResult<DynamoDB.DocumentClient.DeleteItemOutput, AWSError> =
        await this.docClient.delete(params).promise();

      if (!createTagArticleResponse) {
        return { item: undefined };
      }
      const result: DeleteTagResult = { item: 'Tag deleted successfully' };

      // cleanup, 
      // 1. delete all tag relations and 
      // 2. remove from all articles tags property 

      return result;
    } catch (e) {
      console.log('Error in Tags repo fn deleteTag, throwing error up one level');
      throw e;
    }
  }
}
