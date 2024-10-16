/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

var Handler = {};

//create chapter
Handler.crch = function (path) {
  $.evalFile(path + "/jsx/estk/estk_create_chapter.jsxbin");
};

//create module
Handler.crmo = function (path) {
  $.evalFile(path + "/jsx/estk/estk_create_modules.jsxbin");
};

//align
Handler.algn = function (path) {
  $.evalFile(path + "/jsx/estk/estk_alignment.jsxbin");
};

//rename project structure
Handler.renm = function (path) {
  $.evalFile(path + "/jsx/estk/estk_project_renamer.jsxbin");
};

//organize project
Handler.orgp = function (path) {
  $.evalFile(path + "/jsx/estk/estk_project_organizer.jsxbin");
};

//render character proxy
Handler.rndr = function (path) {
  $.evalFile(path + "/jsx/estk/estk_proxy_renderSingle.jsxbin");
};

//export character animation preset
Handler.expt = function (path) {
  $.evalFile(path + "/jsx/estk/estk_animation_export.jsxbin");
};

//import character animation preset
Handler.impt = function (path) {
  $.evalFile(path + "/jsx/estk/estk_animation_import.jsxbin");
};

//spell check
Handler.splc = function (path) {
  $.evalFile(path + "/jsx/estk/estk_spellCheck.jsxbin");
};

