var copy = require('copy-dynamodb-table').copy;

var globalAWSConfig = { // AWS Configuration object http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    accessKeyId: 'fakeaccesskey', // Needed to connect to localdb
    endpoint: 'http://localhost:8002',
    region: 'localhost',
    secretAccessKey: 'fakesecretkey', // Needed to 
};

copy({
    config: globalAWSConfig, // config for AWS
    source: {
        tableName: 'test_articles_copy', // required
    },
    destination: {
        tableName: 'test_articles', // required
    },
    log: true, // default false
    create: true // create destination table if not exist
},
    function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
    });