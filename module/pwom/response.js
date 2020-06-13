var search = require("../common/search");

function processQueryItem(result, book, info) {
  switch(book) {
    case "woh":
      if (!result.woh) {
        result.woh = [];
      }
      result.woh.push(info);
      break;
    case "wot":
      if (!result.wot) {
        result.wot = [];
      }
      result.wot.push(info);
      break;
    case "wok":
      if (!result.wok) {
        result.wok = [];
      }
      result.wok.push(info);
      break;
    case "lj":
      if (!result.lj) {
        result.lj = [];
      }
      result.lj.push(info);
      break;
    case "wos":
      if (!result.wos) {
        result.wos = [];
      }
      result.wos.push(info);
      break;
    case "early":
      if (!result.early) {
        result.early = [];
      }
      result.early.push(info);
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

