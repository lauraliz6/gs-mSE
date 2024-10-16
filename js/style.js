//json-ifying the user's buttons, stored in custom.js
var btnString = JSON.stringify(buttons);
var btnJson = JSON.parse(btnString);

//defining the open space
var space = document.getElementById("openSpace");

//open variable is which content should be open
//num indicates which tab should be open, if it's a tab
var open = { type: "tab", num: 0 };

//this function is activated to add the onclicks to the tabs
function allowTabClick() {
  var tabOp = space.querySelectorAll(".tabTitle");
  for (i = 0; i < tabOp.length; i++) {
    var op = tabOp[i];
    op.onclick = function (e) {
      var num = e.target.dataset.order;
      if (open.type == "tab") {
        openMenu();
      } else if (open.type == "menu") {
        open.num = num - 1;
        openTab();
      }
    };
  }
}

//this function prepares a tab to be opened
function openTab() {
  open.type = "tab";
  var tabs = btnJson.tabs;
  var tab = tabs[open.num];
  var txt = "";
  txt += "<div id='" + tab.id + "' class='tab'>";
  txt +=
    "<h1 class='tabTitle' data-order='" + tab.order + "'>" + tab.id + "</h1>";
  var sections = tab.sections;
  for (s = 0; s < sections.length; s++) {
    var section = sections[s];
    txt += "<div id='" + section.id + "' class='section'>";
    txt += "<h2 class='title'>" + section.id + "</h2>";
    txt += "<div class='buttons'>";
    var buttons = section.buttons;
    for (b = 0; b < buttons.length; b++) {
      var button = buttons[b];
      txt +=
        "<button id='" +
        button.id +
        "' onclick='" +
        button.onclick +
        "' data-path='" +
        button.datapath +
        "'>" +
        button.id +
        "</button>";
    }
    //closing buttons div
    txt += "</div>";
    //closing section div
    txt += "</div>";
  }
  //closing tab div
  txt += "</div>";
  loadContent(txt);
}

//function to open the tab menu
function openMenu() {
  open.type = "menu";
  var tabs = btnJson.tabs;
  var string = "";
  for (t = 0; t < tabs.length; t++) {
    var tab = tabs[t];
    string +=
      "<h1 class='tabTitle' data-order='" + tab.order + "'>" + tab.id + "</h1>";
  }
  loadContent(string);
}

//upon clicking the add button (plus sign)
//check if it's not already open, and then open it
//if it is already open, open the last tab open
var addBtn = document.getElementById("addNew");
addNew.onclick = function () {
  if (open.type == "tab" || open.type == "menu") {
    open.type = "add";
    addBtn.classList.add("active");
    openAddMenu();
  } else if (open.type == "add") {
    open.type = "tab";
    addBtn.classList.remove("active");
    openTab();
  }
};

//function to open the add menu
function openAddMenu() {
  var contents = [
    "<div id='addSpace'>",
    "<div class='section'>",
    "<h1>ADD</h1>",
    "<button id='addTab'>TAB</button>",
    "<button id='addSection'>SECTION</button>",
    "<button id='addButton'>BUTTON</button>",
    "<button id='addImptExpt'>IMPORT/EXPORT LAYOUT</button>",
    "</div>",
    "</div>",
  ];
  var string = contents.join("");
  loadContent(string);
  enableAdd();
}

//function to enable button clicks in add menu
function enableAdd() {
  var addSpace = document.getElementById("addSpace");
  var addBtns = addSpace.querySelectorAll("button");
  for (a = 0; a < addBtns.length; a++) {
    var addBtn = addBtns[a];
    addBtn.onclick = function () {
      var id = this.id;
      openAdd(addSpace, id);
    };
  }
}

