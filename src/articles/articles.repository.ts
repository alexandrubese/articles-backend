import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Article, GetArticlesResult } from './articles.interfaces';

export class ArticlesRepository {
  private readonly docClient: DocumentClient;

  constructor(docClient: DocumentClient) {
    this.docClient = docClient;
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
