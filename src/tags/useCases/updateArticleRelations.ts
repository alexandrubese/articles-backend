import * as DynamoDB from 'aws-sdk/clients/dynamodb' ;
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../shared/dynamo-service';
import { DeleteTagResult } from '../tags.interfaces';

export class UpdateArticleRelationsUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (
      articleId: string,
      articleDate: string,
      tagsToAdd: string[],
      tagsToRemove: string[]
    ): Promise<DeleteTagResult>  => {
      try {
        let writeRequests: DynamoDB.WriteRequest[] = [];
    
        tagsToAdd.forEach(tag => {
          writeRequests.push(
            {
              PutRequest: {
                Item: {
                  entities: { S: tag },
                  entities_sort: { S: articleDate },
                  article_link_pk: { S: articleId },
                  article_link_sk: { S: '#' }
                }
              }
            }
          );
        });
    
        tagsToRemove.forEach(tag => {
          writeRequests.push(
            {
              DeleteRequest: {
                Key: {
                  entities: { S: tag },
                  entities_sort: { S: articleDate }
                }
              }
            }
          );
        });
    
        let params: DynamoDB.BatchWriteItemInput = {
          RequestItems: {
            'test_articles': writeRequests
          }
        };
    
        const getTagArticleResponse: PromiseResult<DynamoDB.BatchWriteItemOutput, AWSError> =
            await this.dbInstance.batchWriteItem(params).promise();
    
        return {
          item: `Relations created successfully! ${articleId}, Uprocessed: ${getTagArticleResponse.UnprocessedItems}`
        };
      } catch (e) {
        console.log('Error in Tags repo fn createArticleRelations, throwing error up one level');
        throw e;
      }
    }
}
 