//function to open a section of the add menu
function openAdd(space, id) {
  var clicked = id.split("add").pop();
  var toOpen = clicked.toLowerCase();
  if (toOpen == "tab") {
    var innards = [
      "<h1>ADD</h1>",
      "<button id='addTab' class='active'>TAB</button>",
      "<input type='text' maxlength='2' value='Name (2 char max)'/>",
      "<button id='add'>ADD</button>",
    ];
  } else if (toOpen == "section" || toOpen == "button") {
    var innards = [
      "<h1>ADD</h1>",
      "<button id='add" +
        clicked +
        "' class='active'>" +
        clicked.toUpperCase() +
        "</button>",
      "<h4>SELECT <br>TAB</h2>",
      "<form id='selectTab'>",
    ];
    var tabs = btnJson.tabs;
    for (t = 0; t < tabs.length; t++) {
      var tab = tabs[t];
      var select =
        "<input type='radio' id='" +
        tab.id +
        "' name='tab' value='" +
        tab.id +
        "'>";
      var label = "<label for='" + tab.id + "'>" + tab.id + "</label><br>";
      innards.push(select, label);
    }
    var formEnd = "</form>";
    var sectionForm = "<form id='selectSection'></form>";
    if (toOpen == "section") {
      var textIn =
        "<input type='text' maxlength='3' value='Name (3 char max)'/>";
      var sectionHead = "";
      var btn = "<button id='add'>ADD</button>";
    } else if (toOpen == "button") {
      textIn = "<input type='text' maxlength='4' value='Name (4 char max)'/>";
      textIn += "<button id='selectJsx'>Select JSX/FFX</button>";
      textIn += "<button id='enterExp'>Enter Expression</button>";
      var sectionHead = "<h4>SELECT <br>SECTION</h4>";
      var btn = "<button id='add'>ADD</button>";
    }
    innards.push(formEnd, sectionHead, sectionForm, textIn, btn);
  } else if (toOpen == "imptexpt") {
    var innards = [
      "<h1>IMPORT/EXPORT LAYOUT</h1>",
      "<button id='impt'>IMPORT</button>",
      "<button id='expt'>EXPORT</button>",
    ];
  }
  var textInnards = innards.join("");
  var toPop = space.querySelector(".section");
  toPop.innerHTML = textInnards;
  if (toOpen == "section" || toOpen == "button") {
    tabSelect(toOpen);
  }
  activateTextInput();
  //these function are in addTabSectionButton.js, activated here
  if (toOpen == "imptexpt") {
    //if select import or export, activate that functionality
    allowImptExpt();
  } else {
    //otherwise, activate the add buttons
    addBtnActivate(toOpen);
    if (toOpen == "button") {
      jsxSelect();
      expEnter();
    }
  }
}

//function to allow user to select tab
function tabSelect(open) {
  var tabSelect = document.getElementById("selectTab");
  var tabRadio = tabSelect.querySelectorAll('input[name="tab"]');
  for (const radio of tabRadio) {
    radio.onclick = function () {
      if (open == "button") {
        sectionSelect(radio.id);
      }
    };
  }
}

//function to allow user to select section for a button to live in
function sectionSelect(id) {
  var sectionSelect = document.getElementById("selectSection");
  var toLoad = [];
  var tabs = btnJson.tabs;
  for (t = 0; t < tabs.length; t++) {
    var tab = tabs[t];
    if (tab.id == id) {
      var sections = tab.sections;
      for (const section of sections) {
        var input =
          "<input type='radio' id='" +
          section.id +
          "' name='section' value='" +
          section.id +
          "'>";
        var label =
          "<label for='" + section.id + "'>" + section.id + "</label><br>";
        toLoad.push(input, label);
      }
    }
  }
  var loadHtml = toLoad.join("");
  sectionSelect.innerHTML = loadHtml;
}

//this function loads whatever is in the string passed to openSpace
function loadContent(txt) {
  space.innerHTML = txt;
  allowTabClick();
}

//making all text inputs clear on click
function activateTextInput() {
  var textInputs = document.querySelectorAll('input[type="text"]');
  for (const input of textInputs) {
    var prevText = input.value;
    input.onfocus = function () {
      var curText = input.value;
      if (curText.length > input.maxLength) {
        input.value = "";
      }
    };
    input.onblur = function () {
      if (input.value == "") {
        input.value = prevText;
      }
    };
  }
}

//this is for forcing the user to reload after changing settings
var cover = document.getElementById("cover");
cover.onclick = function () {
  location.reload();
  cover.classList.add("hidden");
};

window.onresize = function () {
  windowAlign();
};

function windowAlign() {
  var height = window.innerHeight;
  var width = window.innerWidth;
  var body = document.querySelector("body");
  if (height < 300) {
    if (body.classList.contains("vertical")) {
      body.classList.remove("vertical");
      body.classList.add("horizontal");
    }
  }
  if (width < 300) {
    if (body.classList.contains("horizontal")) {
      body.classList.remove("horizontal");
      body.classList.add("vertical");
    }
  }
}

window.onload = function () {
  windowAlign();
};

//calling this function to open a tab
openTab();
