import { GetArticleResult } from '../../articles/articles.interfaces';
import { ArticlesRepository } from '../../articles/articles.repository';
import { DeleteTagResult, GetTagArticlesResult } from '../tags.interfaces';
import { TagsRepository } from '../tags.repository';

export class DeleteTagServiceUseCase {
    private readonly tagsRepo: TagsRepository;
    private readonly articleRepo: ArticlesRepository;
  
    constructor(tagsRepo: TagsRepository, articleRepo: ArticlesRepository) {
      this.tagsRepo = tagsRepo;
      this.articleRepo = articleRepo;
    }

    public execute = async (tagId: string): Promise<DeleteTagResult> => {
      try {
        const result: DeleteTagResult = await this.tagsRepo.deleteTag(tagId);
      
        // cleanup, 
        // 1. remove from all articles tags property 
        // 2. delete all tag relations 
        // Using Promise.all approach since we might have more than 25 elements and hit the BatchWriteItem limit
        const tagArticles: GetTagArticlesResult = await this.tagsRepo.getTagArticles(tagId);
      
        if (tagArticles && tagArticles.items) {
          const removeTagArticlesPromises: Promise<GetArticleResult>[] = [];
          const deleteAllTagRelationsPromises: Promise<DeleteTagResult>[] = [];
      
          tagArticles.items.forEach(tagArticle => {
            removeTagArticlesPromises.push(this.articleRepo.deleteArticleTag(tagArticle.entities_sort, tagId));
            deleteAllTagRelationsPromises.push(this.tagsRepo.deleteTagRelation(tagId, tagArticle.entities_sort));
          });
      
          //Removing tags from articles
          const removedTagFromArticles = await Promise.all(removeTagArticlesPromises);
          if (!removedTagFromArticles) {
            throw new Error(`Error while trying to remove tag ${tagId} from articles`);
          }
      
          //Deleting all relations
          if (deleteAllTagRelationsPromises.length) {
            const deleteAllTagRelationsResult = await Promise.all(deleteAllTagRelationsPromises);
      
            if (!deleteAllTagRelationsResult) {
              throw new Error(`Error while trying to delete tag relations for tag: ${tagId}`);
            }
          }
        }
      
        return result;
      
      } catch (e) {
        console.log('Tags Service fn deleteTag:', e);
        throw e;
      }
    }
}
