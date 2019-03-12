var search = require("../common/search");

function processQueryItem(result, book, info) {
  switch(book) {
    case "course":
      if (!result.course) {
        result.course = [];
      }
      result.course.push(info);
      break;
    case "treatise":
      if (!result.treatise) {
        result.treatise = [];
      }
      result.treatise.push(info);
      break;
    case "dialog":
      if (!result.dialog) {
        result.dialog = [];
      }
      result.dialog.push(info);
      break;
    default:
      if (!result.unknown) {
        result.unknown = [];
      }
      result.unknown.push(info);
      break;
  }
}

function generateSearchResponse(parms, searchResults, result) {
  var filteredCount = 0;
  var i;

  for (i=0; i < searchResults.length; i++) {
    searchResults[i].Items.forEach(function(val) {
      var info = {};

      // if not filtered process item
      if (!search.filter(parms, val.text)) {
        filteredCount++;

        info.book = val.book;
        info.unit = val.unit;
        info.location = "p" + val.pid;
        info.key = val.parakey;

        info.context = search.getContext(parms.queryTransformed, parms.query, val.text, parms.width);
        processQueryItem(result, val.book, info);
      }
    });
  }

  result.count = filteredCount;
  search.sortResults(result);
  return result;
}

module.exports = generateSearchResponse;

