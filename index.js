/*eslint no-console: "warn"*/

var ApiBuilder = require("claudia-api-builder");
var api = new ApiBuilder();

module.exports = api;

api.post("/request", function(request) {
  return request;
});

api.post("/wom", function (request) {
  var search = require("./module/common/search");
  var scan = require("./module/common/scan");
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

  return scan("wom2", parms, searchResults)
    .then(function() {
      return generateResponse(parms, searchResults, result);
    })
    .catch(function(err) {
      result.message = err.message;
      return result;
    });
});

api.post("/acim", function (request) {
  var search = require("./module/common/search");
  var scan = require("./module/common/scan");
  var generateResponse = require("./module/acim/response");

  var searchResults = [];
  var result = {
    domain: "https://acim.christmind.info",
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

  return scan("acim2", parms, searchResults)
    .then(function() {
      return generateResponse(parms, searchResults, result);
    })
    .catch(function(err) {
      result.message = err.message;
      return result;
    });
});

api.post("/raj", function (request) {
  var search = require("./module/common/search");
  var scan = require("./module/common/scan");
  var generateResponse = require("./module/raj/response");

  var searchResults = [];
  var result = {
    domain: "https://raj.christmind.info",
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

  return scan("raj", parms, searchResults)
    .then(function() {
      return generateResponse(parms, searchResults, result);
    })
    .catch(function(err) {
      result.message = err.message;
      return result;
    });
});

api.post("/acol", function (request) {
  var search = require("./module/common/search");
  var scan = require("./module/common/scan");
  var generateResponse = require("./module/acol/response");

  var searchResults = [];
  var result = {
    domain: "https://acol.christmind.info",
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

  //used for ACOL searches
  result.authorized = parms.authorized;

  //for unauthorized searches, keep track of items filtered because they are restricted
  result.restricted = 0;

  //console.log("POST /search: ", request.body);

  return scan("acol", parms, searchResults)
    .then(function() {
      return generateResponse(parms, searchResults, result);
    })
    .catch(function(err) {
      result.message = err.message;
      return result;
    });
});

api.post("/acimoe", function (request) {
  var search = require("./module/common/search");
  var scan = require("./module/common/scan");
  var generateResponse = require("./module/acimoe/response");

  var searchResults = [];
  var result = {
    domain: "https://acimoe.christmind.info",
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

  return scan("acimoe", parms, searchResults)
    .then(function() {
      return generateResponse(parms, searchResults, result);
    })
    .catch(function(err) {
      result.message = err.message;
      return result;
    });
});

