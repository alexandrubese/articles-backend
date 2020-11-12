import {
  ArticleInputs,
  EditArticleInputs,
  GetArticleResult,
  GetArticlesResult,
} from './articles.interfaces';
import { ArticlesRepository } from './articles.repository';
import { CreateArticleServiceUseCase } from './serviceUseCases/createArticle';
import { DeleteArticleServiceUseCase } from './serviceUseCases/deleteArticle';
import { EditArticleServiceUseCase } from './serviceUseCases/editArticle';
import { GetArticleServiceUseCase } from './serviceUseCases/getArticle';
import { GetArticlesServiceUseCase } from './serviceUseCases/getArticles';
import { GetRelatedArticlesByTagsServiceUseCase } from './serviceUseCases/getRelatedArticlesByTags';

export class ArticlesService {
  private readonly repo: ArticlesRepository;

  public readonly getArticles: () => Promise<GetArticlesResult>;
  public readonly getArticle: (articleId: string) => Promise<GetArticleResult>;
  public readonly getRelatedArticlesByTags: (articleId: string) => Promise<GetArticlesResult>;
  public readonly createArticle: (article: ArticleInputs) => Promise<GetArticleResult>;
  public readonly editArticle: (editArticleInputs: EditArticleInputs) => Promise<GetArticleResult>;
  public readonly deleteArticle: (articleId: string) => Promise<GetArticleResult>;

  constructor(repo: ArticlesRepository) {
    this.repo = repo;
    this.getArticles = new GetArticlesServiceUseCase(this.repo).execute;
    this.getArticle = new GetArticleServiceUseCase(this.repo).execute;
    this.getRelatedArticlesByTags = new GetRelatedArticlesByTagsServiceUseCase(this.repo).execute;
    this.createArticle = new CreateArticleServiceUseCase(this.repo).execute;
    this.editArticle = new EditArticleServiceUseCase(this.repo).execute;
    this.deleteArticle = new DeleteArticleServiceUseCase(this.repo).execute;
  }
}
