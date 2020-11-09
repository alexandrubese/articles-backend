import DynamoDB = require('aws-sdk/clients/dynamodb');
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../../shared/dynamo-service';
import { unmarshal } from '../../../shared/helper-functions';
import { GetTagResult, Tag, TagInputs } from '../tags.interfaces';

export class EditTagUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (tagId: string, tag: TagInputs): Promise<GetTagResult> =>  {
      try {
        const params: DynamoDB.UpdateItemInput = {
          TableName: 'test_articles',
          Key: {
            'entities': { S: 'TAG' },
            'entities_sort': { S: tagId }
          },
          UpdateExpression: 'SET title = :title',
          ExpressionAttributeValues: {
            ':title': { S: tag.title }
          },
          ReturnValues: 'UPDATED_NEW'
        };
    
        const createTagResponse: PromiseResult<DynamoDB.UpdateItemOutput, AWSError> =
            await this.dbInstance.updateItem(params).promise();
    
        const updateTag: Tag = unmarshal(createTagResponse.Attributes) as Tag;
    
        if (!updateTag) {
          throw new Error(`Error while updating tag: ${tagId}`);
        }
        const result: GetTagResult = { item: updateTag };
    
        return result;
      } catch (e) {
        console.log('Error in Tags repo fn editTag, throwing error up one level');
        throw e;
      }
    }
}
 