//this is the function that runs everything in the handler
//all the pre-loaded mse functions
runFunc = function (path, id) {
  var parsePath = path.replace(/"/g, "");
  parseId = id.replace(/"/g, "");
  Handler[parseId](parsePath);
};

//getting application info, taking from the loader jsx
//checking the version of ae running
var aeVersion = app.buildName;
var aeVersionNum = aeVersion.toString().split(".").shift();
var version;
//applies the correct version, so folders will look in the right place
if (aeVersionNum == "17") {
  version = "2020";
} else if (aeVersionNum == "16") {
  version = "2019";
} else if (aeVersionNum == "14") {
  version = "2017";
} else if (aeVersionNum == "18") {
  version = "2021";
} else if (aeVersionNum == "22") {
  version = "2022";
} else {
  version = "Unsure";
}
if (version == "Unsure") {
  alert(
    "Please check that the plugin you are running is compatable with this version of After Effects"
  );
}

//checking Windows or Mac to assign folder paths correctly
var jsxFolder;
var windows = $.os.indexOf("Windows") > -1 ? true : false;
if (windows == false) {
  var jsxFolder =
    "/Applications/Adobe After Effects CC " + version + "/Scripts/";
  var slash = "/";
} else if (windows == true) {
  var jsxFolder =
    "\\Program Files\\Adobe\\Adobe After Effects CC 2019\\Support Files\\";
  var slash = "\\";
}

//function to rewrite custom json
writeToJson = function (path, string) {
  var toWrite = "var buttons = " + string;
  var path = JSON.parse(path);
  var jsonPath = File(path + "/js/custom.js");
  jsonPath.open("w");
  jsonPath.write(toWrite);
  jsonPath.close();
};

//getting application info, taking from the loader jsx
//checking the version of ae running
var aeVersion = app.buildName;
var aeVersionNum = aeVersion.toString().split(".").shift();
var version;
//applies the correct version, so folders will look in the right place
if (aeVersionNum == "17") {
  version = "2020";
} else if (aeVersionNum == "16") {
  version = "2019";
} else if (aeVersionNum == "14") {
  version = "2017";
} else if (aeVersionNum == "18") {
  version = "2021";
} else if (aeVersionNum == "22") {
  version = "2022";
} else {
  version = "Unsure";
}
if (version == "Unsure") {
  alert(
    "Please check that the plugin you are running is compatable with this version of After Effects"
  );
}

//checking Windows or Mac to assign folder paths correctly
var jsxFolder;
var windows = $.os.indexOf("Windows") > -1 ? true : false;
if (windows == false) {
  var jsxFolder = "/Applications/Adobe After Effects " + version + "/Scripts/";
  var slash = "/";
} else if (windows == true) {
  var jsxFolder =
    "\\Program Files\\Adobe\\Adobe After Effects " +
    version +
    "\\Support Files\\";
  var slash = "\\";
}

//to return the selected jsx
openDialog = function () {
  var thisFolder = File(jsxFolder);
  var selected = thisFolder.openDlg();
  if (selected != "null" && selected != "undefined") {
    var extension = selected.toString().split(".").pop();
    if (extension == "jsx" || extension == "jsxbin" || extension == "ffx") {
      var stringJsx = selected.toString();
      return stringJsx;
    } else {
      alert("Please select a jsx, jsxbin, or ffx file.");
    }
  }
};

openExpField = function () {
  var newExp = createExpWindow();
  return newExp;
};

createExpWindow = function () {
  var exp;
  var expW = new Window("dialog");
  expW.alignment = "fill";
  expW.alignChildren = "fill";
  var panelTitle = expW.add("statictext", undefined, "Add Expression");
  var inputArea = expW.add("edittext", [0, 0, 275, 100], "wiggle(10,10);", {
    multiline: true,
    scrolling: false,
  });
  var doneBtn = expW.add("button", undefined, "Done");
  var cancelRow = expW.add("group");
  cancelRow.alignment = "right";
  var cancelBtn = cancelRow.add("button", [0, 0, 100, 30], "CANCEL", {
    name: "cancel",
  });

  doneBtn.onClick = function () {
    var expText = inputArea.text;
    exp = expText;
    expW.close();
  };

  expW.show();
  return exp;
};

//setting this variable for the desktop location
var desktopLoc = Folder.desktop;

//the two following functions use resources from here: https://community.adobe.com/t5/after-effects/how-can-i-add-default-filename-in-file-savedialog-function-in-scripting/m-p/10908665
//this function is run from addTabSectionButton.js - exportJson()
openDialogJsonSave = function (layout) {
  var newSaveFile = new File("~/Desktop/layout.json").saveDlg(
    "Select a location and enter a name for your custom layout file."
  );
  newSaveFile.open("w");
  newSaveFile.write(layout);
  newSaveFile.close();
  return newSaveFile;
};

//this function is run from addTabSectionButton.js - importJson()
openDialogJsonSelect = function () {
  var layoutFile = desktopLoc.openDlg("Select a custom layout .JSON file");
  if (!layoutFile) {
    alert("No custom layout file selected.");
  } else if (layoutFile.toString().split(".").pop() != "json") {
    alert("Incorrect file type selected, please select a .json or .js file");
  } else {
    layoutFile.open("r");
    var customLayout = layoutFile.read();
    layoutFile.close();
    return customLayout;
  }
};

//this function is routed through scripts.js function customButton
//it takes the data for the path from the button that's clicked on, and runs it in evalFile
customButton = function (path) {
  var script = JSON.parse(path);
  var scriptType = script.split(".").pop();
  if (scriptType == "jsx" || scriptType == "jsxbin") {
    var jsxString = script.toString();
    $.evalFile(jsxString);
  } else if (scriptType == "ffx") {
    applyPreset(script);
  } else {
    applyExpression(script);
  }
};

//this function applies a preset
function applyPreset(preset) {
  app.beginUndoGroup("Apply Preset");
  var activeComp = app.project.activeItem;
  if (activeComp instanceof CompItem) {
    var layerTotal = activeComp.layers.length;
    for (var l = 1; l <= layerTotal; l++) {
      var activeCompLayers = activeComp.layer(l);
      if (activeCompLayers.selected == true) {
        activeCompLayers.applyPreset(File(preset));
      }
    }
  }
  app.endUndoGroup();
}

function applyExpression(exp) {
  var exp = decodeURI(exp);
  //this applies the expression to the selected properties
  var activeComp = app.project.activeItem;
  if (activeComp instanceof CompItem) {
    var selectedProps = activeComp.selectedProperties;
    if (selectedProps.length == 0) {
      alert(
        "Please select a property or properties to apply the expression to."
      );
    } else {
      app.beginUndoGroup("Apply Expression");
      for (var p = 0; p < selectedProps.length; p++) {
        var selectedProp = selectedProps[p];
        var propName = selectedProp.name;

        var layerName = returnParent(selectedProp);

        //this loops through the parent properties until it gets the top layer name
        function returnParent(prop) {
          while (prop.parentProperty) {
            prop = prop.parentProperty;
            parentName = prop.name;
          }
          return parentName;
        }

        //only applies expression if it's possible
        if (selectedProp.canSetExpression) {
          //checking if the property already has an expression
          if (selectedProp.expression != "") {
            //asking user if they want to overwrite expression
            var askOverWrite = confirm(
              "The " +
                propName +
                " property on " +
                layerName +
                " already has an expression applied, would you like to overwrite it? \n" +
                selectedProp.expression
            );
            if (askOverWrite == false) {
              //if they say no, then do "continue", which will skip this iteration of the loop: https://www.w3schools.com/js/js_break.asp
              continue;
            }
          }
          selectedProp.expression = exp;
        }
      }
      app.endUndoGroup();
    }
  }
}

//-
//-
//-----//
//settings - not currently in use
openSettings = function (path) {
  var parsePath = JSON.parse(path);
  $.evalFile(parsePath + "/jsx/settings.jsx");
};

//for testing
testTest = function () {
  alert("test worked");
};
