
"use strict";

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

function nwffacimProcessing(result, book, info) {
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
    case "2002":
      if (!result.a2002) {
        result.a2002 = [];
      }
      result.a2002.push(info);
      break;
    default:
      if (!result.unknown) {
        result.unknown = [];
      }
      result.unknown.push(info);
      break;
  }
}

function womProcessing(result, book, info) {
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
    case "tjl":
      if (!result.tjl) {
        result.tjl = [];
      }
      result.tjl.push(info);
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
    case "questions":
      if (!result.questions) {
        result.questions = [];
      }
      result.questions.push(info);
      break;
    default:
      if (!result.unknown) {
        result.unknown = [];
      }
      result.unknown.push(info);
      break;
  }
}

function acimProcessing(result, book, info) {
  switch(book) {
    case "text":
      if (!result.text) {
        result.text = [];
      }
      result.text.push(info);
      break;
    default:
      if (!result.unknown) {
        result.unknown = [];
      }
      result.unknown.push(info);
      break;
  }
}

function processQueryItem(result, source, book, info) {
  switch(source) {
    case "nwffacim":
      nwffacimProcessing(result, book, info);
      break;
    case "wom":
      womProcessing(result, book, info);
      break;
    case "acim":
      acimProcessing(result, book, info);
      break;
    default:
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


function validQuerySource(source) {
  //valid query sources
  var tables = ["acim", "wom", "nwffacim"];
  var i;

  if (!source) {
    return false;
  }

  //check if requested table is valid
  for(i = 0; i < tables.length; i++) {
    if (tables[i] === source) {
      return true;
    }
  }

  return false;
}

//lowercase and remove punction from query string
function prepareQueryString(query) {
  "use strict";
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
  if (!userRequest.source) {
    parms.message.push("Error: body.source missing");
  }
  else {
    parms.source = userRequest.source;
  }

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

  if (!validQuerySource(parms.source)) {
    parms.message.push("Error: INVALID-TABLE-NAME: " + parms.source);
  }

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

