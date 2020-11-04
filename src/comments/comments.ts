import { ApiHandler } from '../../shared/api.interfaces';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';
import { DynamoService } from '../../shared/dynamo-service';
import DynamoDB = require('aws-sdk/clients/dynamodb');

const docClient: DynamoDB = new DynamoService().getInstance();
const repo: CommentsRepository = new CommentsRepository(docClient);
const service: CommentsService = new CommentsService(repo);
const controller: CommentsController = new CommentsController(service);

export const putComments: ApiHandler = controller.putComments;
