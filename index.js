/*global require, module*/

var ApiBuilder = require("claudia-api-builder");
var AWS = require("aws-sdk");
var api = new ApiBuilder();
var dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = api;

api.post("/request", function(request) {
  return request;
});

// use {} for dynamic path parameters
api.post("/search", function (request) {
  "use strict";

  var search = require("./module/search");

  var result = {
    domain: "https://www.christmind.info",
    message: "OK"
  };

  var parms = search.parseRequest(request);

  if (parms.error) {
    result.message = parms.message;
    return result;
  }

  result.source = parms.source;
  result.width = parms.width;
  result.query = parms.query;
  result.queryTransformed = parms.queryTransformed;

  console.log("POST /search: ", request.body);

  var dbParams = {
    TableName: parms.source,
    ProjectionExpression: "book, bid, #kee, #unt, pid, #txt",
    FilterExpression: "contains(#txt, :v_qs)",
    ExpressionAttributeNames: {
      "#unt": "unit",
      "#txt": "text",
      "#kee": "key"
    },
    ExpressionAttributeValues: {
      ":v_qs": parms.queryTransformed
    }
  };

  if (parms.startKey) {
    //console.log("api.post assigning startKey to dbParams.ExclusiveStartKen");
    dbParams.ExclusiveStartKey = parms.startKey;
  }

  console.log("api.post calling dynamoDb");
  return dynamoDb.scan(dbParams).promise().then(function(response) {
    var i;
    var filteredCount = 0;
    //console.log("api.post-scan returned, processing results");

    for (i = 0; i < response.Items.length; i++) {
      var info = {};
      var item = response.Items[i];

      //filter matches from result set returned to user to
      //user specified terms or default to word boundaries
      if (search.filter(parms, item.text)) {
        //console.log("key: %s filtered from result set", item.key);
        continue;
      }

      filteredCount++;
      info.table = parms.source;
      info.book = item.book;
      info.unit = item.unit;
      info.location = "#p" + item.pid;
      info.key = item.key;
      info.base = "/" + parms.source + "/" + item.book + "/" + item.unit + "/";
      info.context = search.getContext(parms.queryTransformed, parms.query, item.text, parms.width);

      search.processQueryItem(result, parms.source, item.book, info);

    }

    result.count = filteredCount;
    search.sortResults(result);

    //inform caller not all db records scanned
    if (typeof response.LastEvaluatedKey !== "undefined") {
      result.startKey = response.LastEvaluatedKey;
    }

    return result;

  }, function(err) {
    console.log("dynamoDb error", err);
    result.message = "Database error";
    result.error = err;
    return result;
  });

});

