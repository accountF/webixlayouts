const popupWithProfileList = webix.ui({
    view: "popup",
    id: "profile-menu",
    body: {
        view: "list",
        autoheight: true,
        select: true,
        data: ["Settings", "Log out"]
    }
});

const addFilm = function () {
    const filmForm = $$("form-film");
    const filmTable = $$("table-films");
    if (filmForm.validate()) {
        const filmInfo = filmForm.getValues();
        const filmId = filmInfo.id;
        if (filmId) {
            filmTable.updateItem(filmId, filmInfo);
            webix.message({text: "Film was updated!", type: "success"})
        } else {
            filmTable.add(filmInfo);
            webix.message({text: "Film was added!", type: "success"})
        }
        filmForm.clear();
    } else {
        webix.message({text: "Check fields please", type: "error"})
    }
};

const clearForm = function () {
    const filmForm = $$("form-film");
    webix.confirm({
        text: "Are you sure?"
    }).then(function (result) {
        if (result) {
            filmForm.clear();
            filmForm.clearValidation();
        }
    })
};

const tableInMainPart = {
    view: "datatable",
    id: "table-films",
    autoConfig: true,
    select: true,
    url: "data/data.js",
    gravity: 4,
    scrollX: false,
    hover: "hover-background",
    columns: [
        {id: "id", autoWidth: true, header:"", css: "row-in-table-background", width:60},
        {id: "title", sort: "string", header: ["Title", {content: "textFilter"}], fillspace: true},
        {id: "year", sort: "int", header: ["Year", {content: "textFilter"}]},
        {id: "votes", sort: "int", header: ["Votes", {content: "textFilter"}]},
        {id: "del", header:"", template: "{common.trashIcon()}", width:50}
    ],
    on: {
        onAfterSelect: function (id) {
            const film = this.getItem(id);
            const filmForm = $$("form-film");
            filmForm.clearValidation();
            filmForm.setValues(film);
        }
    },
    onClick: {
        "wxi-trash": function (e, id) {
            this.remove(id);
            return false;
        }
    },
    scheme: {
        $init: function(obj){
            if(obj.votes.includes(",")){
                obj.votes = Math.ceil(obj.votes.replace(",",".")*1000);
            }
        }
    }
};

const formInMainPart = {
    view: "form",
    id: "form-film",
    gravity: 2.5,
    elements: [
        {type: "section", template: "Edit films"},
        {view: "text", label: "Title", name: "title", invalidMessage: "Title must be filled in"},
        {view: "text", label: "Year", name: "year", invalidMessage: "Year should be between 1900 and current"},
        {view: "text", label: "Rating", name: "rating", invalidMessage: "Rating cannot be empty or 0"},
        {view: "text", label: "Votes", name: "votes", invalidMessage: "Votes must be less than 1'000'000 and filled in"},
        {
            margin: 50, cols: [
                {view: "button", value: "Add", css: "webix_primary", click: addFilm},
                {view: "button", value: "Clear", click: clearForm}
            ]
        },
        {}
    ],
    rules: {
        title: webix.rules.isNotEmpty,
        year: function (value) {
            return 1900 <= value && value <= new Date().getFullYear();
        },
        rating: function (value) {
            return webix.rules.isNotEmpty(value) && value !== "0"
        },
        votes: function (value) {
            return webix.rules.isNotEmpty(value) && value < 1000000;
        }
    }
};

const listInMainPart = {
    rows: [
        {
            view: "toolbar",
            cols: [
                {
                    view: "text", id: "list_input",
                    on: {
                        onTimedKeyPress:
                        function() {
                            const userInfo = this.getValue().toLowerCase();
                            $$("list-users").filter(function (obj) {
                                return obj.name.toLowerCase().indexOf(userInfo) !== -1 || obj.country.toLowerCase().indexOf(userInfo) !== -1;
                            })
                        }
                    }
                },
                {view: "button", id: "btn-sort-asc", value: "Sort asc", css: "webix_primary", width: 150, click:function(){
                        $$("list-users").sort("#name#","asc");
                    }},
                {view: "button", id: "btn-sort-desc", value: "Sort desc", css: "webix_primary", width: 150, click:function(){
                        $$("list-users").sort("#name#","desc");
                    }},
            ]
        },
        {
            view: "list",
            id: "list-users",
            css: "list-users",
            url:"data/users.js",
            select: true,
            template: "#name# form #country# <span class='webix_icon wxi-close'></span>",
            onClick: {
                "wxi-close": function (e, id) {
                    this.remove(id);
                    return false;
                }
            }
        }]
};

const chartInMainPart = {
    view: "chart",
    value:"#age#",
    url:"data/users.js",
    type:"bar",
    xAxis:{
        template:"#age#",
        title:"Age"
    },
};

const treeInMainPart = {
    view: "treetable",
    id:"tree-products",
    columns:[
        { id:"id", header:"", width:50 },
        { id:"title", header:"Title", fillspace: true,
            template:"{common.treetable()} #title#" },
        { id:"price", header:"Price", width:200 }
    ],
    select:"cell",
    autoHeight:true,
    scroll:"y"
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
                        popup: "profile-menu"
                    }
                ]
            },
            {
                cols: [
                    {
                        type: "clean", css: "navigation-background", rows: [
                            {
                                view: "list",
                                id: "navigation",
                                template: "#title#",
                                scroll: false,
                                select: true,
                                multiView: true,
                                css: "navigation-background",
                                data: [
                                    {id: "Dashboard", title: "Dashboard"},
                                    {id: "Users", title: "Users"},
                                    {id: "Products", title: "Products"},
                                    {id: "Locations", title: "Locations"}
                                ],
                                on: {
                                    onAfterSelect: function(id) {
                                        $$(id).show();
                                    }
                                }
                            },
                            {},
                            {
                                template: "<span class='webix_icon wxi-check'></span> Connected",
                                height: 40,
                                css: "connection-status navigation-background"
                            }
                        ]
                    },
                    {view: "resizer"},
                    {
                        view: "multiview", gravity: 5,
                        cells: [
                            {id: "Dashboard", cols: [tableInMainPart, formInMainPart]},
                            {id: "Users", rows: [listInMainPart,chartInMainPart]},
                            {id: "Products", rows:[treeInMainPart]},
                            {id: "Locations", template: "Place for Locations"}
                        ]
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

const treeInProducts = $$("tree-products");
treeInProducts.load("data/products.js").then(function(){
    treeInProducts.openAll();
});

