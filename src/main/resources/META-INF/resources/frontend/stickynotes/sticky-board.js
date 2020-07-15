import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import "@vaadin/flow-frontend/stickynotes/sticky-board-css-loader.js";

/**
 *
 */
class StickyBoard extends ThemableMixin(PolymerElement) {
    static get template() {
        return html `
                <style>
                </style> 

                <div id="board" 
                    class="board"
                >
                    <div id="boardPopupButton"
                        class="boardPopupButton" 
                        on-click="toggleBoard" 
                    ></div>
                    <div class="noteList">
                        <ul id="noteList">
                            <li>
                                <div class="note" id="note">
                                    <div class="closeButton" ob-click="closeNote"></div>
                                    <div  class="title" contenteditable="true">Title</div>
                                    <div class="notearea" contenteditable="true">Buying a CAR!</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="addNote"></div>
                </div>
            `;
    }

    static get is() {
        return 'sticky-board';
    }
    
    updatePosition() {
        console.log("updatePosition");
        var rect = this.targetId.getBoundingClientRect();
//        console.log(targetid,alignTo,x_offset,y_offset);
        
        var boaradTop = rect.top;
        var boardLeft = rect.right;
        
        switch (this.alignTo) {
            case "TOP_RIGHT":
//                console.log("TOP_RIGHT: "+rect.top+":"+rect.right);
                boaradTop = rect.top + this.y_offset;
                boardLeft = rect.right + this.x_offset;
                break;
                
            case "BOTTOM_RIGHT":
                boaradTop = rect.bottom + this.y_offset;
                boardLeft = rect.right + this.x_offset;
                break;
                
            case "BOTTOM_LEFT":
                boaradTop = rect.bottom + this.y_offset;
                boardLeft = rect.left + this.x_offset;
                break;
                
            case "TOP_LEFT":
                boaradTop = rect.top + this.y_offset;
                boardLeft = rect.left + this.x_offset;
                break;
        }
//        console.log("pos: "+popupTop+","+popupLeft);
        
        var w = document.body.getBoundingClientRect().width;
        var q = this.$.board.getBoundingClientRect();
        if (boardLeft + q.width > w && w - q.width > 0) boardLeft = w - q.width;
        this.$.board.style.top = boaradTop + "px";
        this.$.board.style.left = boardLeft + "px";
        
        this.$.board.classList.add("show");
        console.log("^^^^^");
    }
    
    toggleBoeard() {
        this.$server.toggleBoard();
    }
    
    init(_targetId,_alignTo,_xOffset,_yOffset) {
        console.log("init object");
        console.log(_targetId,_alignTo,_xOffset,_yOffset);
        this.targetId = _targetId;
        this.alignTo = _alignTo;
        this.x_offset = _xOffset;
        this.y_offset = _yOffset;
        console.log("^^^^^");
    }
    
//    ready() {
//        console.log("ready");
//        this.updatePositionAndShow();
//        console.log("^^^^^");
//    }
    
    afterServerUpdate() {
        console.log("afterServerUpdate...");
        console.log(this);
        this.updatePosition();
        console.log("^^^^^");
    }
};

customElements.define(StickyBoard.is, StickyBoard);