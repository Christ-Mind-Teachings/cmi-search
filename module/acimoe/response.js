var search = require("../common/search");

function processQueryItem(result, book, info) {
  switch(book) {
    case "text":
      if (!result.text) {
        result.text = [];
      }
      result.text.push(info);
      break;
    case "workbook":
      if (!result.workbook) {
        result.workbook = [];
      }
      result.workbook.push(info);
      break;
    case "manual":
      if (!result.manual) {
        result.manual = [];
      }
      result.manual.push(info);
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

