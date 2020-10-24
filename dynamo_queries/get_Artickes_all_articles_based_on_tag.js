var params = {
    TableName: 'test_articles',
    //IndexName: 'gsi1_idx', // optional (if querying an index)
    // KeyConditionExpression: 'link_pk = :val and entities = :vall', // a string representing a constraint on the attribute
    KeyConditionExpression: 'entities = :val ',
    ExpressionAttributeValues: { // a map of substitutions for all attribute values
        ':val': 'd9sdfafa-asdfa2asdfa-sd',
    },
    ScanIndexForward: true, // optional (true | false) defines direction of Query in the index
    ConsistentRead: false, // optional (true | false)
    Select: 'ALL_ATTRIBUTES', // optional (ALL_ATTRIBUTES | ALL_PROJECTED_ATTRIBUTES | 
    //           SPECIFIC_ATTRIBUTES | COUNT)
    ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
};
docClient.query(params, function (err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});