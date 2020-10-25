var params = {
    TableName: 'test_articles',
    IndexName: 'gsi1_idx', // optional (if querying an index)
    // KeyConditionExpression: 'link_pk = :val and entities = :vall', // a string representing a constraint on the attribute
    KeyConditionExpression: 'article_link_pk = :val and article_link_sk = :hash',
    ExpressionAttributeValues: { // a map of substitutions for all attribute values
        ':val': 'e9bdc9ae-4f16-402f-9584-c3f96faaf022',
        ':hash': '#'
    },
    ScanIndexForward: true, // optional (true | false) defines direction of Query in the index

    ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
};
docClient.query(params, function (err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});