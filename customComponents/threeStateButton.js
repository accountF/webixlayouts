webix.protoUI({
    name: "buttonWithState",
    $init: function (config) {
        let state = config.state || 0;
        config.label = config.states[state];
        webix.html.addCss(this.$view, `button-state-${state}`);

        this.attachEvent("onItemClick", function () {
            let currentButtonState = this.config.state;
            webix.html.removeCss(this.$view, `button-state-${currentButtonState}`);

            if (currentButtonState < (Object.keys(this.config.states).length - 1)) {
                currentButtonState += 1;
            } else {
                currentButtonState = 0;
            }

            this.config.label = this.config.states[currentButtonState];
            this.refresh();
            this.config.state = currentButtonState;
            webix.html.addCss(this.$view, `button-state-${currentButtonState}`);
            this.callEvent("onStateChange", [currentButtonState]);
        });
    }
}, webix.ui.button);



