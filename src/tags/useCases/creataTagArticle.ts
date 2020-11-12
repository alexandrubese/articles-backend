import * as DynamoDB from 'aws-sdk/clients/dynamodb' ;
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../../shared/dynamo-service';
import { unmarshal } from '../../../shared/helper-functions';
import { GetTagArticleResult,  TagArticle, TagArticleInputs } from '../tags.interfaces';

export class CreateTagArticleUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (tagArticle: TagArticleInputs): Promise<GetTagArticleResult>  => {
      try {
        const params: DynamoDB.PutItemInput = {
          TableName: 'test_articles',
          Item: {
            'entities': { S: tagArticle.tag_id },
            'entities_sort': { S: tagArticle.article_date },
            'article_link_pk': { S: tagArticle.article_id },
            'article_link_sk': { S: '#' }
          }
        };
    
        const createTagArticleResponse: PromiseResult<DynamoDB.QueryOutput, AWSError> =
            await this.dbInstance.putItem(params).promise();
    
        const createdTagArticle: TagArticle = unmarshal(params.Item) as TagArticle;
    
        if (!createTagArticleResponse) {
          return { item: undefined };
        }
        const result: GetTagArticleResult = { item: createdTagArticle };
    
        return result;
      } catch (e) {
        console.log('Error in Tags repo fn createTagArticle, throwing error up one level');
        throw e;
      }
    }
}
 