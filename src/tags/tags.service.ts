import { ArticlesRepository } from '../articles/articles.repository';
import { CreateTagServiceUseCase } from './serviceUseCases/createTag';
import { CreateTagArticleServiceUseCase } from './serviceUseCases/createTagArticle';
import { DeleteTagServiceUseCase } from './serviceUseCases/deleteTag';
import { DeleteTagRelationServiceUseCase } from './serviceUseCases/deleteTagRelation';
import { EditTagServiceUseCase } from './serviceUseCases/editTag';
import { UpdateArticleRelationServiceUseCase } from './serviceUseCases/updateArticleRelations';
import {
  DeleteTagResult,
  GetTagArticleResult,
  GetTagResult,
  TagArticleInputs,
  TagInputs
} from './tags.interfaces';
import { TagsRepository } from './tags.repository';

export class TagsService {
  private readonly repo: TagsRepository;
  private readonly articleRepo: ArticlesRepository;

  public readonly createTag: (tag: TagInputs) => Promise<GetTagResult>;
  public readonly editTag: (tagId: string, tag: TagInputs) => Promise<GetTagResult>;
  public readonly createTagArticle: (tagArticle: TagArticleInputs) => Promise<GetTagArticleResult>;
  public readonly deleteTag: (tagId: string) => Promise<DeleteTagResult>;
  public readonly deleteTagRelation: (tagId: string, articleDate: string) => Promise<DeleteTagResult>;
  public readonly updateArticleRelations: (
    articleId: string,
    articleDate: string,
    tagsToAdd: string[],
    tagsToRemove: string[]
  ) => Promise<DeleteTagResult>;

  constructor(repo: TagsRepository, articleRepo: ArticlesRepository) {
    this.repo = repo;
    this.articleRepo = articleRepo;
    
    this.createTag = new CreateTagServiceUseCase(this.repo).execute;
    this.editTag = new EditTagServiceUseCase(this.repo).execute;
    this.createTagArticle = new CreateTagArticleServiceUseCase(this.repo).execute;
    this.deleteTag = new DeleteTagServiceUseCase(this.repo, this.articleRepo).execute;
    this.deleteTagRelation = new DeleteTagRelationServiceUseCase(this.repo).execute;
    this.updateArticleRelations = new UpdateArticleRelationServiceUseCase(this.repo).execute;
  }
}
