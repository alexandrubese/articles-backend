import * as DynamoDB from 'aws-sdk/clients/dynamodb' ;
import { DynamoService } from '../../shared/dynamo-service';

export class GetRelatedArticlesByTagsUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    private constructGetRelatedArticlesParams(tagId: string) {
      const params: DynamoDB.QueryInput = {
        TableName: 'test_articles',
        KeyConditionExpression: '#entities = :val',
        ExpressionAttributeNames: {
          '#entities': 'entities'
        },
        ExpressionAttributeValues: {
          ':val': { S: tagId },
        },
      };
      return params;
    }

    public execute = async (tags: string[]): Promise<DynamoDB.QueryOutput[]> => {
      try {
        const getRelatedPromises = tags.map(tag =>
          this.dbInstance.query(this.constructGetRelatedArticlesParams(tag)).promise());
        const getTagArticlesResponse = await Promise.all(getRelatedPromises);
    
        if (!getTagArticlesResponse) {
          throw new Error('No related articles can be fetched!');
        }
    
        return getTagArticlesResponse;
      } catch (e) {
        console.log('Error in Article repo fn getRelatedArticlesByTags, throwing error up one level');
        throw e;
      }
    };
}
 