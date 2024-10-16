var csInterface = new CSInterface();
//importing button info
var customBtns = buttons;

var body = document.querySelector('body');
var moveBtn = document.getElementById('moveItems');

moveBtn.onclick = function(){

    var arrowLeft = "<div class='arrow left'>〈</div>";
    var arrowRight = "<div class='arrow right'>〉</div>";

    var addBtn = document.getElementById('addNew');
    var stgsBtn = document.getElementById('settings');

    //if edit mode is not already on, turn it on
    if (!body.classList.contains('edit')){
        body.classList.add('edit');
        moveBtn.classList.add('active');
        //disabling the other buttons for now
        addBtn.onclick = function(){
            //don't do anything
        }
        // stgsBtn.onclick = function(){
        //     //don't do anything
        // }

        //if we are looking at a tab, allow the sections and buttons to be reordered
        if (open.type == "tab"){
            var trashBtn = "<div class='trash'><img src='img/trash.png' alt='trash icon' /></div>";

            var buttons = document.querySelectorAll('button');
            for (i=0; i<buttons.length; i++){
                var button = buttons[i];
                button.disabled = true;
                var origHtml = button.outerHTML;
                button.outerHTML = "<div class='arrows'>"+arrowLeft+trashBtn+origHtml+arrowRight+"</div>";
            }
            var sections = document.querySelectorAll('.section');
            for (s=0; s<sections.length; s++){
                var section = sections[s];
                var origSect = section.outerHTML;
                section.outerHTML = "<div class='arrows'>"+arrowLeft+trashBtn+origSect+arrowRight+"</div>";
            }
            open.type = open.type+"edit";
            enableReorder();  
            enableDelete();
        }
        
        //if we are open to the tab menu
        else if (open.type == 'menu'){
            var trashBtn = "<div class='inTab trash'><img src='img/trash.png' alt='trash icon' /></div>";

            var tabs = document.querySelectorAll('.tabTitle');
            for (t=0; t<tabs.length; t++){
                var tab = tabs[t];
                var origTab = tab.outerHTML;
                tab.outerHTML = "<div class='arrows'>"+arrowLeft+trashBtn+origTab+arrowRight+"</div>";
            }
            open.type = open.type+"edit";
            enableReorder();
            enableDelete();
        }
    }

    //if edit mode is already on, 
    //edit the json
    //then reload
    else {
        writeNewJson();
        location.reload();
    }
}

function enableReorder(){
    var arrowEls = document.querySelectorAll('.arrows');
    for (a=0; a<arrowEls.length; a++){
        var el = arrowEls[a];
        var leftArr = el.querySelector('.left');
        //right arrows have to be defined by the LAST instance
        var rightArrows = el.querySelectorAll('.right');
        var nums = rightArrows.length;
        var rightArr = rightArrows[nums-1];
        leftArr.onclick = function(e){
            var parentEl = e.target.parentElement;
            moveUp(parentEl);
        }
        rightArr.onclick = function(e){
            var parentEl = e.target.parentElement;
            moveDown(parentEl);
        }
    }
}

function moveUp(cont){
    var last = cont.previousSibling;
    if (last){
        if (last.classList.contains('arrows')){
            var newTh = last.children[2];
            var oldTh = cont.children[2];
            var newHtml = newTh.outerHTML;
            var oldHtml = oldTh.outerHTML;
            newTh.outerHTML = oldHtml;
            oldTh.outerHTML = newHtml;
        }
    }
    enableReorder();
}

function moveDown(cont){
    var next = cont.nextSibling;   
    if (next){
        if (next.classList.contains('arrows')){
            var newTh = next.children[2];
            var oldTh = cont.children[2];
            var newHtml = newTh.outerHTML;
            var oldHtml = oldTh.outerHTML;
            newTh.outerHTML = oldHtml;
            oldTh.outerHTML = newHtml;
        } 
    }
    enableReorder();
}

function writeNewJson(){
    //contents of the current custom.js
    var btnString = JSON.stringify(customBtns);
    var btnJson = JSON.parse(btnString);
    var jsonTabs = btnJson.tabs;

    //if we are editing the contents of a tab
    if (open.type == "tabedit"){
        //return a list of what's open
        var newSections = [];
        var openTab = document.querySelector('.tab');
        var sections = openTab.querySelectorAll('.section');
        for (s=0; s<sections.length; s++){
            var section = sections[s];
            var sectObj = {};
            sectObj.order = s+1;
            sectObj.id = section.id;
            sectObj.buttons = [];
            var buttons = section.querySelectorAll('button');
            for (b=0; b<buttons.length; b++){
                var button = buttons[b];
                var btnObj = {};
                btnObj.order = b+1;
                btnObj.id = button.id;
                btnObj.datapath = button.getAttribute('data-path');
                btnObj.onclick = button.getAttribute('onclick');
                sectObj.buttons.push(btnObj);
            }
            newSections.push(sectObj);
        }
        //get the number of the tab that's open
        var tabNum = open.num;

        var editTab = jsonTabs[tabNum];
        editTab.sections = newSections;
    }

    //if we are editing the tab menu
    else if (open.type == "menuedit"){
        //generate a list of the tabs shown
        var curTabs = [];
        var tabs = document.querySelectorAll('.tabTitle');
        for (s=0; s<tabs.length; s++){
            var curTab = tabs[s];
            curTabs.push(curTab.innerText);
        }

        //look for the current tabs in the list generated above to edit order
        for (t=0; t<jsonTabs.length; t++){
            var tab = jsonTabs[t];
            var searchTab = curTabs.indexOf(tab.id)
            //if the tab ISNT found, it has been deleted, and should be deleted from the original json
            if (searchTab < 0){
                var indexOrig = jsonTabs.indexOf(tab);
                jsonTabs.splice(indexOrig, 1);
            }
            else {
                var order = searchTab + 1;
                tab.order = order;
            }
        }
        //re-order tabs in origial json based on new order
        jsonTabs.sort(function (a, b){
            return a.order - b.order;
        });
        //re-assign order numbers in json
        for (t=0; t<jsonTabs.length; t++){
            var tab = jsonTabs[t];
            tab.order = t + 1;
        }
    }

    //passes to a function in scripts.js
    changeJson(btnJson);
}

function enableDelete(){
    var delBtn = document.querySelectorAll('.trash');
    for (d=0; d<delBtn.length; d++){
        var btn = delBtn[d];
        btn.onclick = function(e){
            var clicked = e.target;
            if (!clicked.classList.contains('trash')){
                var clicked = clicked.parentElement;
            }
            var btnFriend = clicked.nextSibling;
            var delId = btnFriend.id;
            if (!delId){
                var delId = btnFriend.innerText;
            }
            var yesNo = confirm('Do you want to delete '+delId+'?');
            if (yesNo == true){
                deleteFromHtml(btnFriend);
            }
        }
    }
}

function deleteFromHtml(item){
    //this function should remove the item from the page
    if (open.type == "tabedit"){
        var toDelete = item.parentElement;
        var curTab = document.querySelector('.tab');
    }
    else if (open.type == "menuedit"){
        var toDelete = item.parentElement;
        var curTab = document.getElementById('openSpace');
    }
    var delHtml = toDelete.outerHTML;
    var tabHtml = curTab.innerHTML;
    var splitTab = tabHtml.split(delHtml);
    var first = splitTab.shift();
    var last = splitTab.pop();
    var newTabHtml = first+last;
    curTab.innerHTML = newTabHtml;

    enableReorder();
    enableDelete();
}