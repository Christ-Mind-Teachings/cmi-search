/*global require, module*/

var ApiBuilder = require("claudia-api-builder");
//var AWS = require("aws-sdk");
var api = new ApiBuilder();
//var dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = api;

api.post("/request", function(request) {
  return request;
});

api.post("/search", function (request) {
  var search = require("./module/search");
  var scan = require("./module/scan");
  var generateResponse = require("./module/response");

  var searchResults = [];
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

  //console.log("POST /search: ", request.body);

  return scan(parms, searchResults)
    .then(function(response) {
      return generateResponse(parms, searchResults, result);
    })
    .catch(function(err) {
      console.error("dberror: %s", err.message);
      result.message = err.message;
      return result;
    });
});

api.post("/search2", function (request) {
  var search = require("./module/search2");
  var scan = require("./module/scan2");
  var generateResponse = require("./module/response2");

  var searchResults = [];
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

  //console.log("POST /search: ", request.body);

  return scan(parms, searchResults)
    .then(function(response) {
      return generateResponse(parms, searchResults, result);
    })
    .catch(function(err) {
      console.error("dberror: %s", err.message);
      result.message = err.message;
      return result;
    });
});

