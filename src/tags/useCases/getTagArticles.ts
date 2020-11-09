import DynamoDB = require('aws-sdk/clients/dynamodb');
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../../shared/dynamo-service';
import { unmarshal } from '../../../shared/helper-functions';
import { GetTagArticlesResult, TagArticle } from '../tags.interfaces';

export class GetTagArticlesUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (tagId: string): Promise<GetTagArticlesResult> => {
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
            await this.dbInstance.query(params).promise();
    
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
}
 