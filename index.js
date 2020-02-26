webix.ui(
    {rows: [
            {view: "toolbar", css: "webix_dark", cols: [
                    {view: "label", label: "My App"},
                    {},
                    {view: "button", type: "icon", icon: "wxi-user", label: "Profile", width: 100, css: "webix_transparent"}
                ]
            },
            {cols: [
                    {type: "clean", css: "navigation-background", rows: [
                            {view: "list", template: "#title#", select: true, css: "navigation-background", data: [
                                    {id: 1, title: "Dashboard"},
                                    {id: 2, title: "Users"},
                                    {id: 3, title: "Products"},
                                    {id: 4, title: "Locations"}
                                ]
                            },
                            {},
                            {template: "<span class='webix_icon wxi-check'></span> Connected ", height: 40, css: "connection-status navigation-background"}
                        ]
                    },
                    {view: "resizer"},
                    {view: "datatable", autoConfig: true, data: small_film_set, gravity: 4, columns:[
                            {id:"title", header: "Title", fillspace: true},
                            {id:"year", header: "Year"},
                            {id:"votes", header: "Votes"},
                            {id:"rating", header: "Rating"},
                            {id:"rank", header: "Rank"}
                        ],
                    },
                    {view: "form",
                        gravity: 2,
                        elements: [
                            {type: "section", template: "EDIT FILMS"},
                            {view: "text", label: "Title"},
                            {view: "text", label: "Year"},
                            {view: "text", label: "Rating"},
                            {view: "text", label: "Votes"},
                            {margin: 30, cols: [
                                    {view: "button", value: "Add new", css: "webix_primary"},
                                    {view: "button", value: "Clear"}
                                ]
                            },
                            {}
                            ]}
                ]},
            {type:"clean", cols:[
                    {},
                    {template: "The software is provided by <a href='https://webix.com/'>webix.com</a>. All rights reserved (c)", height: 40},
                    {}
                ]}
        ]
    }
);