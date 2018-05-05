/*eslint no-console: "warn"*/

var ApiBuilder = require("claudia-api-builder");
var api = new ApiBuilder();

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
    .then(function() {
      return generateResponse(parms, searchResults, result);
    })
    .catch(function(err) {
      console.error("dberror: %s", err.message);
      result.message = err.message;
      return result;
    });
});

api.post("/wom", function (request) {
  var search = require("./module/wom/search");
  var scan = require("./module/wom/scan");
  var generateResponse = require("./module/wom/response");

  var searchResults = [];
  var result = {
    domain: "https://wom.christmind.info",
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
    .then(function() {
      return generateResponse(parms, searchResults, result);
    })
    .catch(function(err) {
      console.error("dberror: %s", err.message);
      result.message = err.message;
      return result;
    });
});

