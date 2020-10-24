var params = {
    TableName: 'test_table',
    KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
        { // Required HASH type attribute
            AttributeName: 'userId',
            KeyType: 'HASH',
        },
        { // Optional RANGE key type for HASH + RANGE tables
            AttributeName: 'nationality',
            KeyType: 'RANGE',
        }
    ],
    AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        {
            AttributeName: 'userId',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'nationality',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'race',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        }
        // ... more attributes ...
    ],
    ProvisionedThroughput: { // required provisioned throughput for the table
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
    LocalSecondaryIndexes: [ // optional (list of LocalSecondaryIndex)
        {
            IndexName: 'userId-race-index',
            KeySchema: [
                { // Required HASH type attribute - must match the table's HASH key attribute name
                    AttributeName: 'userId',
                    KeyType: 'HASH',
                },
                { // alternate RANGE key attribute for the secondary index
                    AttributeName: 'race',
                    KeyType: 'RANGE',
                }
            ],
            Projection: { // required
                ProjectionType: 'ALL'
            },
        },

    ],
};
dynamodb.createTable(params, function (err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response

});