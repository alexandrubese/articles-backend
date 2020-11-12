import * as DynamoDB from 'aws-sdk/clients/dynamodb' ;
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../../shared/dynamo-service';
import { unmarshal } from '../../../shared/helper-functions';
import { Article, GetArticleResult } from '../articles.interfaces';

export class DeleteArticleTagUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (articleDate: string, tagId: string): Promise<GetArticleResult> => {
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
            await this.dbInstance.updateItem(params).promise();
    
    
        const updatedTag = unmarshal(updateTagResponse.Attributes) as (Article | undefined);
        if (!updateTagResponse) {
          return { item: undefined };
        }
        const result: GetArticleResult = { item: updatedTag };
    
        return result;
      } catch (e) {
        console.log('Error in Article repo fn deleteArticleTag, throwing error up one level');
        throw e;
      }
    }
}
 