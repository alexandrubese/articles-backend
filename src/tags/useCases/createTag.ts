import DynamoDB = require('aws-sdk/clients/dynamodb');
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { uuid } from 'uuidv4';
import { DynamoService } from '../../../shared/dynamo-service';
import { unmarshal } from '../../../shared/helper-functions';
import { GetTagResult, Tag, TagInputs } from '../tags.interfaces';

export class CreateTagUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (tag: TagInputs): Promise<GetTagResult> => {
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
            await this.dbInstance.putItem(params).promise();
    
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
}
 