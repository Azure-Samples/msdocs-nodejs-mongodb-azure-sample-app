
//https://groups.google.com/a/chromium.org/g/chromium-extensions/c/InWfQ2fYiu8



//Open a new tab going to chat.openai.com when the browser action is clicked.
/**
* Gets the HTML of the user's selection
*/
// function getSelectionHTML() {
//   var userSelection;
//   if (window.getSelection) {
//     // W3C Ranges
//     userSelection = window.getSelection();
//     // Get the range:
//     if (userSelection.getRangeAt)
//       var range = userSelection.getRangeAt(0);
//     else {
//       var range = document.createRange();
//       range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
//       range.setEnd(userSelection.focusNode, userSelection.focusOffset);
//     }
//     // And the HTML:
//     var clonedSelection = range.cloneContents();
//     var div = document.createElement('div');
//     div.appendChild(clonedSelection);
//     return div.innerHTML;
//   } else if (document.selection) {
//     // Explorer selection, return the HTML
//     userSelection = document.selection.createRange();
//     return userSelection.htmlText;
//   } else {
//     return '';
//   }
// }


// document.addEventListener('mouseup', function (event) {
//   var sel = window.getSelection().toString();

//   console.error(sel)
//   if (sel.length)
//     chrome.extension.sendRequest({ 'message': 'setText', 'data': sel }, function (response) { })
// })



chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.sendMessage(tab.id, "getClickedEl", { frameId: info.frameId }, text => {
    chrome.windows.create({
      url : "http://localhost:3000/ai?text=" + text,
      focused : true,
      type : "popup"
    });

  });
});


var contextMenuItem = {
  "id": "addRecipe",
  "title": "AI v2",
  "contexts": ["all"]
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.create({
  title: "Summarize",
  parentId: "addRecipe",
  id: "name",
  contexts: ["all"],
}, (i, t) => {
  // t.copy()
  console.dir("LOADING...")
  // chrome.extension.getBackgroundPage().console.log('foo');
});

chrome.contextMenus.create({
  title: "Generate",
  parentId: "addRecipe",
  id: "list",
  contexts: ["all"]
});

// chrome.contextMenus.create({
//   title: "Add ingredients",
//   parentId: "addRecipe",
//   id: "ingredients",
//   contexts:["selection"]
// });

// chrome.contextMenus.create({
//   title: "Add cooking steps",
//   parentId: "addRecipe",
//   id: "steps",
//   contexts:["selection"]
// });