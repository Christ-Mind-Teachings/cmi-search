var search = require("./search");

function generateSearchResponse(parms, searchResults, result) {
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

  result.count = filteredCount;
  search.sortResults(result);
  return result;
}

module.exports = generateSearchResponse;

