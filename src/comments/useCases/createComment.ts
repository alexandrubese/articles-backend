import * as DynamoDB from 'aws-sdk/clients/dynamodb' ;
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { uuid } from 'uuidv4';
import { DynamoService } from '../../../shared/dynamo-service';
import { unmarshal } from '../../../shared/helper-functions';
import { Comment, CommentInputs, PutCommentResult } from '../comments.interfaces';

export class CreateCommentUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (articleId: string, comment: CommentInputs): Promise<PutCommentResult> => {
      try {
        const params: DynamoDB.PutItemInput = {
          TableName: 'test_articles',
          Item: {
            'entities': { S: 'COMMENT' },
            'entities_sort': { S: uuid() },
            'article_link_pk': { S: articleId },
            'article_link_sk': { S: new Date().toISOString() },
            'author': { S: comment.author },
            'body': { S: comment.body }
          }
        };
    
        const putCommentResponse: PromiseResult<DynamoDB.QueryOutput, AWSError> =
            await this.dbInstance.putItem(params).promise();
    
        const commentItems: Comment = unmarshal(params.Item) as Comment;
    
        if (!putCommentResponse) {
          return { item: undefined };
        }
        const result: PutCommentResult = { item: commentItems };
    
        return result;
      } catch (e) {
        console.log('Error in Comments repo fn putComment, throwing error up one level');
        throw e;
      }
    }
}
 