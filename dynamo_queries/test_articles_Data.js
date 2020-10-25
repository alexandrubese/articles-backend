var params = {
    TableName: 'test_articles',
    Item: { // a map of attribute name to AttributeValue
        entities: 'ARTICLE',
        entities_sort: '2020-02-04',
        article_link_pk: '9fa74cc3-95e6-41ea-be13-4697ce0ece21',
        article_link_sk: 'D',
        title: 'My 3rd article',
        body: 'Body of article 3',
        tags: []
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

var params = {
    TableName: 'test_articles',
    Item: { // a map of attribute name to AttributeValue
        entities: 'ARTICLE',
        entities_sort: '2020-03-04',
        article_link_pk: 'e9bdc9ae-4f16-402f-9584-c3f96faaf022',
        article_link_sk: 'D',
        title: 'My new article',
        body: 'Body of article',
        tags: ['0eb40262-2b15-42e8-96a5-fe5135718684', '5be86bd3-e123-4982-9cdf-252d29b6c59c']
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

var params = {
    TableName: 'test_articles',
    Item: { // a map of attribute name to AttributeValue
        entities: 'ARTICLE',
        entities_sort: '2020-04-04',
        article_link_pk: '48e406b7-5a5f-4050-b456-b672960ed7a0',
        article_link_sk: 'D',
        title: 'My second article',
        body: 'Body of second article',
        tags: ['0eb40262-2b15-42e8-96a5-fe5135718684']
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

var params = {
    TableName: 'test_articles',
    Item: { // a map of attribute name to AttributeValue
        entities: 'COMMENT',
        entities_sort: 'b6a8eae7-7703-4418-a03d-cdf590d062a7',
        article_link_pk: 'e9bdc9ae-4f16-402f-9584-c3f96faaf022',
        article_link_sk: '2020-03-04',
        author: 'Alex',
        body: 'body of comment1'
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

var params = {
    TableName: 'test_articles',
    Item: { // a map of attribute name to AttributeValue
        entities: 'COMMENT',
        entities_sort: 'e5a4aba4-e42c-4226-86d7-89177a15d1b5',
        article_link_pk: 'e9bdc9ae-4f16-402f-9584-c3f96faaf022',
        article_link_sk: '2020-04-04',
        author: 'John',
        body: 'body of comment2'
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

var params = {
    TableName: 'test_articles',
    Item: { // a map of attribute name to AttributeValue
        entities: 'TAG',
        entities_sort: '0eb40262-2b15-42e8-96a5-fe5135718684',
        title: 'science'
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


var params = {
    TableName: 'test_articles',
    Item: { // a map of attribute name to AttributeValue
        entities: 'TAG',
        entities_sort: '5be86bd3-e123-4982-9cdf-252d29b6c59c',
        title: 'entertainment'
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

var params = {
    TableName: 'test_articles',
    Item: { // a map of attribute name to AttributeValue
        entities: '0eb40262-2b15-42e8-96a5-fe5135718684',
        entities_sort: '2020-03-04',
        article_link_pk: 'e9bdc9ae-4f16-402f-9584-c3f96faaf022',
        article_link_sk: '#'
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

var params = {
    TableName: 'test_articles',
    Item: { // a map of attribute name to AttributeValue
        entities: '0eb40262-2b15-42e8-96a5-fe5135718684',
        entities_sort: '2020-04-04',
        article_link_pk: '48e406b7-5a5f-4050-b456-b672960ed7a0',
        article_link_sk: '#'
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

var params = {
    TableName: 'test_articles',
    Item: { // a map of attribute name to AttributeValue
        entities: '5be86bd3-e123-4982-9cdf-252d29b6c59c',
        entities_sort: '2020-03-04',
        article_link_pk: 'e9bdc9ae-4f16-402f-9584-c3f96faaf022',
        article_link_sk: '#'
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