//content script
var clickedEl = null;

console.log("content script loaded")
// document.body.style.background = 'yellow';

addEventListener('contextmenu', (event) => {
    clickedEl = event.target;
    console.log("context menu clicked")
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request == "getClickedEl") {
        sendResponse(clickedEl.innerText);
    }
});
