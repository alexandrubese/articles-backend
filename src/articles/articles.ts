import { ApiHandler } from '../shared/api.interfaces';
import { ArticlesController } from './articles.controller';
import { ArticlesRepository } from './articles.repository';
import { ArticlesService } from './articles.service';
import { TagsService } from './../tags/tags.service';
import { TagsRepository } from './../tags/tags.repository';
import { CommentsRepository } from '../comments/comments.repository';
import { CommentsService } from '../comments/comments.service';


const repo: ArticlesRepository = new ArticlesRepository();
const service: ArticlesService = new ArticlesService(repo);

const tagsRepo: TagsRepository = new TagsRepository();
const tagsService: TagsService = new TagsService(tagsRepo, repo);

const commentsRepo: CommentsRepository = new CommentsRepository();
const commentsService: CommentsService = new CommentsService(commentsRepo);

const controller: ArticlesController = new ArticlesController(service, tagsService, commentsService);

export const getArticles: ApiHandler = controller.getArticles;
export const getArticle: ApiHandler = controller.getArticle;
export const createArticle: ApiHandler = controller.createArticle;
export const editArticle: ApiHandler = controller.editArticle;
export const deleteArticle: ApiHandler = controller.deleteArticle;
export const getRelatedArticlesByTags: ApiHandler = controller.getRelatedArticlesByTags;