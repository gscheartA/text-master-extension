var render = () => {
  chrome.runtime.getBackgroundPage((backgroundPage) => {
    var textArray = backgroundPage.textSave;


    //------test---------//
    //textArray=['1233333333333333333333333333333333333333','234','345']

    var contentDiv = document.getElementById('content');
    contentDiv.innerText = "";
    if (textArray.length == 0) {
      contentDiv.innerText = "There is no saved text here"
      contentDiv.onselectstart = () => { return false };
      contentDiv.className = "none";
      bindClickForFooter("none");
    }
    else {
      contentDiv.className = "exist";
      contentDiv.onselectstart = null;
      var ul = document.createElement("ul");
      contentDiv.appendChild(ul);
      createFirstLine(ul);
      addTextArray(textArray, ul);
      bindClickForFooter("exist");
    }
  })
}

render();

var createFirstLine = (ul) => {
  var liFirst = document.createElement("li");
  liFirst.className = "firstline";
  var spanStr = document.createElement("span");
  spanStr.setAttribute("class", "title")
  spanStr.innerText = 'saved text';
  var spanControl = document.createElement("span");
  spanControl.setAttribute("class", "control")
  spanControl.innerText = 'control';
  liFirst.appendChild(spanStr);
  liFirst.appendChild(spanControl)
  ul.appendChild(liFirst);
}

var addTextArray = (textList, ul) => {
  let length = textList.length;
  textList.map((item, index) => {
    var liItem = document.createElement("li");
    liItem.className = "textline";
    liItem.setAttribute("data-number", index)
    var spanText = document.createElement("span");
    spanText.setAttribute("class", "text")
    spanText.innerText = item;

    var buttonDiv = document.createElement("div");
    buttonDiv.className = "buttoncontainer"
    var buttonCopy = createButton("copy");
    var buttonDelete = createButton("delete");
    buttonDiv.appendChild(buttonCopy);
    buttonDiv.appendChild(buttonDelete);
    liItem.appendChild(spanText);
    liItem.appendChild(buttonDiv);
    ul.appendChild(liItem);

    spanText.onmouseover = function () {
      this.title = this.innerHTML;
    }
  })
}

var createButton = (type) => {
  if (type == "copy") {
    var buttonCopy = document.createElement("button");
    buttonCopy.innerText = "copy";
    buttonCopy.className = "button_copy";
    return buttonCopy;
  }
  if (type == "delete") {
    var buttonDelete = document.createElement("button");
    buttonDelete.innerText = "delete";
    buttonDelete.className = "button_delete";
    return buttonDelete;
  }
}

//document.getElementById("#").onclick
var bindClickForFooter = (type) => {
  if (type == "none") {
    document.getElementById("btn_clear").onclick = null;
    document.getElementById("btn_export").onclick = null;
    document.getElementById("btn_download").onclick = null;
    document.getElementById("btn_import").onclick = () => {
      chrome.runtime.sendMessage({ action: 'import' }, response => {
        if (response == "OK") {
          render();
        }
      })
    };
  }
  if (type == "exist") {
    //do the clear work
    document.getElementById("btn_clear").onclick = () => {
      chrome.runtime.sendMessage({ action: 'clear' }, response => {
        if (response == "OK") {
          render();
        }
      })
    };

    //do the export work
    document.getElementById("btn_export").onclick = () => {
      chrome.runtime.sendMessage({ action: 'export' }, response => {
        if (response == "OK") {
        }
      })
    };

    //do the import work
    document.getElementById("btn_import").onclick = () => {
      chrome.runtime.sendMessage({ action: 'import' }, response => {
        if (response == "OK") {
          render();
        }
      })
    };

    //do the download work
    document.getElementById("btn_download").onclick = () => {
      chrome.runtime.sendMessage({ action: 'download' }, response => {
        if (response == "OK") {
          //console.log("download finished");
        }
      })
    };
    document.getElementById("content").onclick = (e) => {
      if (e.target.className == 'button_copy') {
        var obj = e.target.parentElement.parentElement.firstChild.innerText;
        var oInput = document.createElement("input");
        oInput.value = obj;
        document.body.appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        oInput.className = "oInput";
        oInput.style.display = "none";
      }
      if (e.target.className == 'button_delete') {
        var arr = [];
        var obj = e.target.parentElement.parentElement;
        var number = parseInt(obj.getAttribute("data-number"));
        var textArray = document.getElementsByClassName('text');
        [].map.call(textArray, function (item) { arr.push(item.innerText) })
        arr.splice(number, 1);
        chrome.runtime.sendMessage({ action: 'delete', value: arr }, response => {
          if (response == "OK") {
            //console.log("download finished");
            render();
          }
        })
      }
    }
  }
}
