var a = 1;
var textSave = [];


//textSave=['1233333333333333333333333333333333333333','234','345']


var clearAllText = () => {
  textSave = [];
  return textSave.length == 0;
}

var exportToStorage = (needToSave, response) => {
  chrome.storage.local.set({ 'Text': needToSave }, () => {
    alert("The current stored character has been exported to internal storage")
    response('OK');
  });
}

var importFromStorage = (response) => {
  chrome.storage.local.get("Text", result => {
    if (result.Text && result.Text.length > 0) {
      textSave = result.Text;
      alert("Internal storage has been exported to text manager")
      response('OK')
    }
    else {
      alert("Current internal storage is empty")
      response('OK')
    }
  })
}

chrome.commands.onCommand.addListener(function (command) {
  if (command == 'save_key') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      tab_id = tabs[0].id;
      chrome.tabs.sendMessage(tab_id, { action: "get_text" }, (result) => {
        if (!result) {
          //alert('please select text to save')
          alert('Please select the character you want to save')
        }
        else {
          var r = confirm("confirm to save this string?");
          if (r == true) {
            textSave.push(result)
          }
        }
        //console.log(textSave)
      })
    })
  }

});


// var blob = new Blob([AutoTestResultText],{type:"text/plain;charset=utf-8"});
// var autotesteesulttexturl = window.URL.createObjectURL(blob);

// chrome.downloads.download({
//     url:autotesteesulttexturl,
//     filename: window.date + '/' + 'AutoTestFullResult.txt'
// },function(){
//     chrome.downloads.download({
//         url:testeesulttexturl,
//         filename: window.date + '/' + 'AutoTestResult.txt'
//     },function(){

//     })
// })


chrome.runtime.onMessage.addListener((request, sender, callback) => {
  if (request.action == "clear") {
    if (clearAllText()) {
      alert('Clear completed')
      callback('OK');
    }
  }
  if (request.action == "import") {
    importFromStorage(callback)
  }
  if (request.action == "export") {
    exportToStorage(textSave, callback)
  }
  if (request.action == "download") {
    var downloadText = '';
    textSave.map(item => {
      downloadText += item + '\r\n';
    })
    var downloadBlob = new Blob([downloadText], { type: "text/plain;charset=utf-8" });
    var downloadUrl = window.URL.createObjectURL(downloadBlob);
    var downlaodName = window.prompt("Prepare to download, please enter the txt file name (without suffix)");
    chrome.downloads.download({
      url: downloadUrl,
      filename: downlaodName + '.txt'
    }, function () {
      alert('download completed')
      callback('OK');
    })
  }
  if (request.action == "delete") {
    textSave = request.value;
    callback('OK');
  }
  return true;
});
