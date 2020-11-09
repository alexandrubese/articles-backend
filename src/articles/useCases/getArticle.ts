import DynamoDB = require('aws-sdk/clients/dynamodb');
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../../shared/dynamo-service';
import { unmarshal } from '../../../shared/helper-functions';
import { Comment } from '../../comments/comments.interfaces';
import { Article, GetArticleResult } from '../articles.interfaces';

export class GetArticleUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (articleId: string): Promise<GetArticleResult> => {
      try {
        const params: DynamoDB.QueryInput = {
          TableName: 'test_articles',
          IndexName: 'gsi1_idx',
          KeyConditionExpression: '#article_link_pk = :val',
          ExpressionAttributeNames: {
            '#article_link_pk': 'article_link_pk'
          },
          ExpressionAttributeValues: {
            ':val': {
              S: articleId
            }
          },
          ScanIndexForward: false,
        };
    
        const articlesResponse: PromiseResult<DynamoDB.QueryOutput, AWSError> =
            await this.dbInstance.query(params).promise();
    
        const articleItems = unmarshal(articlesResponse.Items) as any[];
        const articleDetails = articleItems.find((item: Article) => item.article_link_sk === 'D');
    
        if (!articleDetails) {
          return { item: undefined };
        }
    
        const articleComments = articleItems.filter((item: Comment) =>
          item.article_link_sk !== 'D' && item.article_link_sk !== '#') as Comment[];
    
        const article: Article = {
          ...articleDetails,
          comments: articleComments
        };
    
        const result: GetArticleResult = { item: article };
        return result;
    
      } catch (e) {
        console.log('Error in Article repo fn getArticle, throwing error up one level');
        throw e;
      }
    }
}
 