//setting this up for later
var csInterface = new CSInterface();
var fileLoc = csInterface.getSystemPath(SystemPath.EXTENSION);
//the variable buttons is setup in custom.js in a JSON format
var customBtns = buttons;

function addBtnActivate(open) {
  var btn = document.getElementById("add");
  btn.onclick = function () {
    if (open == "tab") {
      addTab();
    } else if (open == "section") {
      addSection();
    } else if (open == "button") {
      addButton();
    }
  };
}

function addTab() {
  var formInfo = formInput();
  var text = formInfo["text"];
  returnJson(text, "tab");
}

function addSection() {
  var formInfo = formInput();
  var text = formInfo["text"];
  var tab = formInfo["tab"];
  var info = [tab, text];
  returnJson(info, "section");
}

function addButton() {
  var formInfo = formInput();
  var text = formInfo["text"];
  var tab = formInfo["tab"];
  var section = formInfo["section"];
  if (section == null) {
    alert("Please select a section for your button.");
    return;
  }
  if (newBtnContent == null) {
    alert(
      "Please select a .jsx file, .ffx file, or enter an expression for your new button."
    );
    return;
  } else {
    var jsx = newBtnContent;
    var info = [tab, section, text, jsx];
    returnJson(info, "button");
  }
}

//this function gathers info from the form
function formInput() {
  var formInfo = {};
  var formSpace = document.getElementById("addSpace");

  //getting the text input
  var textField = formSpace.querySelector('input[type="text"]');
  var text = textField.value;
  formInfo.text = text;

  //getting the tab radio option
  var tabSelect = formSpace.querySelector("#selectTab");
  if (tabSelect) {
    var tabOptions = tabSelect.querySelectorAll("input");
    for (t = 0; t < tabOptions.length; t++) {
      var opt = tabOptions[t];
      if (opt.checked) {
        var tab = opt.value;
      }
    }
    formInfo.tab = tab;
  }

  //getting the section radio option
  var sectionSelect = formSpace.querySelector("#selectSection");
  if (sectionSelect) {
    var sectionOptions = sectionSelect.querySelectorAll("input");
    for (s = 0; s < sectionOptions.length; s++) {
      var sOpt = sectionOptions[s];
      if (sOpt.checked) {
        var section = sOpt.value;
      }
    }
    formInfo.section = section;
  }

  return formInfo;
}

//this function is for selecting a script to run for a new button
//run from style.js, if toOpen is a button
var newBtnContent;

function jsxSelect() {
  var jsxSelect = document.getElementById("selectJsx");
  jsxSelect.onclick = function (e) {
    csInterface.evalScript("openDialog()", function (jsxFile) {
      if (jsxFile) {
        if (jsxFile.includes("/")) {
          var shortJsx = jsxFile.split("/").pop();
        } else if (jsxFile.includes("\\")) {
          var shortJsx = jsxFile.split("\\").pop();
        }
        var jsxName = shortJsx.replace(/%20/g, " ");
        var jsxName = jsxName.substr(0, 30);
        e.target.innerHTML = jsxName;
        newBtnContent = jsxFile;

        //hiding the expression button if they select a preset to prevent doubling-up
        var expSelect = document.getElementById("enterExp");
        expSelect.style.display = "none";
      } else {
        alert("Please select a script file.");
      }
    });
  };
}

//this function is for opening a dialog to enter an expression to attach to a new button
//run from style.js, if toOpen is a button
function expEnter() {
  var expSelect = document.getElementById("enterExp");
  expSelect.onclick = function (e) {
    csInterface.evalScript("openExpField()", function (expression) {
      if (expression != "undefined") {
        var shortExp = expression.substr(0, 15);
        shortExp = shortExp.replace(/[\n\r]/g, "");
        e.target.innerText = shortExp;
        var escaped = encodeURI(expression);
        newBtnContent = escaped;

        //hiding the jsx/ffx button if they enter an expression to prevent doubling-up
        var jsxSelect = document.getElementById("selectJsx");
        jsxSelect.style.display = "none";
      } else {
        alert("Please enter an expression");
      }
    });
  };
}

