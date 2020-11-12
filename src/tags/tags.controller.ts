import {
  ApiCallback, ApiContext, ApiEvent
} from '../shared/api.interfaces';
import { CreateTagController } from './controllerUseCases/createTag';
import { CreateTagArticleController } from './controllerUseCases/createTagArticle';
import { DeleteTagController } from './controllerUseCases/deleteTag';
import { EditTagController } from './controllerUseCases/editTag';
import { TagsService } from './tags.service';

export class TagsController {
  private readonly service: TagsService;
  
  public readonly createTag: (event: ApiEvent, context: ApiContext, callback: ApiCallback) => Promise<void>;
  public readonly editTag: (event: ApiEvent, context: ApiContext, callback: ApiCallback) => Promise<void>;
  public readonly deleteTag: (event: ApiEvent, context: ApiContext, callback: ApiCallback) => Promise<void>;
  public readonly createTagArticle: (event: ApiEvent, context: ApiContext, callback: ApiCallback) => Promise<void>;

  constructor(service: TagsService) {
    this.service = service;

    this.createTag = new CreateTagController(this.service).execute;
    this.editTag = new EditTagController(this.service).execute;
    this.deleteTag = new DeleteTagController(this.service).execute;
    this.createTagArticle = new CreateTagArticleController(this.service).execute;
  }
}
