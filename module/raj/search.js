/*eslint no-console: "warn"*/

function sortResults(result) {
  var key;

  for (key in result) {
    if (Array.isArray(result[key])) {
      result[key].sort(function(a,b) {
        return a.key - b.key;
      });
    }
  }
}

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

/*
 * filter result set
 *
 * Default filter: all matches must start at word boundary, filter all the rest
 */
function filter(request, text) {
  var pos;
  var result = false;

  //don't filter result set if 'filter' passed to request
  if (request.filter) {
    result = false;
  }
  else {
    //default filter: query term must start at a word boundary
    pos = text.indexOf(request.queryTransformed);

    if (pos === -1) {
      //this should never happen
      console.log("Yikes!! filter(): query string not found in text");
    }
    else if (pos > 0) {
      if (/\w/.test(text.charAt(pos-1))) {
        console.log("filtered paragraph(%s): ", pos, text);
        result = true;
      }
    }
  }

  return result;
}


//lowercase and remove punction from query string
function prepareQueryString(query) {
  var result = query.toLowerCase();
  return result.replace(/[^\w\s]/, "");
}

function parseRequest(request) {
  var parms = {message: []};

  //if no parms given set error indicator and return
  if (request.body === null || typeof request.body === "undefined") {
    parms.message.push("request body missing");
    parms.error = true;
    return parms;
  }

  var userRequest = request.body;

  if (!userRequest.query) {
    parms.message.push("Error: body.query not specified");
  }
  else {
    parms.query = userRequest.query;
  }

  if (userRequest.startKey) {
    parms.startKey = userRequest.startKey;
  }

  //width defaults to 30
  var width = 30;
  if (typeof userRequest.width !== "undefined") {
    width = Number.parseInt(userRequest.width, 10);
    if (Number.isNaN(width) || width < 0) {
      width = 30;
    }
  }
  parms.width = width;

  if (parms.message.length > 0) {
    parms.error = true;
  }
  else {
    parms.queryTransformed = prepareQueryString(parms.query);
    parms.error = false;
  }

  return parms;
}

/*
 * args: qt: query string transformed to remove punctuation and upper case chars
 *       query: original query string
 *       text: text containing the query
 *       width: width of context to return
 *         - length is: <width>query<width>
 *
 *  Return query hit in context of surrounding text
 */
function getContext(qt, query, text, width) {
  var contextSize = width;
  var start, end;
  var startPos = text.indexOf(qt);
  var endPos = startPos + qt.length;
  var context;

  //this "cannot be" but test for it anyway
  if (startPos === -1) {
    return text;
  }

  //don't trim the matched text when contextSize == 0
  if (contextSize === 0) {
    start = 0;
    end = text.length;
  }
  else {
    start = startPos - contextSize;
    if (start < 0) {
      start = 0;
    }

    end = endPos + contextSize;
    if (end > text.length) {
      end = text.length;
    }

    //if query is at the end of 'text' add more context to beginning
    if (endPos === text.length) {
      start = start - contextSize;
      if (start < 0) {
        start = 0;
      }
    }

    //decrease 'start' so we don't return partial words at the beginning of match
    while (start > 0 && text.charAt(start) !== " ") {
      start--;
    }

    //increase 'end' so we don't return partial words at the end of match
    while(end < text.length - 1 && text.charAt(end) !== " ") {
      end++;
    }
  }

  context = text.substr(start, end - start);

  //delimit query within the string
  return context.replace(qt, "<em>"+query+"</em>");
}

module.exports = {
  parseRequest: parseRequest,
  filter: filter,
  processQueryItem: processQueryItem,
  sortResults: sortResults,
  prepareQueryString: prepareQueryString,
  getContext: getContext
};

