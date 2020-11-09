import DynamoDB = require('aws-sdk/clients/dynamodb');
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../../shared/dynamo-service';
import { DeleteTagResult } from '../tags.interfaces';

export class DeleteTagUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (tagId: string): Promise<DeleteTagResult>  => {
      try {
        const params: DynamoDB.DeleteItemInput = {
          TableName: 'test_articles',
          Key: {
            'entities': { S: 'TAG' },
            'entities_sort': { S: tagId }
          }
        };
    
        const deleteTagResponse: PromiseResult<DynamoDB.DeleteItemOutput, AWSError> =
            await this.dbInstance.deleteItem(params).promise();
    
        if (!deleteTagResponse) {
          return { item: undefined };
        }
        const result: DeleteTagResult = { item: 'Tag deleted successfully' };
    
        return result;
      } catch (e) {
        console.log('Error in Tags repo fn deleteTag, throwing error up one level');
        throw e;
      }
    }
}
 