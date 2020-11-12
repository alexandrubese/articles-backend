import * as DynamoDB from 'aws-sdk/clients/dynamodb' ;
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../shared/dynamo-service';
import { unmarshal } from '../../shared/helper-functions';
import { Article, ArticleDetails, GetArticleResult } from '../articles.interfaces';

export class GetArticlePreviewUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (articleId: string): Promise<GetArticleResult> => {
      try {
        const params: DynamoDB.QueryInput = {
          TableName: 'test_articles',
          IndexName: 'gsi1_idx',
          KeyConditionExpression: '#article_link_pk = :val and #article_link_sk = :vall',
          ExpressionAttributeNames: {
            '#article_link_pk': 'article_link_pk',
            '#article_link_sk': 'article_link_sk'
          },
          ExpressionAttributeValues: {
            ':val': { S: articleId },
            ':vall': { S: 'D' }
          },
          ReturnConsumedCapacity: 'TOTAL'
        };
    
        const articlesResponse: PromiseResult<DynamoDB.QueryOutput, AWSError> =
            await this.dbInstance.query(params).promise();
    
        const articleItems = unmarshal(articlesResponse.Items) as ArticleDetails[];
        const articleDetails = articleItems.find(item => item.article_link_sk === 'D');
    
        if (!articleDetails) {
          return { item: undefined };
        }
    
        const result: GetArticleResult = { item: articleDetails as Article };
        return result;

      } catch (e) {
        console.log('Error in Article repo fn getArticlePreview, throwing error up one level');
        throw e;
      }
    };
}
