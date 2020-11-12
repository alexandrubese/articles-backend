import * as DynamoDB from 'aws-sdk/clients/dynamodb' ;
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { uuid } from 'uuidv4';
import { DynamoService } from '../../shared/dynamo-service';
import { unmarshal } from '../../shared/helper-functions';
import { Article, ArticleInputs, GetArticleResult } from '../articles.interfaces';

export class CreateArticleUseCase {
    private readonly dbInstance: DynamoDB;

    constructor() {
      this.dbInstance = new DynamoService().getInstance();
    }

    public execute = async (article: ArticleInputs): Promise<GetArticleResult> => {
      try {
        const creationDate = new Date().toISOString();
        const params: DynamoDB.PutItemInput = {
          TableName: 'test_articles',
          Item: {
            'entities': { S: 'ARTICLE' },
            'entities_sort': { S: creationDate },
            'article_link_pk': { S: uuid() },
            'article_link_sk': { S: 'D' },
            'title': { S: article.title },
            'body': { S: article.body },
            'tags': { SS: article.tags }
          }
        };
    
        const createArticleResponse: PromiseResult<DynamoDB.QueryOutput, AWSError> =
            await this.dbInstance.putItem(params).promise();
    
        const createdArticle: Article = unmarshal(params.Item);
    
        if (!createArticleResponse) {
          return { item: undefined };
        }
    
        const result: GetArticleResult = { item: createdArticle as (Article | undefined) };
    
        return result;
      } catch (e) {
        console.log('Error in Article repo fn createArticle, throwing error up one level');
        throw e;
      }
    };
}
 