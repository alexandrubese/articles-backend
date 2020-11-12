import * as DynamoDB from 'aws-sdk/clients/dynamodb' ;
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../shared/dynamo-service';
import {  DeleteCommentResult } from '../comments.interfaces';

export class DeleteCommentUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (commentId: string): Promise<DeleteCommentResult>  => {
      try {
        const params: DynamoDB.DeleteItemInput = {
          TableName: 'test_articles',
          Key: {
            'entities': { S: 'COMMENT' },
            'entities_sort': { S: commentId }
          }
        };
    
        const deleteCommentResponse: PromiseResult<DynamoDB.DeleteItemOutput, AWSError> =
            await this.dbInstance.deleteItem(params).promise();
    
        if (!deleteCommentResponse) {
          throw new Error(`Error deleting the comment with id: ${commentId}`);
        }
        const result: DeleteCommentResult = { item: 'Comment deleted successfully' };
    
        return result;
      } catch (e) {
        console.log('Error in Comments repo fn deleteComment, throwing error up one level');
        throw e;
      }
    }
}
 