We need the {sourceMap : true} in tsconfig.json for debugging locally
When deploying to prod, we want to set {sourceMap : false}

To link to a AWS account:

npm i -g serverless

Go to IAM and create a new user that has Admin permissions(this is the user serverless will use to create resources) Once the setup is done, copy the KEY and SECRET and run the command:

serverless config credentials --provider aws --key {KEY} --secret {SECRET} --profile serverlessUser

The serverlesUser profile is linked in the serverless.yml file, so if you change the profile name, make sure to update the serverless.yml file as well.

For local development:
1. start the local-dynamodb: npm run local-dynamodb
2. start the local serverless instance: npm start (or your debug configuration with "npm start" for debugging)


Things to do: 
0. Implement deleteTagRelation(tag_id, article_date) - Done

1. Cleanup after tag delete (delete from article tags and then delete all relations)
    - first get all the relations based on tagid in a variable "tagRelations" go through all articles in the list based on article id, make the updates, afterwards use the same "tagRelations" object and create delete promises for each element using the deleteTagRelation(tag_id, article_date)

    delete all tags by tagId: - Done 

2. Edit Article (and update of tags property on article + relationships after ) - 
    - 1st Approach : update the tags property, then delete + or add new ones based on GSI1PK and GSISK where : article_link_pk= articleId, and article_link_sk = #, this will give you all the lines for tag relations for this article, 
    { entities: tagId,
      entities_sort: article_date,
      article_link_pk: article_id,
      article_link_sk: '#' }

    Use deleteTagRelation(tag_id, article_date) based on the object to delete relations for removed tags, for added tags, just use the createTagArticles() using:
    { field: 'article_id', type: 'string' },
    { field: 'tag_id', type: 'string' },
    { field: 'article_date', type: 'string' }
    
    
    #data needs to be changed: article_link_sk = #tag_id from #, check implications! also check nr. 2

    -2nd Approach: for updating relationships on update return all_old (old data), you will have the new data on post, make a diff between them and make the updates accordingly( add/delete ) you might already have the tagRelations object fetched and can use it to add/delete ones so nr.1 is not necesary
3. Delete comment endpoint
4. Edit tag
5. Delete Article (maintain all relationships, just change an "active" flag to false)
