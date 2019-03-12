var search = require("../common/search");

function processQueryItem(result, book, info) {
  switch(book) {
    case "yaa":
      if (!result.yaa) {
        result.yaa = [];
      }
      result.yaa.push(info);
      break;
    case "grad":
      if (!result.grad) {
        result.grad = [];
      }
      result.grad.push(info);
      break;
    case "sg2002":
      if (!result.sg2002) {
        result.sg2002 = [];
      }
      result.sg2002.push(info);
      break;
    case "sg2003":
      if (!result.sg2003) {
        result.sg2003 = [];
      }
      result.sg2003.push(info);
      break;
    case "sg2004":
      if (!result.sg2004) {
        result.sg2004 = [];
      }
      result.sg2004.push(info);
      break;
    case "sg2005":
      if (!result.sg2005) {
        result.sg2005 = [];
      }
      result.sg2005.push(info);
      break;
    case "sg2006":
      if (!result.sg2006) {
        result.sg2006 = [];
      }
      result.sg2006.push(info);
      break;
    case "sg2007":
      if (!result.sg2007) {
        result.sg2007 = [];
      }
      result.sg2007.push(info);
      break;
    case "sg2008":
      if (!result.sg2008) {
        result.sg2008 = [];
      }
      result.sg2008.push(info);
      break;
    case "sg2009":
      if (!result.sg2009) {
        result.sg2009 = [];
      }
      result.sg2009.push(info);
      break;
    case "sg2010":
      if (!result.sg2010) {
        result.sg2010 = [];
      }
      result.sg2010.push(info);
      break;
    case "sg2011":
      if (!result.sg2011) {
        result.sg2011 = [];
      }
      result.sg2011.push(info);
      break;
    case "sg2012":
      if (!result.sg2012) {
        result.sg2012 = [];
      }
      result.sg2012.push(info);
      break;
    case "sg2013":
      if (!result.sg2013) {
        result.sg2013 = [];
      }
      result.sg2013.push(info);
      break;
    case "sg2014":
      if (!result.sg2014) {
        result.sg2014 = [];
      }
      result.sg2014.push(info);
      break;
    case "sg2015":
      if (!result.sg2015) {
        result.sg2015 = [];
      }
      result.sg2015.push(info);
      break;
    case "sg2016":
      if (!result.sg2016) {
        result.sg2016 = [];
      }
      result.sg2016.push(info);
      break;
    case "sg2017":
      if (!result.sg2017) {
        result.sg2017 = [];
      }
      result.sg2017.push(info);
      break;
    case "sg2018":
      if (!result.sg2018) {
        result.sg2018 = [];
      }
      result.sg2018.push(info);
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

