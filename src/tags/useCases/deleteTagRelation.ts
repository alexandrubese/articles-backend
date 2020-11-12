import * as DynamoDB from 'aws-sdk/clients/dynamodb' ;
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../shared/dynamo-service';
import { DeleteTagResult } from '../tags.interfaces';

export class DeleteTagRelationUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (tagId: string, articleDate: string): Promise<DeleteTagResult>  => {
      try {
        const params: DynamoDB.DeleteItemInput = {
          TableName: 'test_articles',
          Key: {
            'entities': { S: tagId },
            'entities_sort': { S: articleDate }
          }
        };
    
        const deleteTagRelation: PromiseResult<DynamoDB.DeleteItemOutput, AWSError> =
            await this.dbInstance.deleteItem(params).promise();
    
        if (!deleteTagRelation) {
          return { item: undefined };
        }
        const result: DeleteTagResult = { item: 'TagRelation deleted successfully' };
    
        return result;
      } catch (e) {
        console.log('Error in Tags repo fn deleteTagRelation, throwing error up one level');
        throw e;
      }
    }
}
 