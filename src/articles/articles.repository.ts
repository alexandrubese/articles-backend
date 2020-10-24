import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Article, GetArticlesResult } from './articles.interfaces';
import { DynamoService } from '../../shared/dynamo-service';

export class ArticlesRepository {
  private readonly docClient: DocumentClient;

  constructor() {
    this.docClient = new DynamoService().getInstance();
  }

  public async getArticles(): Promise<GetArticlesResult> {
    try {
      // eslint-disable
      const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: 'test_articles',
        KeyConditionExpression: '#entities = :val',
        ExpressionAttributeNames: {
          '#entities': 'entities'
        },
        ExpressionAttributeValues: {
          ':val': 'ARTICLE',
        }
      };

      const articles: PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError> =
        await this.docClient.query(params).promise();
      const result: GetArticlesResult = { articles: articles.Items as (Article[] | undefined) };

      return result;
    } catch (e) {
      return e;
    }
  }
}
