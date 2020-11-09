import DynamoDB = require('aws-sdk/clients/dynamodb');
import {
  ArticleInputs,
  DeleteArticleResult,
  EditArticleInputs,
  GetArticleResult,
  GetArticlesResult
} from './articles.interfaces';
import { GetArticlesUseCase } from './useCases/getArticles';
import { GetArticleUseCase } from './useCases/getArticle';
import { GetArticlePreviewUseCase } from './useCases/getArticlePreview';
import { GetRelatedArticlesByTagsUseCase } from './useCases/getRelatedArticlesByTags';
import { CreateArticleUseCase } from './useCases/createArticle';
import { EditArticleUseCase } from './useCases/editArticle';
import { DeleteArticleTagUseCase } from './useCases/deleteArticleTag';
import { DeleteArticleUseCase } from './useCases/deleteArticle';

export class ArticlesRepository {
  public readonly getArticles: () => Promise<GetArticlesResult>;
  public readonly getArticle: (articleId: string) => Promise<GetArticleResult>;
  public readonly getArticlePreview: (articleId: string) => Promise<GetArticleResult>;
  public readonly getRelatedArticlesByTags: (tags: string[]) => Promise<DynamoDB.QueryOutput[]>;
  public readonly createArticle: (article: ArticleInputs) => Promise<GetArticleResult>;
  public readonly editArticle: (editArticleInputs: EditArticleInputs) => Promise<GetArticleResult>;
  public readonly deleteArticle: (articleDate: string) => Promise<DeleteArticleResult>;
  public readonly deleteArticleTag: (articleDate: string, tagId: string) => Promise<GetArticleResult>;

  constructor() {
    this.getArticles = new GetArticlesUseCase().execute;
    this.getArticle = new GetArticleUseCase().execute;
    this.getArticlePreview = new GetArticlePreviewUseCase().execute;
    this.getRelatedArticlesByTags = new GetRelatedArticlesByTagsUseCase().execute;
    this.createArticle = new CreateArticleUseCase().execute;
    this.editArticle = new EditArticleUseCase().execute;
    this.deleteArticle = new DeleteArticleUseCase().execute;
    this.deleteArticleTag = new DeleteArticleTagUseCase().execute;
  }
}
