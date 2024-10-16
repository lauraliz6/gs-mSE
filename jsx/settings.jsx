try{

  app.beginUndoGroup("Preset Panel");
  {
    function myScript(thisObj){
      function myScript_buildUI(thisObj){
        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "mSE Settings", undefined,
        {resizeable:true, closeButton: true});

        res = "group{orientation:'column', alignment:['center','fill'], alignChildren:['center','top'],\
        panelTwo: Panel {text:'Items'},\
        panelThree: Panel {text:''},\
        }";

        myPanel.grp = myPanel.add(res);

        var panelTwo = myPanel.grp.panelTwo;
        var panelThree = myPanel.grp.panelThree;

        //removing the orientation panel for now
        // var panelOne = myPanel.grp.panelOne;
        // panelOne.alignChildren = 'left';
        // panelOne: Panel {text:'Orientation'},\
        // var radioH = panelOne.add('radiobutton', undefined, 'Horizontal');
        // var radioV = panelOne.add('radiobutton', undefined, 'Vertical');
        // radioH.value = true;



        //getting current executing script for the file path
        var curScript = $.fileName;
        var curPath = curScript.split("/jsx/").shift();

        //adding the list tree to the panel
        var listGrp = panelTwo.add('group');
        listGrp.orientation = 'column';
        var listTree = listGrp.add('treeview',[0, 0, 150, 350]);

        //getting the list from custom.js, where the user's tabs, sections, buttons are stored
        var listFile = File(curPath+'/js/custom.js');
        listFile.open('r');
        var list = listFile.read().split("var buttons = ").pop();
        listFile.close();

        //making the list more json-friendly
        var jsonList = list.replace(/\n/g, " ").replace(";","");

        //writing the json to a separate file to read as a straightforward json
        var jsonFile = File(curPath+'/js/custom_json.js');
        jsonFile.open('w');
        jsonFile.write(jsonList);
        jsonFile.close();
        
        //reading the contents of that separate json-friendly file
        jsonFile.open('r');
        var contents = jsonFile.read();
        jsonFile.close();
        var jsonContents = JSON.parse(contents);
        
        //now can use jsonContents to return all the objects
        var tabs = jsonContents.tabs;
        for (t=0; t<tabs.length; t++){
          var tab = tabs[t];
          var tabId = tab.id;
          var parentNode = listTree.add('node',tabId);
          var sections = tab.sections;
          for (s=0; s<sections.length; s++){
            var section = sections[s];
            var sectionId = section.id;
            var node = parentNode.add('node',sectionId);
            var buttons = section.buttons;
            for (b=0; b<buttons.length; b++){
              var button = buttons[b];
              var buttonId = button.id;
              node.add('item', buttonId);
            }
          }
        }

        function expand_node (tree){
          tree.expanded = true;
          var branches = tree.items;
          for (var i = 0; i < branches.length; i++) {
            if (branches[i].type == 'node') {
              expand_node (branches[i]);
            }
          }
        }
        expand_node(listTree);

        var moveBtns = listGrp.add('group');
        //this is the code for a downicon binary sequence, maybe use later
        // var downIcon = ScriptUI.newImage("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00/\x00\x00\x00\x1F\b\x06\x00\x00\x00w]\u0094\x01\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x008eXIfMM\x00*\x00\x00\x00\b\x00\x01\u0087i\x00\x04\x00\x00\x00\x01\x00\x00\x00\x1A\x00\x00\x00\x00\x00\x02\u00A0\x02\x00\x04\x00\x00\x00\x01\x00\x00\x00/\u00A0\x03\x00\x04\x00\x00\x00\x01\x00\x00\x00\x1F\x00\x00\x00\x00j\u00BD\\K\x00\x00\x01-IDATX\t\u00D5\u0095\u00CF\x0E\u00820\f\u0087\u00D1\u00F8\u00B6\x1E\u0088'\u00BD\u00E1\u00CD\u0083\u00EF\u00E4\u00AB\u00E1oh\x13\u00B6\u00EC\x0F\u00DD\u00DA2\u009A\u0090\u0085m\u00A5\u00DF7\u00D8\x18\u0086D\u00CC\u00F3\u00FC\u00C6\u00F5H\f\u009Bt\u00A3\u00FE\u008B\u00CD\u00F0\x07G\u00B3\u00C4\u00DD\u00844(\u0082\u00CA\x0E\u009Cb\f\u0086\u00E3\u00B7\u0098\u00EDV<\fS\x01\x14_\u0083\x13K^\x00\u00B3b\u00E0\u0094l\"\u0090\x00'\u0086\u00B8@\x01\u009C\u0092U\x05\n\u00E0\u00C4\u00E0\x0Bl\x04\u00A7d\x15\u0081\u008D\u00E0\u00C4\u00F0\x13\u00C0\u00DDD=\u008CV\u00F4\x14B\u00DD\u00D87^\u00C2\x19\u00CF\u00D8\u00B6\u00A7\u00F8\u00D6\u00CD\u00F6\u00BAb\"o\u00C0\u0081\u00A3R\u00CDb\\\x16B<\u00E0Y\u00D2L\u008C7\t8\u00F0\u00C4sK\u00DDWoi1\u00DBT@\f\u009C,\u00AC\x04\u00C4\u00C1\u00AD\x04\u00D4\u00C0\u00B5\x05\u00D4\u00C1\u00B5\x04\u00CC\u00C0\u00A5\x05\u00CC\u00C1W\x02\x13\u008A\u00D7\u00C4rv#Q\u00E68$ n\x0B\u0080\u00DAc\u00F4Sc\u008D\u009C\x1B\u00971;\u00BFA\u0080\u00CB\u00EF\u00FF\u0080\u00B2T\u008CA\x03\x01\x1DprT\x14\u00D0\x05W\x14\u00B0\x01W\x10\u00B0\x05\x17\x14\u00D8\x07\\@`_\u00F0\x06\u0081>\u00C0+\x04\u00FA\x02g\b\u00F4\t\u00BEA\u00A0o\u00F0\u008C\u00C01\u00C0#\x02\u00C7\x02'\x01\u00ED\u00F6\x0B\u0086?\u00D1}\u0088\x1D\u00EE7\x00\x00\x00\x00IEND\u00AEB`\u0082");
        var moveUp = moveBtns.add('button', undefined, 'Up');
        var moveDown = moveBtns.add('button', undefined, 'Down');
        var deleteBtn = panelTwo.add('button', undefined, 'Delete Item');

        moveUp.onClick = MoveUp;
        moveDown.onClick = MoveDown;
        deleteBtn.onClick = remove;

        var saveBtn =  panelThree.add('button', undefined, 'Save and Close');
        saveBtn.onClick = reWriteJson;

        function remove(){
          var sel = listTree.selection.toString();
          var yesNo = confirm("Do you want to delete item "+ sel + "?");
          if (yesNo == true){
            listTree.remove(listTree.selection);
          }
        }

        //moving items
        function MoveUp (){
          var tree = listTree;
          var sel = tree.selection;
          //is the current selection an item?
          //if yes ->
          if (sel.type == "item"){
            //can the current selection be moved up?
            var selIndex = sel.index;
            // if yes ->
            if (selIndex > 0) {
              var parent = sel.parent;
              var grandParent = parent.parent;
              //save the indices for later expansion
              var pIndex = parent.index;
              var gpIndex = grandParent.index;

              var last = parent.items[selIndex - 1];

              var newItem = parent.add("item", last.text, selIndex+1);
              last.text = sel.text;
              tree.remove(sel);

              var toExpand = tree.items[gpIndex].items[pIndex];
              //for some reason I have to reset the expanded property to expand the parent node after deletion
              toExpand.expanded = false;
              toExpand.expanded = true;

              //setting the selection doesn't seem to work so I just unset the selection
              tree.selection = null;
              return;
            }
          }
          //if not an item, it is a node ->
          else if (sel.type == "node"){
            //does the node have a parent that is also a node?
            //if yes ->
            if (sel.parent.type == "node"){
              //can the current selection be moved up?
              var selIndex = sel.index;
              //if yes ->
              if (selIndex > 0){
                var parent = sel.parent;
                //save the index for later expansion
                var pIndex = parent.index;
                var last = parent.items[selIndex - 1];
                var lastIndex = last.index;
                var lastChildren = last.items;
                var curChildren = sel.items;
                var newLast = parent.add("node", last.text, selIndex+1);
                for (l=0; l<lastChildren.length; l++){
                  newLast.add("item", lastChildren[l].text);
                }
                var newNode = parent.add("node", sel.text, selIndex);
                for (c=0; c<curChildren.length; c++){
                  newNode.add("item", curChildren[c].text);
                }
                tree.remove(sel);
                tree.remove(last);


                //expand the parent
                var toExpand = tree.items[pIndex];
                toExpand.expanded = false;
                toExpand.expanded = true;
                //expand the items
                var expandItems = toExpand.items;
                for (e=0; e<expandItems.length; e++){
                  expandItems[e].expanded = false;
                  expandItems[e].expanded = true;
                }

                tree.selection = null;
                return;
              }
            }
            //if does not have a parent, must be top-level
            else {
              //can this item be moved up?
              var selIndex = sel.index;
              //if yes ->
              if (selIndex > 0){
                //use the tree as the parent
                var last = tree.items[selIndex - 1];
                
                var lastChildren = last.items;
                var newLast = tree.add("node", last.text, selIndex+1);
                for (l=0; l<lastChildren.length; l++){
                  var lastGrandKids = lastChildren[l].items;
                  var newLastNode = newLast.add("node", lastChildren[l].text);
                  for (g=0; g<lastGrandKids.length; g++){
                    newLastNode.add("item", lastGrandKids[g].text);
                  }
                }

                tree.remove(last);
                tree.selection = null;
                return;
              }
            }
          }
        }//end move up function

        function MoveDown (){
          var tree = listTree;
          var sel = tree.selection;
          //is the current selection an item?
          //if yes ->
          if (sel.type == "item"){
            //can the current selection be moved down?
            var selIndex = sel.index;
            // if yes ->
            if (selIndex < sel.parent.items.length){
              var parent = sel.parent;
              var grandParent = parent.parent;
              //save the indices for later expansion
              var pIndex = parent.index;
              var gpIndex = grandParent.index;

              var next = parent.items[selIndex + 1];

              var newItem = parent.add("item", next.text, selIndex);
              next.text = sel.text;
              tree.remove(sel);

              var toExpand = tree.items[gpIndex].items[pIndex];
              //for some reason I have to reset the expanded property to expand the parent node after deletion
              toExpand.expanded = false;
              toExpand.expanded = true;

              //setting the selection doesn't seem to work so I just unset the selection
              tree.selection = null;
              return;
            }
          }
          //if not an item, it is a node ->
          else if (sel.type == "node"){
            //does the node have a parent that is also a node?
            //if yes ->
            if (sel.parent.type == "node"){
              //can the current selection be moved down?
              var selIndex = sel.index;
              //if yes ->
              if (selIndex < sel.parent.items.length){
                var parent = sel.parent;
                //save the index for later expansion
                var pIndex = parent.index;
                var next = parent.items[selIndex + 1];
                var nextIndex = next.index;
                var nextChildren = next.items;
                var curChildren = sel.items;
                var newNext = parent.add("node", next.text, selIndex);
                for (l=0; l<nextChildren.length; l++){
                  newNext.add("item", nextChildren[l].text);
                }
                var newNode = parent.add("node", sel.text, selIndex+1);
                for (c=0; c<curChildren.length; c++){
                  newNode.add("item", curChildren[c].text);
                }
                tree.remove(sel);
                tree.remove(next);


                //expand the parent
                var toExpand = tree.items[pIndex];
                toExpand.expanded = false;
                toExpand.expanded = true;
                //expand the items
                var expandItems = toExpand.items;
                for (e=0; e<expandItems.length; e++){
                  expandItems[e].expanded = false;
                  expandItems[e].expanded = true;
                }

                tree.selection = null;
                return;
              }
            }
            //if does not have a parent, must be top-level
            else {
              //can this item be moved up?
              var selIndex = sel.index;
              //if yes ->
              if (selIndex < tree.items.length){
                //use the tree as the parent
                var next = tree.items[selIndex + 1];
                
                var nextChildren = next.items;
                var newNext = tree.add("node", next.text, selIndex);
                for (l=0; l<nextChildren.length; l++){
                  var nextGrandKids = nextChildren[l].items;
                  var newNextNode = newNext.add("node", nextChildren[l].text);
                  for (g=0; g<nextGrandKids.length; g++){
                    newNextNode.add("item", nextGrandKids[g].text);
                  }
                }

                tree.remove(next);
                tree.selection = null;
                return;
              }
            }
          }
        }//end move down function
        






      function stgsJson(){
        var listItems = [];
         var listTabs = listTree.items;
         for (t=0; t<listTabs.length; t++){
           var lTab = listTabs[t];
           var tabObj = {"name" : lTab.toString(), "order" : t};
           listItems.push(tabObj);
           var listSections = lTab.items;
           for (s=0; s<listSections.length; s++){
             var lSection = listSections[s];
             var sectObj = {"name" : lSection.toString(), "order" : s};
             listItems.push(sectObj);
             var listBtns = lSection.items;
             for (b=0; b<listBtns.length; b++){
               var lBtn = listBtns[b];
               var btnObj = {"name" : lBtn.toString(), "order" : b};
               listItems.push(btnObj);
             }
           }
         }
         return listItems;
      }

       function reWriteJson(){
         var origList = jsonContents.tabs;
         //iterate through the tabs, sections, buttons of original list
         //and search the list generated in settings
         for (i=0; i<origList.length; i++){
           var tab = origList[i];
           var sections = tab.sections;
           for (j=0; j<sections.length; j++){
            var sect = sections[j];
            var buttons = sect.buttons;
            for (k=0; k<buttons.length; k++){
              var btn = buttons[k];
              var bi = buttons.indexOf(btn);
              var btnSearch = searchList(btn.id);
              if (btnSearch == true){
                var order = listOrder(btn.id);
                if (order == btn.order) {
                  //don't do anything
                }
                else {
                  //change the order
                  btn.order = order;
                  buttons.sort(function (a, b) {
                    return a.order - b.order;
                  });
                  reassignOrder(buttons);
                }
              }
              else {
                delete buttons[bi];
              }
            }

            var sectSearch = searchList(sect.id);
            var si = sections.indexOf(sect);
            if (sectSearch == true){
              var order = listOrder(sect.id);
              if (order == sect.order) {
                //don't do anything
              }
              else {
                //change the order
                sect.order = order;
                sections.sort(function (a, b) {
                  return a.order - b.order;
                });
                reassignOrder(sections);
              }
            }
            else {
              delete sections[si];
            }
           }

            var tabSearch = searchList(tab.id); 
            var index = origList.indexOf(tab);
            if (tabSearch == true){
              var order = listOrder(tab.id);
              if (order == tab.order) {
                //don't do anything
              }
              else {
                //change the order
                tab.order = order;
                tabs.sort(function (a, b) {
                  return a.order - b.order;
                });
                reassignOrder(tabs);
              }
            }
            else {
            //delete the item from the original list
              delete origList[index];
            }
         }
         var newJsonString = JSON.stringify(origList);
         newJsonString = newJsonString.replace(/,null/g, "");
         newJsonString = newJsonString.replace(/null/g,"");
         
         var correctString = 'var buttons = { "tabs" : ' + newJsonString + ' }; ';
        listFile.open('w');
        listFile.write(correctString);
        listFile.close();

        correctString = "";
        myPanel.close();
       }

       //this searches a simple array list generated by settings treeview
       function searchList(id){
          var idList = stgsJson();
          for (i=0; i<idList.length; i++){
            var theId = idList[i].name;
            if (theId == id){
              return true;
            }
          }
        }

        //this returns the order of something from the list
        function listOrder(id){
          var idList = stgsJson();
          for (var o in idList) {
            var theId = idList[o].name;
            if (theId == id){
              var num = idList[o].order;
            }
          }
          return num+1;
        }

        function reassignOrder(thing){
          for (t=0; t<thing.length; t++){
            var item = thing[t];
            var corOrder = thing.indexOf(item)+1;
            item.order = corOrder;
          }
        }


        myPanel.layout.layout(true);

        return myPanel;
      }


      var myScriptPal = myScript_buildUI(thisObj);


      if (myScriptPal != null && myScriptPal instanceof Window){
        myScriptPal.center();
        myScriptPal.show();
        }

      }

      myScript(this);
    }

app.endUndoGroup();

} // end of try

catch(err){
  alert("Error at line # " + err.line.toString() + "\r" + err.toString());

} // end of catch



//old function originally used for creating a JSON object of everything in the list tree
      //  function stgsJson(){
      //    var listItems = [];
      //     var listTabs = listTree.items;
      //     for (t=0; t<listTabs.length; t++){
      //       var lTab = listTabs[t];
      //       var newObj = {};
      //       newObj.id = lTab.toString();
      //       newObj.sections = [];
      //       var listSections = lTab.items;
      //       for (s=0; s<listSections.length; s++){
      //         var lSection = listSections[s];
      //         var obj = {};
      //         obj.id = lSection.toString();
      //         obj.buttons = [];
      //         newObj.sections.push(obj);
      //         var listBtns = lSection.items;
      //         for (b=0; b<listBtns.length; b++){
      //           var btnObj = {};
      //           var lBtn = listBtns[b];
      //           var btnObj = {};
      //           btnObj.id = lBtn.toString();
      //           obj.buttons.push(btnObj);
      //         }
      //       }
      //       listItems.push(newObj);
      //     }
      //     return listItems;
      //  }