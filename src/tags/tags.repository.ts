import {
  DeleteTagResult,
  GetTagArticleResult,
  GetTagArticlesResult,
  GetTagResult,
  TagArticleInputs,
  TagInputs
} from './tags.interfaces';
import { CreateTagUseCase } from './useCases/createTag';
import { EditTagUseCase } from './useCases/editTag';
import { CreateTagArticleUseCase } from './useCases/creataTagArticle';
import { DeleteTagUseCase } from './useCases/deleteTag';
import { DeleteTagRelationUseCase } from './useCases/deleteTagRelation';
import { GetTagArticlesUseCase } from './useCases/getTagArticles';
import { UpdateArticleRelationsUseCase } from './useCases/updateArticleRelations';

export class TagsRepository {
  public readonly createTag: (tag: TagInputs) => Promise<GetTagResult>;
  public readonly editTag: (tagId: string, tag: TagInputs) => Promise<GetTagResult>;
  public readonly createTagArticle: (tagArticle: TagArticleInputs) => Promise<GetTagArticleResult>;
  public readonly deleteTag: (tagId: string) => Promise<DeleteTagResult>;
  public readonly deleteTagRelation: (tagId: string, articleDate: string) => Promise<DeleteTagResult>;
  public readonly getTagArticles: (tagId: string) => Promise<GetTagArticlesResult>;
  public readonly updateArticleRelations: (
    articleId: string,
    articleDate: string,
    tagsToAdd: string[],
    tagsToRemove: string[]
    ) => Promise<DeleteTagResult>;

  constructor() {
    this.createTag = new CreateTagUseCase().execute;
    this.editTag = new EditTagUseCase().execute;
    this.createTagArticle = new CreateTagArticleUseCase().execute;
    this.deleteTag = new DeleteTagUseCase().execute;
    this.deleteTagRelation = new DeleteTagRelationUseCase().execute;
    this.getTagArticles = new GetTagArticlesUseCase().execute;
    this.updateArticleRelations = new UpdateArticleRelationsUseCase().execute;
  }
}
