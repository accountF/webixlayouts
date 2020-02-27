const profileList = webix.ui({
    view: "popup",
    id: "profileMenu",
    body: {
        view: "list",
        autoheight: true,
        select: true,
        data: ["Settings", "Log out"]
    }
});

const addFilm = function () {
    if ($$("form-film").validate()) {
        const filmInfo = $$("form-film").getValues();
        $$("table-films").add(filmInfo);
        $$("form-film").clear();
        webix.message({text: "Film was added!", type: "success"})
    } else {
        webix.message({text: "Check fields please", type: "error"})
    }
};

const clearForm = function () {
    webix.confirm({
        text: "Are you sure?"
    }).then(function (result) {
        if (result) {
            $$("form-film").clear();
            $$("form-film").clearValidation();
        }
    })
};

webix.ui(
    {
        rows: [
            {
                view: "toolbar", css: "webix_dark", cols: [
                    {view: "label", label: "My App"},
                    {},
                    {
                        view: "button",
                        id: "btn_profile",
                        type: "icon",
                        icon: "wxi-user",
                        label: "Profile",
                        width: 100,
                        css: "webix_transparent",
                        popup: "profileMenu"
                    }
                ]
            },
            {
                cols: [
                    {
                        type: "clean", css: "navigation-background", rows: [
                            {
                                view: "list",
                                template: "#title#",
                                scroll: false,
                                select: true,
                                css: "navigation-background",
                                data: [
                                    {id: 1, title: "Dashboard"},
                                    {id: 2, title: "Users"},
                                    {id: 3, title: "Products"},
                                    {id: 4, title: "Locations"}
                                ]
                            },
                            {},
                            {
                                template: "<span class='webix_icon wxi-check'></span> Connected ",
                                height: 40,
                                css: "connection-status navigation-background"
                            }
                        ]
                    },
                    {view: "resizer"},
                    {
                        view: "datatable",
                        id: "table-films",
                        autoConfig: true,
                        data: small_film_set,
                        gravity: 4,
                        scrollX: false,
                        columns: [
                            {id: "title", header: "Title", fillspace: true},
                            {id: "year", header: "Year"},
                            {id: "votes", header: "Votes"},
                            {id: "rating", header: "Rating"},
                            {id: "rank", header: "Rank"}
                        ],
                    },
                    {
                        view: "form",
                        id: "form-film",
                        gravity: 2,
                        elements: [
                            {type: "section", template: "Edit films"},
                            {view: "text", label: "Title", name: "title", invalidMessage: "Title must be filled in"},
                            {view: "text", label: "Year", name: "year", invalidMessage: "Year should be between 1970 and current"},
                            {view: "text", label: "Rating", name: "rating", invalidMessage: "Rating cannot be empty or 0"},
                            {view: "text", label: "Votes", name: "votes", invalidMessage: "Votes must be less than 100000"},
                            {margin: 30, cols: [
                                    {view: "button", value: "Add new", css: "webix_primary", click: addFilm},
                                    {view: "button", value: "Clear", click: clearForm}
                                ]
                            },
                            {}
                        ],
                        rules: {
                            title: webix.rules.isNotEmpty,
                            year: function (value) {
                                return 1970 <= value && value <= new Date().getFullYear();
                            },
                            rating: function (value) {
                                return webix.rules.isNotEmpty(value) && value !== "0"
                            },
                            votes: function (value) {
                                return value < 100000;
                            }
                        }
                    }
                ]
            },
            {
                css: "footer-text",
                height: 35,
                template: "The software is provided by <a href='https://webix.com/'>webix.com</a>. All rights reserved (c)"
            }
        ]
    }
);