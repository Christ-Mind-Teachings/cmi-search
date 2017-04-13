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
  var searchResults = [];

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

  function scan(options) {
    var parms = {
      TableName: options.source,
      ProjectionExpression: "book, bid, #kee, #unt, pid, #txt",
      FilterExpression: "contains(#txt, :v_qs)",
      ExpressionAttributeNames: {
        "#unt": "unit",
        "#txt": "text",
        "#kee": "key"
      },
      ExpressionAttributeValues: {
        ":v_qs": options.queryTransformed
      }
    };

    if (options.startKey) {
      parms.ExclusiveStartKey = options.startKey;
    }

    return dynamoDb.scan(parms).promise();
  }

  function generateSearchResponse(parms) {
    var filteredCount = 0;
    var i;

    for (i=0; i < searchResults.length; i++) {
      searchResults[i].Items.forEach(function(val) {
        var info = {};

        // if not filtered process item
        if (!search.filter(parms, val.text)) {
          filteredCount++;

          info.table = parms.source;
          info.book = val.book;
          info.unit = val.unit;
          info.location = "#p" + val.pid;
          info.key = val.key;
          info.base = "/" + parms.source + "/" + val.book + "/" + val.unit + "/";

          info.context = search.getContext(parms.queryTransformed, parms.query, val.text, parms.width);
          search.processQueryItem(result, parms.source, val.book, info);
        }
      });
    }

    //alert caller that not all rows were scanned in the search
    if (parms.startKey) {
      result.startKey = parms.startKey;
      result.message = "Incomplete Result";
    }

    result.count = filteredCount;
    search.sortResults(result);
    return result;
  }

return scan(parms).then(function(response) {
  if (response.LastEvaluatedKey) {
    searchResults.push(response);
    parms.startKey = response.LastEvaluatedKey;
    //console.log("response1: count: %s, startKey: ", response.Items.length, parms.startKey);
    return scan(parms);
  }
  else {
    return response;
  }
}).then(function(response) {
  searchResults.push(response);
  if (response.startKey) {
    parms.startKey = response.startKey;
  }
  else {
    delete parms.startKey;
  }
  return generateSearchResponse(parms);

  }).catch(function(err) {
    console.error("dberror: %s", err.message);
    result.message = err.message;
    return result;
  });

});

