import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Article, ArticleDetails, Comment, GetArticleResult, GetArticlesResult } from './articles.interfaces';

export class ArticlesRepository {
  private readonly docClient: DocumentClient;

  constructor(docClient: DocumentClient) {
    this.docClient = docClient;
  }

  constructArticleTagParams = (articleId: string): DynamoDB.DocumentClient.QueryInput => {
    return {
      TableName: 'test_articles',
      IndexName: 'gsi1_idx',
      KeyConditionExpression: '#article_link_pk = :val and begins_with(#article_link_sk, :hash)',
      ExpressionAttributeNames: {
        '#article_link_pk': 'article_link_pk',
        '#article_link_sk': 'article_link_sk'
      },
      ExpressionAttributeValues: {
        ':val': articleId,
        ':hash': '#'
      }
    };
  };

  public async getArticles(): Promise<GetArticlesResult> {
    try {
      const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: 'test_articles',
        KeyConditionExpression: '#entities = :val',
        ExpressionAttributeNames: {
          '#entities': 'entities'
        },
        ExpressionAttributeValues: {
          ':val': 'ARTICLE',
        }
      };

      const articlesResponse: PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError> =
        await this.docClient.query(params).promise();

      const result: GetArticlesResult = { items: articlesResponse.Items as (Article[] | undefined) };

      return result;
    } catch (e) {
      return e;
    }
  }

  public async getArticle(articleId: string): Promise<GetArticleResult> {
    try {
      const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: 'test_articles',
        IndexName: 'gsi1_idx',
        KeyConditionExpression: '#article_link_pk = :val',
        ExpressionAttributeNames: {
          '#article_link_pk': 'article_link_pk'
        },
        ExpressionAttributeValues: {
          ':val': articleId,
        }
      };

      const articlesResponse: PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError> =
        await this.docClient.query(params).promise();

      const articleDetails = articlesResponse.Items?.find(item => item.article_link_sk === 'D') as ArticleDetails;

      if (!articleDetails) {
        return { item: undefined };
      }

      const articleComments = articlesResponse.Items?.filter(item =>
        item.article_link_sk !== 'D' && item.article_link_sk !== '#') as Comment[];

      const article: Article = {
        ...articleDetails,
        comments: articleComments
      };

      const result: GetArticleResult = { item: article };
      return result;

    } catch (e) {
      return e;
    }
  }
}
