import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Comment, CommentInputs, PutCommentResult } from './comments.interfaces';
import { uuid } from 'uuidv4';

export class CommentsRepository {
  private readonly docClient: DocumentClient;

  constructor(docClient: DocumentClient) {
    this.docClient = docClient;
  }

  public async putComment(articleId: string, comment: CommentInputs): Promise<PutCommentResult> {
    try {
      const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'test_articles',
        Item: {
          'entities': 'COMMENT',
          'entities_sort': uuid(),
          'article_link_pk': articleId,
          'article_link_sk': new Date().toISOString(),
          'author': comment.author,
          'body': comment.body
        }
      };

      const putCommentResponse: PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError> =
        await this.docClient.put(params).promise();

      if (!putCommentResponse) {
        return { item: undefined };
      }
      const result: PutCommentResult = { item: params.Item as (Comment | undefined) };

      return result;
    } catch (e) {
      console.log('Error in Comments repo fn putComment, throwing error up one level');
      throw e;
    }
  }
}
