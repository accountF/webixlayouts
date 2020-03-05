webix.protoUI({
    name: "formGenerator",
    $init: function (config) {
        const fields = config.fields;
        const generateElements = fields.map((field) => {
            return {
                label: field[0].toUpperCase() + field.slice(1),
                view: "text",
                name: field
            }
        });

        const saveAction = config.on || config.click || function () {
            webix.message("Save")
        };
        const clearAction = config.on || config.click || function () {
            webix.message("Clear")
        };

        config.elements = [
            {rows: generateElements},
            {
                cols: [
                    {view: "button", value: "Clear", click: clearAction, width: 150},
                    {},
                    {view: "button", value: "Add", css: "webix_primary", click: saveAction, width: 150}
                ]
            }
        ];
    }
}, webix.ui.form);