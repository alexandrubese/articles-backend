import * as DynamoDB from 'aws-sdk/clients/dynamodb' ;
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../shared/dynamo-service';
import { unmarshal } from '../../shared/helper-functions';
import { Article, GetArticlesResult } from '../articles.interfaces';

export class GetArticlesUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (): Promise<GetArticlesResult> => {
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
                  await this.dbInstance.query(params).promise();
      
        const articles = unmarshal(articlesResponse.Items) as Article[];
      
        const result: GetArticlesResult = { items: articles };
      
        return result;
      } catch (e) {
        console.log('Error in Article repo fn getArticles, throwing error up one level');
        throw e;
      }
    };
}
 