import DynamoDB = require('aws-sdk/clients/dynamodb');
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoService } from '../../../shared/dynamo-service';
import { unmarshal } from '../../../shared/helper-functions';
import { Article, EditArticleInputs, GetArticleResult } from '../articles.interfaces';

export class EditArticleUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (editArticleInputs: EditArticleInputs): Promise<GetArticleResult> => {
      try {
        let params: DynamoDB.UpdateItemInput = {
          TableName: 'test_articles',
          Key: {
            'entities': { S: 'ARTICLE' },
            'entities_sort': { S: editArticleInputs.articleDate }
          },
          ReturnValues: 'UPDATED_OLD'
        };
          // Empty Array! DynamoDB doesn't let us store empty String Sets, so we are deleting the whole attribute
        if (!editArticleInputs.tags.length) {
          params.UpdateExpression = 'SET title=:title, body=:body REMOVE tags';
          params.ExpressionAttributeValues = {
            ':title': { S: editArticleInputs.title },
            ':body': { S: editArticleInputs.body }
          };
        } else {
          params.UpdateExpression = 'SET title = :title, body=:body, tags=:tags';
          params.ExpressionAttributeValues = {
            ':title': { S: editArticleInputs.title },
            ':body': { S: editArticleInputs.body },
            ':tags': { SS: editArticleInputs.tags }
          };
        }
    
        const updateArticleResponse: PromiseResult<DynamoDB.UpdateItemOutput, AWSError> =
            await this.dbInstance.updateItem(params).promise();
    
        const updatedArticle: Article = unmarshal(updateArticleResponse.Attributes) as Article;
    
        if (!updateArticleResponse) {
          return { item: undefined };
        }
    
        const result: GetArticleResult = { item: updatedArticle };
    
        return result;
      } catch (e) {
        console.log('Error in Article repo fn editArticle, throwing error up one level');
        throw e;
      }
    }
}
 