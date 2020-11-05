import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { Comment, CommentInputs, PutCommentResult } from './comments.interfaces';
import { uuid } from 'uuidv4';
import { unmarshal } from '../../shared/helper-functions';

export class CommentsRepository {
  private readonly docClient: DynamoDB;

  constructor(docClient: DynamoDB) {
    this.docClient = docClient;
  }

  public async putComment(articleId: string, comment: CommentInputs): Promise<PutCommentResult> {
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
        await this.docClient.putItem(params).promise();

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
