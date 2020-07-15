package com.awesomecontrols.stickynotes;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasComponents;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.HasStyle;
import com.vaadin.flow.component.HasTheme;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Tag("stick-note") 
@JsModule("./stickynotes/sticky-note.js")
public class StickyNote extends Component implements  HasSize, HasTheme, HasStyle, HasComponents {
    private static final long serialVersionUID = 8843104328921005320L;

    private final static Logger LOGGER = Logger.getLogger(StickyNote.class.getName());
    static {
        if (LOGGER.getLevel() == null) {
            LOGGER.setLevel(Level.INFO);
        }
    }
    
    
    private List<IVisibilityEvent> visibilityEventListeners = new ArrayList<>();
    
    
    /**
     * Create a popup near to the target component
     * @param target is the ID of the target component
     * @param content  the popup content.
     */
    StickyNote(String content) {
                 
    }
    
    /**
     * Set the popup content 
     * @param content to shown
     */
    public void setContent(String content) {
    }
    
    
    private void fireVisibilityChangeEvent() {

        for (IVisibilityEvent visibilityEventListener : this.visibilityEventListeners) {
            visibilityEventListener.visibilityChanged();
        }
    }
}

