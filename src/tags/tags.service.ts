import { GetArticleResult, GetArticlesResult } from '../articles/articles.interfaces';
import { ArticlesRepository } from '../articles/articles.repository';
import { DeleteTagResult, GetTagArticleResult, GetTagArticlesResult, GetTagResult, TagArticleInputs, TagInputs } from './tags.interfaces';
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
      //const result: DeleteTagResult = await this.repo.deleteTag(tagId);

      // cleanup, 
      // 1. remove from all articles tags property 
      // 2. delete all tag relations 

      const tagArticles: GetTagArticlesResult = await this.repo.getTagArticles(tagId);

      if (tagArticles && tagArticles.items) {
        const articlesPromises = tagArticles.items.map(
          tagArticle => this.articleRepo.getArticlePreview(tagArticle.article_link_pk)
        );
        const articlePreviews = await Promise.all(articlesPromises);

        // Going through articlePreviews
        if (articlePreviews) {
          const updateTagsPromises: any[] = [];
          const deleteAllTagRelationsPromises: any[] = [];

          articlePreviews.forEach(article => {
            // Nesting in Tags
            if (article.item && article.item.tags) {
              const articleTags = article.item.tags;

              //removing TagId from tags array
              var index = articleTags.indexOf(tagId);
              if (index !== -1) {
                articleTags.splice(index, 1);
              }

              updateTagsPromises.push(this.articleRepo.updateNewTagsArticle(article.item.entities_sort, articleTags));
              deleteAllTagRelationsPromises.push(this.repo.deleteTagRelation(tagId, article.item.entities_sort));
            }
          });

          // Updating articles with removed tags
          if (updateTagsPromises.length) {
            const updatedTagsResult = await Promise.all(updateTagsPromises);

            updatedTagsResult.forEach(item => {
              console.log(item?.item?.tags);
            });
          }

          //Deleting all relations
          if (deleteAllTagRelationsPromises.length) {
            const deleteAllTagRelationsResult = await Promise.all(deleteAllTagRelationsPromises);

            deleteAllTagRelationsResult.forEach(item => {
              console.log(item?.item?.tags);
            });
          }
        }
      }

      return { item: undefined };
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
}
