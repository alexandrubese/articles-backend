import { ApiHandler } from '../../shared/api.interfaces';
import { ArticlesController } from './articles.controller';
import { ArticlesRepository } from './articles.repository';
import { ArticlesService } from './articles.service';
import { TagsService } from './../tags/tags.service';
import { TagsRepository } from './../tags/tags.repository';
import { DynamoService } from '../../shared/dynamo-service';
import DynamoDB = require('aws-sdk/clients/dynamodb');

const docClient: DynamoDB = new DynamoService().getInstance();
const repo: ArticlesRepository = new ArticlesRepository(docClient);
const service: ArticlesService = new ArticlesService(repo);
const tagsRepo: TagsRepository = new TagsRepository(docClient);
const tagsService: TagsService = new TagsService(tagsRepo, repo);
const controller: ArticlesController = new ArticlesController(service, tagsService);

export const getArticles: ApiHandler = controller.getArticles;
export const getArticle: ApiHandler = controller.getArticle;
export const createArticle: ApiHandler = controller.createArticle;
export const getRelatedArticlesByTags: ApiHandler = controller.getRelatedArticlesByTags;