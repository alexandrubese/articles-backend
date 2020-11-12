import * as DynamoDB from 'aws-sdk/clients/dynamodb' ;
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../shared/dynamo-service';
import { DeleteArticleResult } from '../articles.interfaces';

export class DeleteArticleUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (articleDate: string): Promise<DeleteArticleResult> => {
      try {
        const params: DynamoDB.DeleteItemInput = {
          TableName: 'test_articles',
          Key: {
            'entities': { S: 'ARTICLE' },
            'entities_sort': { S: articleDate }
          }
        };
    
        const deleteArticleResponse: PromiseResult<DynamoDB.DeleteItemOutput, AWSError> =
            await this.dbInstance.deleteItem(params).promise();
    
        if (!deleteArticleResponse) {
          return { item: undefined };
        }
        const result: DeleteArticleResult = { item: 'Article deleted successfully' };
    
        return result;
      } catch (e) {
        console.log('Error in Tags repo fn deleteTag, throwing error up one level');
        throw e;
      }
    }
}
 