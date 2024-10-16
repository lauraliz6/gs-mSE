var csInterface = new CSInterface();

// var pathTest = csInterface.getSystemPath(SystemPath.USER_DATA);

var systemRoot = csInterface.getSystemPath(SystemPath.EXTENSION);
var pathRoot = csInterface.getSystemPath(SystemPath.USER_DATA);
var rootSplit = pathRoot.split("/");
var userRoot =
  "/" +
  rootSplit[1] +
  "/" +
  rootSplit[2] +
  "/Library/CloudStorage/Box-Box/mSE/dock";
//path for Monterey and Box version 2.24+
// "/Library/CloudStorage/Box-Box/mSE/dock";
//path for Box version <2.24
// "/Box/mSE/dock";

//this runs the pre-built mSE functions, through hostscript.jsx
function runFn(id) {
  var idUp = id.toLowerCase();
  csInterface.evalScript(
    "runFunc('" + JSON.stringify(userRoot) + "','" + JSON.stringify(idUp) + "')"
  );
}

//the below works to pass through hostscript and write to the custom.json
function changeJson(json) {
  var csi = new CSInterface();
  var root = csi.getSystemPath(SystemPath.EXTENSION);
  csi.evalScript(
    "writeToJson('" + JSON.stringify(root) + "','" + JSON.stringify(json) + "')"
  );
  location.reload();
}

function customButton(jsxPath) {
  csInterface.evalScript("customButton('" + JSON.stringify(jsxPath) + "')");
}

// var stgBtn = document.getElementById('settings');
// stgBtn.onclick = function(){
//     csInterface.evalScript("openSettings('"+JSON.stringify(systemRoot)+"')");
//     var cover = document.getElementById('cover');
//     cover.classList.remove('hidden');
// }
