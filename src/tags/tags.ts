import { ApiHandler } from '../../shared/api.interfaces';
import { TagsController } from './tags.controller';
import { TagsRepository } from './tags.repository';
import { TagsService } from './tags.service';
import { ArticlesRepository } from '../articles/articles.repository';

const repo: TagsRepository = new TagsRepository();
const articlesRepo: ArticlesRepository = new ArticlesRepository();
const service: TagsService = new TagsService(repo, articlesRepo);
const controller: TagsController = new TagsController(service);

export const createTag: ApiHandler = controller.createTag;
export const editTag: ApiHandler = controller.editTag;
export const createTagArticle: ApiHandler = controller.createTagArticle;
export const deleteTag: ApiHandler = controller.deleteTag;