//this function returns a new json object to be inserted into custom.js
function returnJson(item, type) {
  var btnString = JSON.stringify(customBtns);
  var btnJson = JSON.parse(btnString);
  var jsonTabs = btnJson.tabs;

  if (type == "tab") {
    var newName = item.toUpperCase();
    if (item.length > 2) {
      alert("tab name is too long, please shorten to two characters");
      return;
    }
    for (t = 0; t < jsonTabs.length; t++) {
      var tab = jsonTabs[t];
      //first check if the tab name is already in the json
      if (tab.id == newName) {
        alert("this tab name already exists, please choose another");
        return;
      }
    }
    var newTab = {};
    newTab.order = jsonTabs.length + 1;
    newTab.id = newName;
    newTab.sections = [];
    btnJson["tabs"].push(newTab);
  } else if (type == "section") {
    var sTab = item[0];
    var sText = item[1];
    if (sText.length > 3) {
      alert("tab name is too long, please shorten to three characters");
      return;
    }
    var newSectionName = sText.toUpperCase();
    //check if section name already exists
    for (t = 0; t < jsonTabs.length; t++) {
      var tab = jsonTabs[t];
      if (tab.id == sTab) {
        var sections = tab.sections;
        for (s = 0; s < sections.length; s++) {
          var section = sections[s];
          if (section.id == newSectionName) {
            alert("this section name already exists, please choose another");
            return;
          }
        }
        //add to the current tab
        var newSection = {};
        newSection.order = sections.length + 1;
        newSection.id = newSectionName;
        newSection.buttons = [];
        sections.push(newSection);
      }
    }
  } else if (type == "button") {
    var bTab = item[0];
    var bSection = item[1];
    var bText = item[2];
    var bJsx = item[3];

    var newBtnName = bText.toUpperCase();
    if (item.length > 4) {
      alert("tab name is too long, please shorten to two characters");
      return;
    }
    //check if button name already exists
    for (t = 0; t < jsonTabs.length; t++) {
      var tab = jsonTabs[t];
      if (tab.id == bTab) {
        var sections = tab.sections;
        for (s = 0; s < sections.length; s++) {
          var section = sections[s];
          if (section.id == bSection) {
            var buttons = section.buttons;
            for (b = 0; b < buttons.length; b++) {
              var button = buttons[b];
              if (button.id == newBtnName) {
                alert("this button name already exists, please choose another");
                return;
              }
            }
            //add to the current section
            var newButton = {};
            newButton.order = buttons.length + 1;
            newButton.id = newBtnName;
            newButton.datapath = bJsx;
            newButton.onclick = "customButton(this.dataset.path)";
            buttons.push(newButton);
          }
        }
      }
    }
  }

  //passes to a function in scripts.js
  changeJson(btnJson);
}

//allowing user to import or export their layout (custom.js)
function allowImptExpt() {
  var imptBtn = document.getElementById("impt");
  var exptBtn = document.getElementById("expt");
  imptBtn.onclick = () => importJson();
  exptBtn.onclick = () => exportJson();
}

//import custom.js layout
function importJson() {
  csInterface.evalScript("openDialogJsonSelect()", function (layout) {
    //this if is handling the case that the file came directly from the custom.js..
    //and still includes the variable declaration
    if (layout.includes("var buttons =")) {
      layout = layout.split("=").pop();
    }
    var writeLayout = JSON.parse(layout);
    changeJson(writeLayout);
  });
}

//export custom.js layout
function exportJson() {
  var buttonsString = JSON.stringify(buttons);
  csInterface.evalScript(
    "openDialogJsonSave('" + buttonsString + "')",
    function (filePath) {
      if (!filePath) {
        alert("No save location selected");
      } else {
        alert("Custom layout file saved at: " + filePath);
      }
    }
  );
}
