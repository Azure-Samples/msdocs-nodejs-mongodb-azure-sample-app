   // Select location value 

function DOMtoString(selector) {
  if (selector) {
    selector = document.querySelector(selector);
    if (!selector) return "ERROR: querySelector failed to find node"
  } else {
    selector = document.documentElement;
  }
  //get text from selector element
  // var text = selector.innerText;
  return selector.innerText;
  // return selector.outerHTML;
}
function getData() {
  var message = document.querySelector('#toSummarize');
  var tabDepth = 0

  chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
    var activeTab = tabs[0];
    var activeTabId = activeTab.id;

    return chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
      func: DOMtoString,
      // args: ['body']  // you can use this to target what element to get the html for
    });

  }).then(function (results) {
    //
    message.innerText = results[0].result+`||||${localStorage.getItem('key')}||||`;
    // message.innerText = results[0].result;
  }).catch(function (error) {
    message.innerText = 'There was an error injecting script : \n' + error.message;
  });
}
document.addEventListener("DOMContentLoaded", function (event) {
  getData();
  // document.querySelector('#toSummarize').innerText += ".";

  // ,
  // "background": {
  //   "service_worker": "background.js"
  // }
});