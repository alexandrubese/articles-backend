import { ApiHandler } from '../../shared/api.interfaces';
import { TagsController } from './tags.controller';
import { TagsRepository } from './tags.repository';
import { TagsService } from './tags.service';
import { DynamoService } from '../../shared/dynamo-service';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const docClient: DocumentClient = new DynamoService().getInstance();
const repo: TagsRepository = new TagsRepository(docClient);
const service: TagsService = new TagsService(repo);
const controller: TagsController = new TagsController(service);

export const createTag: ApiHandler = controller.createTag;
export const createTagArticle: ApiHandler = controller.createTagArticle;
