import {
  ApiCallback, ApiContext, ApiEvent
} from '../../shared/api.interfaces';
import { CommentsService } from './comments.service';
import { CreateCommentController } from './controllerUseCases/createComment';
import { DeleteCommentController } from './controllerUseCases/deleteComment';

export class CommentsController {
  private readonly service: CommentsService;
  
  public readonly createComment: (event: ApiEvent, context: ApiContext, callback: ApiCallback) => Promise<void>;
  public readonly deleteComment: (event: ApiEvent, context: ApiContext, callback: ApiCallback) => Promise<void>;

  constructor(service: CommentsService) {
    this.service = service;
    this.createComment = new CreateCommentController(this.service).execute;
    this.deleteComment = new DeleteCommentController(this.service).execute;
  }
}
