webix.protoUI({
    name: "formGenerator",
    defaults: {
        cancelAction: function () {
            this.clear();
        },
        saveAction: function () {
            webix.message(JSON.stringify(this.getValues(), null, 2))
        }
    },
    $init: function (config) {
        const fields = config.fields;
        const generateElements = fields.map((field) => {
            return {
                label: `${field[0].toUpperCase()}${field.slice(1)}`,
                view: "text",
                name: field
            }
        });

        config.elements = [
            {rows: generateElements},
            {
                cols: [
                    {view: "button", value: "Clear", click: webix.bind(function () {
                            this.config.cancelAction.call(this);
                        }, this), width: 150},
                    {},
                    {view: "button", value: "Add", css: "webix_primary", click: webix.bind(function () {
                            this.config.saveAction.call(this);
                        }, this), width: 150}
                ]
            }
        ];
    }
}, webix.ui.form);