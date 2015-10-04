console.log('got the script');
console.log('searching');

const JIRA_ID = /\b(\w{2,3}( |-)\d{1,5})\b/;


function getMatchingNodes(root, match) {
  const nodes = Array.prototype.slice.call(root.getElementsByTagName('*'), 0);

  return nodes.filter(match);
}

function isLeaf(element) {
  if (element.hasChildNodes()) {
    for(var i = 0; i < element.childNodes.length; i++) {
      if (element.childNodes[i].nodeType == 1) {
        return false;
      }
    }
  }
  return true;
}

function isNotUseful(element) {
  const name = element.tagName;

  return name !== 'A' &&
    name !== 'META' &&
    name !== 'SCRIPT' &&
    name !== 'NOSCRIPT' &&
    name !== 'TITLE' &&
    name !== 'LINK';
}

function hasJiraId(element, regex) {
  const text = element.textContent;

  return regex.test(text); 
}

function myMatch(element) {
  return isNotUseful(element) &&
    isLeaf(element) &&
    hasJiraId(element, JIRA_ID);
}

function jiraIdToUrl(jiraId) {
  const sanitizedJiraId = jiraId.replace(' ', '-');

  return '<a href="https://blurb-books.atlassian.net/browse/' +
    sanitizedJiraId +
    '">$1</a>';
}

function contentToContentWithLink(content, regex) {
  const matches = regex.exec(content);
  const jiraId = matches[1];

  return content.replace(regex, jiraIdToUrl(jiraId));
}

function convertElement(element) {
  const newContent = contentToContentWithLink(element.textContent, JIRA_ID)
  element.innerHTML = newContent;
}

const matchingNodes = getMatchingNodes(document, myMatch);
for (var i = 0; i < matchingNodes.length; i++) {
  convertElement(matchingNodes[i]);
}


