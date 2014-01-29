// ==UserScript==
// @name       UN-Shorten URLs
// @namespace  http://unshorten.azurewebsites.net
// @version    0.1
// @description  enter something useful
// @copyright  2012+, You
// ==/UserScript==

var handlers = {};
handlers['bit.ly'] = function (tag) {
    tag.href = tag.href + '+';
    return false;
};

handlers['t.co'] = function (tag) {
    var expanded = links[key].getAttribute("data-expanded-url");
    if (expanded !== null) {
        tag.href = expanded;
        tag.setAttribute("arrow", "true");
        return true;
    }
};


var links = document.getElementsByTagName("a");
for (var key in links) {
    if (links.hasOwnProperty(key) && typeof (links[key]) === "object") {
        var tag = links[key];
        console.log(key + " - " + tag + " - " + typeof (tag));
        if (!tag.hasAttribute('leaveit')) {
            var hostname = tag.hostname;
            if (handlers.hasOwnProperty(hostname)) {
                if (handlers[hostname](tag)) {
                    tag.dataset.leaveit = true;
                }
            }
        }
    }
}