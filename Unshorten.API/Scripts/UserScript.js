/* global XDomainRequest */
// ==UserScript==
// @name       UN-Shorten URLs
// @namespace  http://unshorten.azurewebsites.net
// @version    0.1
// @description  enter something useful
// @copyright  2012+, You
// ==/UserScript==

var handlers = {};
handlers['bit.ly'] = function (tag) {
    //tag.href = tag.href + '+';
    return handlers.default(tag);
};

handlers['t.co'] = function (tag) {
    var expanded = links[key].getAttribute("data-expanded-url");
    if (expanded !== null) {
        tag.href = expanded;
        tag.setAttribute("arrow", "true");
        return true;
    }
};

handlers['default'] = function (tag) {
    var fullURL = expand(tag.href);
    if (!!fullURL) {
        tag.href = fullURL;
        return true;
    }
    return false;
};

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

function expand(URL) {
    // All HTML5 Rocks properties support CORS.
    var url = 'http://unshorten.azurewebsites.net/api/UnShorten?url=' + encodeURIComponent(URL);

    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function () {
        var text = xhr.responseText;
        var obj = JSON.parse(text);
        if (obj.LongURL) {
            //alert('Response from CORS request to ' + url + ': ' + obj.LongURL);
            console.log("URL: " + URL + " resolved to: " + obj.LongURL);
            return obj;
        } else {
            return;
            //alert(url + " is not a shortened url");

        }
        //var title = getTitle(text);
    };

    xhr.onerror = function () {
        alert('Woops, there was an error making the request.');
    };

    xhr.send();
}

var links = document.getElementsByTagName("a");
for (var key in links) {
    if (links.hasOwnProperty(key) && typeof (links[key]) === "object") {
        var tag = links[key];
        console.log(key + " - " + tag + " - " + typeof (tag));
        if (tag.hasAttribute('data-leaveit')) {
            var hostname = tag.hostname;
            var handler = "default";
            if (handlers.hasOwnProperty(hostname)) {
                handler = "default";
            }
            if (handlers[handler](tag)) {
                tag.dataset.leaveit = true;
            }
        }
    }
}