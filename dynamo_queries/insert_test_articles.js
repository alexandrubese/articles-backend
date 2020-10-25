var params = {
    TableName: 'test_articles',
    Item: { // a map of attribute name to AttributeValue
        entities: 'ARTICLE',
        entities_sort: '2020-03-04',
        article_link_pk: 'd1e32-wd1f-1fdsf',
        title: 'My first article',
        body: 'Body of first article'
        // attribute_value (string | number | boolean | null | Binary | DynamoDBSet | Array | Object)
        // more attributes...
    },
    ReturnValues: 'NONE', // optional (NONE | ALL_OLD)
    ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
    ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
};
docClient.put(params, function (err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});