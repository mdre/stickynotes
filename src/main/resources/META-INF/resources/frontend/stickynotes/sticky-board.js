import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import "@vaadin/flow-frontend/stickynotes/sticky-board-css-loader.js";

/**
 *
 */
class StickyBoard extends ThemableMixin(PolymerElement) {
    
    log(...logVal) {
        if (this.logEnabled) {
            console.log(...logVal);
        }
    }
    
    constructor() {
        super();
        this.logEnabled=true;
    }
    
    static get template() {
        return html `
                <style>
                    width: 0px;
                    height: 0px;
                </style> 

                <div id="boardPopupButton"
                    class="boardPopupButton unselectable" 
                    on-click="toggleBoard" 
                ></div>
                <div id="stickyArea" class="stickyArea">
                    <div id="addNote" class="addNote unselectable" on-click="addNote"></div>
                    <ul id="noteList"></ul>    
                </div>
            `;
    }

    noteTemplate() {
        return html`
                    <li>
                        <div id="note" class="note">
                            <div id="confirmDialog" class="confirmDialog">
                                <div id="glass" class="confirmDialogGlass"></div>
                                <div id="cancel" class="cancel unselectable"></div>
                                <div id="confirm" class="confirm unselectable"></div>
                            </div>
                            <div id="closeButton" class="closeButton unselectable"></div>
                            <div id="noteTitle" class="title" contenteditable="true"  data-text="Title"></div>
                            <div id="noteText" class="notearea" contenteditable="true"  data-text="enter note text."></div>
                        </div>
                    </li>
                `;
    }

    static get is() {
        return 'sticky-board';
    }
    
    updatePosition() {
        this.log("updatePosition");
        this.log(this.targetId,this.alignTo,this.x_offset,this.y_offset);
        
        //this.log(this.$.boardPopupButton.parentNode.host.parentElement);
        var parentRect = this.$.boardPopupButton.parentNode.host.parentElement.getBoundingClientRect();
        this.log("parentRect: ",parentRect);
        
        var rect = this.targetId.getBoundingClientRect();
        this.log("rect: ",rect);

        // estado por defecto
        var bpbZidx = "200";
        var saZidx = "199";
        
        var tZidx = this.targetId.style.zIndex;
        if (tZidx && !isNaN(tZidx)) {
            this.log("zIndex: ",tZidx);
            bpbZidx = "" + (parseInt(tZidx) + 2);
            saZidx = "" + (parseInt(tZidx) + 1);
        } 
        
        this.log("sticky zIndex: ",bpbZidx);
        
        var popupButtonTop = rect.top;
        var popupButtonLeft = rect.right;
        
        switch (this.alignTo) {
            case "TOP_RIGHT":
//                console.log("TOP_RIGHT: "+rect.top+":"+rect.right);
                popupButtonTop = rect.top + this.y_offset - parentRect.top;
                popupButtonLeft = rect.right + this.x_offset - parentRect.left;
                break;
                
            case "BOTTOM_RIGHT":
                popupButtonTop = rect.bottom + this.y_offset - parentRect.top;
                popupButtonLeft = rect.right + this.x_offset - parentRect.left;
                break;
                
            case "BOTTOM_LEFT":
                popupButtonTop = rect.bottom + this.y_offset - parentRect.top;
                popupButtonLeft = rect.left + this.x_offset - parentRect.left;
                break;
                
            case "TOP_LEFT":
                popupButtonTop = rect.top + this.y_offset - parentRect.top;
                popupButtonLeft = rect.left + this.x_offset - parentRect.left;
                break;
        }
//        console.log("pos: "+popupTop+","+popupLeft);
        
        var w = document.body.getBoundingClientRect().width;
        var q = this.$.boardPopupButton.getBoundingClientRect();
        if (popupButtonLeft + q.width > w && w - q.width > 0) popupButtonLeft = w - q.width;
        this.$.boardPopupButton.style.top = popupButtonTop + "px";
        this.$.boardPopupButton.style.left = popupButtonLeft + "px";
        this.$.boardPopupButton.style.zIndex = bpbZidx;
        
        this.$.stickyArea.style.top = popupButtonTop + "px";
        this.$.stickyArea.style.left = popupButtonLeft + "px";
        this.$.stickyArea.style.zIndex = saZidx;
        
        this.log("^^^^^");
    }
    
    toggleBoard() {
        this.$.stickyArea.classList.toggle("show");
        this.$server.toggleBoard();
    }
    
    mutationEvent(mutationRecord) {
        this.log(mutationRecord);
        this.updatePosition();
    }

