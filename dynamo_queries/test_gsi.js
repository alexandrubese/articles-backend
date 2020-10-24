var params = {
    TableName: 'test_gsi',
    KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
        { // Required HASH type attribute
            AttributeName: 'entities',
            KeyType: 'HASH',
        },
        { // Optional RANGE key type for HASH + RANGE tables
            AttributeName: 'entities_sort',
            KeyType: 'RANGE',
        }
    ],
    AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        {
            AttributeName: 'entities',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'entities_sort',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'gsi_sort',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        }
        // ... more attributes ...
    ],
    ProvisionedThroughput: { // required provisioned throughput for the table
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
    GlobalSecondaryIndexes: [ // optional (list of GlobalSecondaryIndex)
        {
            IndexName: 'gsi1_idx',
            KeySchema: [
                { // Required HASH type attribute
                    AttributeName: 'entities_sort',
                    KeyType: 'HASH',
                },
                { // Optional RANGE key type for HASH + RANGE secondary indexes
                    AttributeName: 'gsi_sort',
                    KeyType: 'RANGE',
                }
            ],
            Projection: { // attributes to project into the index
                ProjectionType: 'ALL', // (ALL | KEYS_ONLY | INCLUDE)
            },
            ProvisionedThroughput: { // throughput to provision to the index
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        }
        // ... more global secondary indexes ...
    ]
};
dynamodb.createTable(params, function (err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response

});