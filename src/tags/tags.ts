import { ApiHandler } from '../../shared/api.interfaces';
import { TagsController } from './tags.controller';
import { TagsRepository } from './tags.repository';
import { TagsService } from './tags.service';
import { DynamoService } from '../../shared/dynamo-service';
import { ArticlesRepository } from '../articles/articles.repository';
import DynamoDB = require('aws-sdk/clients/dynamodb');

const docClient: DynamoDB = new DynamoService().getInstance();
const repo: TagsRepository = new TagsRepository(docClient);
const articlesRepo: ArticlesRepository = new ArticlesRepository(docClient);
const service: TagsService = new TagsService(repo, articlesRepo);
const controller: TagsController = new TagsController(service);

export const createTag: ApiHandler = controller.createTag;
export const createTagArticle: ApiHandler = controller.createTagArticle;
export const deleteTag: ApiHandler = controller.deleteTag;
