import { ApiHandler } from '../../shared/api.interfaces';
import { ArticlesController } from './articles.controller';
import { ArticlesRepository } from './articles.repository';
import { ArticlesService } from './articles.service';
import { DynamoService } from '../../shared/dynamo-service';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const docClient: DocumentClient = new DynamoService().getInstance();
const repo: ArticlesRepository = new ArticlesRepository(docClient);
const service: ArticlesService = new ArticlesService(repo);
const controller: ArticlesController = new ArticlesController(service);

export const getArticles: ApiHandler = controller.getArticles;
