import { ApiHandler } from '../shared/api.interfaces';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';

const repo: CommentsRepository = new CommentsRepository();
const service: CommentsService = new CommentsService(repo);
const controller: CommentsController = new CommentsController(service);

export const createComment: ApiHandler = controller.createComment;
export const deleteComment: ApiHandler = controller.deleteComment;
