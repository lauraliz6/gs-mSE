//CODE FROM LOADER

//this function applies a preset
function applyPreset(preset) {
  app.beginUndoGroup("Apply Preset");
  var thePreset = preset.name;
  var activeComp = app.project.activeItem;
  if (activeComp instanceof CompItem) {
    var layerTotal = activeComp.layers.length;
    for (var l = 1; l <= layerTotal; l++) {
      var activeCompLayers = activeComp.layer(l);
      if (activeCompLayers.selected == true) {
        activeCompLayers.applyPreset(File(thePreset));
      }
    }
  }
  app.endUndoGroup();
}

//this is attaching a preset to the onClick of a button
ffxButton.name = name;
ffxButton.onClick = function () {
  var thePreset = this;
  applyPreset(thePreset);
};