    init(_targetId,_alignTo,_xOffset,_yOffset) {
        console.log("init object");
        console.log(_targetId,_alignTo,_xOffset,_yOffset);
        this.targetId = _targetId;
        this.alignTo = _alignTo;
        this.x_offset = _xOffset;
        this.y_offset = _yOffset;
        
        this.observer = new MutationObserver((event)=>{this.mutationEvent(event);});
        this.observer.observe(this.targetId,{childList: false, subtree: false, attributes: true});
        
        console.log("^^^^^");
    }
    
    //---- Close event ---
    closeNote(event) {
        console.log("closeNote");
        console.log("this",this);
        console.log("event:",event);
        
        console.log(this.$.stickyArea);
        
        var confirmDialog = event.path[1].querySelector("#confirmDialog");
        confirmDialog.classList.add("show");
        
    }
    
    closeConfirm(event) {
        console.log("close confirm:", event);
        event.path[3].remove();
    }
    
    closeCancel(event) {
        console.log("close cancel:", event);
        event.path[1].classList.remove("show");
    }
    //------------------
    
    
    internalAddNote(title, noteText) {
        var noteList = this.shadowRoot.querySelector("#noteList");
        // console.log(noteList);
        
        // como la referencia es desde 0, se puede usar la cantidad 
        // dado que ya apunta al siguiente elemento.
        var nodeIdx = noteList.childElementCount; 
        //console.log("nodeIdx:",nodeIdx);
        
        // agregar el li a la lista
        noteList.appendChild(this.noteTemplate().content.cloneNode(true));
        
        var lis = noteList.getElementsByTagName("li");
        //console.log("li list:",lis);
        
        // obtener la referencia
        var newNote = lis[nodeIdx];

        if (title) {
            var t = newNote.querySelector("#noteTitle");
            t.innerHTML = title;
//                    .replace(/<div><br><\/div>/g)
//                    .replace(/<div>/g,"\n")
//                    .replace(/<\/div>/g,"")
//                    .replace(/<br>/g,"\n");
        }
        

        if (noteText) {
            var nt = newNote.querySelector("#noteText");
            nt.innerHTML = noteText;
//                    .replace(/<div><br><\/div>/g)
//                    .replace(/<div>/g,"\n")
//                    .replace(/<\/div>/g,"")
//                    .replace(/<br>/g,"\n");
        }

        var cb = newNote.querySelector("#closeButton");
        cb.addEventListener("click",(event)=>{this.closeNote(event);},false);
        
        var closeConfirm = newNote.querySelector("#confirm");
        closeConfirm.addEventListener("click",(event)=>{this.closeConfirm(event);},false);
        
        var closeCancel =  newNote.querySelector("#cancel");
        closeCancel.addEventListener("click",(event)=>{this.closeCancel(event);},false);
        
    } 
    
    
    addNote(event) {
        event.stopPropagation();
        this.internalAddNote();
    }
    
    
    
//    ready() {
//        super.ready();
//        console.log("ready.....");
//        let fragmentsTemplate = this.$.boardPopupButton;
//
//        fragmentsTemplate.addEventListener('dom-change', () => {
//            this.updatePosition();
//        }); 
//        console.log("^^^^^");
//    }
//    
//    afterServerUpdate() {        
//        console.log("afterServerUpdate...");
//        console.log(this);
//        this.updatePosition();
//        console.log("^^^^^");
//    }
//    
    save() {
        this.log("save content");
        this.log(this.$.noteList);
        this.log(this.$.noteList.children);
        
        var lis = this.$.noteList.getElementsByTagName("li");
        this.log("lis:",lis);
        
        var saveNoteData = [];
        for (var noteItem of this.$.noteList.children ) {
            console.log("for",noteItem);
            var nTitle = noteItem.querySelector("#noteTitle").innerHTML
                    .replace(/<div><br><\/div>/g,"\n")
                    .replace(/<div>/g,"\n")
                    .replace(/<\/div>/g,"")
                    .replace(/<br>/g,"\n");
            var nText = noteItem.querySelector("#noteText").innerHTML
                    .replace(/<div><br><\/div>/g,"\n")
                    .replace(/<div>/g,"\n")
                    .replace(/<\/div>/g,"")
                    .replace(/<br>/g,"\n");
            
            saveNoteData.push({
                    title: nTitle,
                    noteText: nText
                });
          
        }
        this.log(saveNoteData);
        this.log("^^^^^ save ^^^^^");
        
        return saveNoteData;
    }
    
    load(data) {
        var notesData = JSON.parse(data);        
        for (var note of notesData) {
            this.log(note,"t: ",note.title,"note text:",note.noteText);
            this.internalAddNote(note.title, note.noteText);
        }
    }
};

customElements.define(StickyBoard.is, StickyBoard);