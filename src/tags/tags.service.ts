import { GetArticleResult } from '../articles/articles.interfaces';
import { ArticlesRepository } from '../articles/articles.repository';
import {
  DeleteTagResult,
  GetTagArticleResult,
  GetTagArticlesResult,
  GetTagResult,
  TagArticleInputs,
  TagInputs
} from './tags.interfaces';
import { TagsRepository } from './tags.repository';

export class TagsService {
  private readonly repo: TagsRepository;
  private readonly articleRepo: ArticlesRepository;
  // eslint-disable-next-line no-undef
  constructor(repo: TagsRepository, articleRepo: ArticlesRepository) {
    this.repo = repo;
    this.articleRepo = articleRepo;
  }
  public async createTag(tag: TagInputs): Promise<GetTagResult> {
    try {
      const result: GetTagResult = await this.repo.createTag(tag);

      return result;
    } catch (e) {
      console.log('Tags Service fn createTag:', e);
      throw e;
    }
  }

  public async editTag(tagId: string, tag: TagInputs): Promise<GetTagResult> {
    try {
      const result: GetTagResult = await this.repo.editTag(tagId, tag);

      return result;
    } catch (e) {
      console.log('Tags Service fn editTag:', e);
      throw e;
    }
  }

  public async createTagArticle(tagArticle: TagArticleInputs): Promise<GetTagArticleResult> {
    try {
      const result: GetTagArticleResult = await this.repo.createTagArticle(tagArticle);

      return result;
    } catch (e) {
      console.log('Tags Service fn createTagArticle:', e);
      throw e;
    }
  }

  public async deleteTag(tagId: string): Promise<DeleteTagResult> {
    try {
      const result: DeleteTagResult = await this.repo.deleteTag(tagId);

      // cleanup, 
      // 1. remove from all articles tags property 
      // 2. delete all tag relations 
      // Using Promise.all approach since we might have more than 25 elements and hit the BatchWriteItem limit
      const tagArticles: GetTagArticlesResult = await this.repo.getTagArticles(tagId);

      if (tagArticles && tagArticles.items) {
        const removeTagArticlesPromises: Promise<GetArticleResult>[] = [];
        const deleteAllTagRelationsPromises: Promise<DeleteTagResult>[] = [];

        tagArticles.items.forEach(tagArticle => {
          removeTagArticlesPromises.push(this.articleRepo.removeArticleTag(tagArticle.entities_sort, tagId));
          deleteAllTagRelationsPromises.push(this.repo.deleteTagRelation(tagId, tagArticle.entities_sort));
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

  public async deleteTagRelation(tagId: string, articleDate: string): Promise<DeleteTagResult> {
    try {
      const result: DeleteTagResult = await this.repo.deleteTagRelation(tagId, articleDate);

      return result;
    } catch (e) {
      console.log('Tags Service fn deleteTagRelation:', e);
      throw e;
    }
  }

  public async updateArticleRelations(
    articleId: string,
    articleDate: string,
    tagsToAdd: string[],
    tagsToRemove: string[]
  ): Promise<DeleteTagResult> {
    try {
      const result: DeleteTagResult = await this.repo.updateArticleRelations(
        articleId,
        articleDate,
        tagsToAdd,
        tagsToRemove
      );

      return result;
    } catch (e) {
      console.log('Tags Service fn deleteTagRelation:', e);
      throw e;
    }
  }

}
