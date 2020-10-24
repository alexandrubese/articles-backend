// import { InternalServerErrorResult } from '../../shared/errors';
import { Article, GetArticlesResult } from './articles.interfaces';
import { AWSError, DynamoDB } from 'aws-sdk';
// import { ResponseBuilder } from '../../shared/response-builder';
import { PromiseResult } from 'aws-sdk/lib/request';

export class ArticlesRepository {
  public exists(id: number): boolean {
    return id > 0;
  }

  public async getArticles(): Promise<GetArticlesResult> {
    try {
      const docClient: DynamoDB.DocumentClient = new DynamoDB.DocumentClient({
        accessKeyId: 'fakeaccesskey', // Needed to connect to localdb
        endpoint: 'http://localhost:8002',
        region: 'localhost',
        secretAccessKey: 'fakesecretkey', // Needed to connect to localdb
      });
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
        await docClient.query(params).promise();
      const result: GetArticlesResult = { articles: articles.Items as (Article[] | undefined) };

      return result;
    } catch (e) {
      return e;
    }
  }

  public hasAccess(id: number): boolean {
    return id !== 666; // tslint:disable-line no-magic-numbers (Demo number.)
  }
}
