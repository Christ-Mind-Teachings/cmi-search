/*eslint no-console: "warn"*/

var search = require("../common/search");

// the chapter portion of the parakey for unrestricted chapters
const course = [3,4,5,6,7,8,11,14,16,20,21,22,28];
const treatise = [2,13,14,17,27,44,46,57];
const dialog = [1,3,7,27];

/*
 * Returns true for restricted chapters, false otherwise
 *
 * args: key
 *
 * 'key' is the items parakey. The chapter portion of the key is converted into a number
 * and checked with the corresponding unrestricted chapter array. If found false is 
 * returned to indicate the item is not restricted. True is returned otherwise.
 */
function isRestricted(book, key) {

  //console.log("isRestricted book: %s, key: %s", book, key);

  let chapter = parseInt(key.substring(5,7),10);
  let unrestricted;

  switch(book) {
    case "course":
      unrestricted = course;
      break;
    case "treatise":
      unrestricted = treatise;
      break;
    case "dialog":
      unrestricted = dialog;
      break;
    default:
      console.log("isRestricted() invalid book: %s", book);
      return true;
  }

  if (unrestricted.includes(chapter)) {
    return false; //not restricted
  }
  else {
    return true; //restricted
  }
}

function processQueryItem(result, book, info, authorized) {
  //if user not authorized to search restricted content check if item is restricted
  //and return without returning the item
  if (!authorized && isRestricted(book, info.key)) {
    result.restricted++;
    return;
  }

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
        processQueryItem(result, val.book, info, result.authorized);
      }
    });
  }

  result.count = filteredCount;
  search.sortResults(result);
  return result;
}

module.exports = generateSearchResponse;

