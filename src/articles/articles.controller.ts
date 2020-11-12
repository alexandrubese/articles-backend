import {
  ApiCallback, ApiContext, ApiEvent
} from '../../shared/api.interfaces';
import { CommentsService } from '../comments/comments.service';
import { TagsService } from '../tags/tags.service';
import { ArticlesService } from './articles.service';
import { CreateArticleController } from './controllerUseCases/createArticle';
import { DeleteArticleController } from './controllerUseCases/deleteArticle';
import { EditArticleController } from './controllerUseCases/editArticle';
import { GetArticleController } from './controllerUseCases/getArticle';
import { GetArticlesController } from './controllerUseCases/getArticles';
import { GetRelatedArticlesByTagsController } from './controllerUseCases/getRelatedArticlesByTags';

export class ArticlesController {
  private readonly service: ArticlesService;
  private readonly tagsService: TagsService;
  private readonly commentsService: CommentsService;

  public readonly getArticles: (event: ApiEvent, context: ApiContext, callback: ApiCallback) => Promise<void>;
  public readonly getArticle: (event: ApiEvent, context: ApiContext, callback: ApiCallback) => Promise<void>;
  public readonly createArticle: (event: ApiEvent, context: ApiContext, callback: ApiCallback) => Promise<void>;
  public readonly editArticle: (event: ApiEvent, context: ApiContext, callback: ApiCallback) => Promise<void>;
  public readonly deleteArticle: (event: ApiEvent, context: ApiContext, callback: ApiCallback) => Promise<void>;
  public readonly getRelatedArticlesByTags: (event: ApiEvent, context: ApiContext, callback: ApiCallback) 
    => Promise<void>;

  constructor(service: ArticlesService, tagsService: TagsService, commentsService: CommentsService) {
    this.service = service;
    this.tagsService = tagsService;
    this.commentsService = commentsService;
    this.getArticles = new GetArticlesController(this.service).execute;
    this.getArticle = new GetArticleController(this.service).execute;
    this.createArticle = new CreateArticleController(this.service, this.tagsService).execute;
    this.editArticle = new EditArticleController(this.service, this.tagsService).execute;
    this.getRelatedArticlesByTags = new GetRelatedArticlesByTagsController(this.service).execute;
    this.deleteArticle = new DeleteArticleController(this.service, this.tagsService, this.commentsService).execute;
  }
}
