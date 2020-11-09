
function getSelectedText() {
  if (window.getSelection) {
    return window.getSelection().toString();
  } else if (document.selection) {
    return document.selection.createRange().text;
  }
  return '';
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action == "get_text") {
      var text = getSelectedText();
      sendResponse(text)
    }
  }
)
