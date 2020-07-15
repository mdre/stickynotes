package com.awesomecontrols.stickynotes;

import com.vaadin.flow.component.ClientCallable;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.HasStyle;
import com.vaadin.flow.component.HasTheme;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.dom.Element;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;


@Tag("sticky-board")
//@StyleSheet("frontend://bower_components/menubar/cards.css")
@JsModule("./stickynotes/sticky-board.js")
public class StickyBoard extends PolymerTemplate<IStickyBoardModel> implements HasSize, HasTheme, HasStyle {
    private static final long serialVersionUID = 270472077985436933L;
    
    private final static Logger LOGGER = Logger.getLogger(StickyBoard.class.getName());
    static {
        if (LOGGER.getLevel() == null) {
            LOGGER.setLevel(Level.INFO);
        }
    }
    
    @Id("board")
    Div board;
    
    //@Id("stickyArea")
    Div stickyArea;
    
    double height;
    double width;
    double top;
    double left;
    
    Element targetId;
        
    public enum Align {
        TOP_RIGHT,
        BOTTOM_RIGHT,
        BOTTOM_LEFT,
        TOP_LEFT
    }
    
    Align alignTo = Align.TOP_RIGHT;
    
    int x_offset = 0;
    int y_offset = 0;
    
    private List<IVisibilityEvent> visibilityEventListeners = new ArrayList<>();
    
    public StickyBoard(Element target) {
        this.targetId = target;
        UI.getCurrent().add(this);
        getElement().callJsFunction("init",target,alignTo.toString(),x_offset,y_offset);
    }
    
    public void show() {
        //getElement().callJsFunction("updatePositionAndShow");
    }
    
    
    /**
     * Set the component align based on target ID
     * @param align enum with the available target aligns
     * @return this
     */
    public StickyBoard setAlign(Align align) {
        this.alignTo = align;
        update();
        return this;
    }
    
    /**
     * Set the x offset to be added to the align 
     * @param offset in pixels
     * @return this
     */
    public StickyBoard setXOffset(int offset) {
        this.x_offset = offset;
        update();
        return this;
    }
    
    /**
     * Set the y offset to be added to the align 
     * @param offset in pixels
     * @return this 
     */
    public StickyBoard setYOffset(int offset) {
        this.y_offset = offset;
        update();
        return this;
    }
    
    private void update() {
        getElement().callJsFunction("init",this.targetId,alignTo.toString(),x_offset,y_offset);
    }
        
    public void addStickyNote(StickyNote note) {
        
    }
    
    @ClientCallable
    private void toggleBoard() {
        getElement().callJsFunction("updatePositionAndShow", this.targetId);
    }

    
    /**
     * Add a visibility change listener.
     * @param event listener
     * @return this
     */
    public StickyBoard addVisibilityChangeListener(IVisibilityEvent event) {
        if (this.visibilityEventListeners == null) {
            this.visibilityEventListeners = new ArrayList<>();
        }
        this.visibilityEventListeners.add(event);
        return this;
    }
    
    /**
     * Remove the event listener.
     * @param event listener
     * @return true if the listener exist and was removed.
     */
    public boolean removeVisibilityChangeListener(IVisibilityEvent event) {
        this.visibilityEventListeners.remove(event);
        return this.visibilityEventListeners.remove(event);
    }


    public StickyBoard setHeight(double h) {
        this.height = h;
        this.board.getStyle().set("height", height + "px");
        return this;
    }


    public StickyBoard setWidth(double w) {
        this.width = w;
        this.board.getStyle().set("width", w + "px");
        return this;
    }
}

