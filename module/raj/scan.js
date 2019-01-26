/*eslint no-console: "warn"*/

var AWS = require("aws-sdk");
var dynamoDb = new AWS.DynamoDB.DocumentClient();

function scan(options, searchResults) {
  var promise = new Promise(function(resolve, reject) {

    var parms = {
      TableName: "raj",
      ProjectionExpression: "book, #kee, #unt, pid, #txt",
      FilterExpression: "contains(#txt, :v_qs)",
      ExpressionAttributeNames: {
        "#unt": "unit",
        "#txt": "text",
        "#kee": "parakey"
      },
      ExpressionAttributeValues: {
        ":v_qs": options.queryTransformed
      }
    };

    function cb(err, response) {
      if (err) {
        reject(err);
      }
      else if (response.LastEvaluatedKey) {
        console.log("response: count: %s, startKey: ", response.Items.length, response.LastEvaluatedKey);
        parms.ExclusiveStartKey = response.LastEvaluatedKey;
        dynamoDb.scan(parms, cb);
      }
      else {
        resolve(searchResults);
      }
      searchResults.push(response);
    }

    dynamoDb.scan(parms, cb);
  });

  return promise;
}

module.exports = scan;

