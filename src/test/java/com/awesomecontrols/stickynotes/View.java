package com.awesomecontrols.stickynotes;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;

@Route("")
public class View extends Div {

    public View() {

        Button button = new Button("Click me", event -> {
            
        });
        button.setThemeName("primary");
        button.setId("buttonID");
        add(button);

        TextField subtext = new TextField("subtext");
        Button subtn = new Button("subbutton");
        VerticalLayout vlPop = new VerticalLayout();
        vlPop.add(subtext);
        vlPop.add(subtn);

        StickyBoard sb = new StickyBoard(button.getElement());
        this.add(sb);

    }
}
