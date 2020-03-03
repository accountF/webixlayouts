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

const tabbarForFilteringYear = {
    view:"tabbar",
    id:"tabbar",
    options:[
        { value:"All", id:"allFilms"},
        { value:"Old", id:"oldFilms"},
        { value:"Modern", id:"modernFilms"},
        { value: "New", id:"newFilms"}
    ],
    on:{
        onChange:function(){
            $$("table-films").filterByAll();
        }
    }
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
    editable:true,
    columns: [
        {id: "id", autoWidth: true, header:"", css: "row-in-table-background", width:60},
        {id: "title", sort: "string", header: ["Title", {content: "textFilter"}], fillspace: true},
        {id: "cat_id", header: ["Category", {content:"selectFilter"}], editor:"select", options:"data/categories.js"},
        {id: "votes", sort: "int", header: ["Votes", {content: "textFilter"}]},
        {id: "year", sort: "int", header: "Year"},
        {id: "del", header:"", template: "{common.trashIcon()}", width:50}
    ],
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
            obj.cat_id = Math.floor(Math.random() * 4) + 1;
        }
    }
};

const formInMainPart = {
        view: "form",
        id: "form-film",
        elements: [
            {type: "section", template: "Edit films"},
            {view: "text", label: "Title", name: "title", invalidMessage: "Title must be filled in"},
            {view: "text", label: "Year", name: "year", invalidMessage: "Year should be between 1900 and current"},
            {view: "text", label: "Rating", name: "rating", invalidMessage: "Rating cannot be empty or 0"},
            {view: "text", label: "Votes", name: "votes", invalidMessage: "Votes must be less than 1'000'000 and filled in"},
            {
                margin: 50, cols: [
                    {
                        view: "button", value: "Add", css: "webix_primary", click:
                            function () {
                                const form = $$("form-film");
                                    if (!form.validate()) {
                                        webix.message("Please check fields");
                                        return false;
                                    } else {
                                        form.save();
                                        webix.message("Film was added");
                                        form.clear();
                                    }
                            }
                    },
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

webix.protoUI({
    name:"editlist"
}, webix.EditAbility, webix.ui.list);


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
                {view: "button", id: "btn-add-user", value: "Add User", css: "webix_primary", width: 150, click:function(){
                        const age = Math.floor(Math.random() * 100) + 1;
                        $$("list-users").add({name:"User", country:"USA", age: age});
                    }},
            ]
        },
        {
            view: "editlist",
            editable: true,
            editor: "text",
            editValue: "name",
            id: "list-users",
            url:"data/users.js",
            select: true,
            template: "#name# from #country#, #age# <span class='webix_icon wxi-close'></span>",
            onClick: {
                "wxi-close": function (e, id) {
                    this.remove(id);
                    return false;
                }
            },
            scheme: {
                $init: function (user) {
                    if(user.age < 26){
                        user.$css = "user-yellow-background";
                    }
                }
            },
            on: {
                onBeforeEditStop: function (user) {
                    if (user.value === "") {
                        return false;
                    }
                }
            }
        }]
};

const chartInMainPart = {
    view: "chart",
    id: "chart-users",
    value:"#name#",
    type:"bar",
    xAxis:{
        template:"#country#",
        title:"Country"
    },
    yAxis:{},
};

const treeInMainPart = {
    view: "treetable",
    id:"tree-products",
    editable: true,
    columns:[
        { id:"id", header:"", width:50 },
        { id:"title", header:"Title", fillspace: true,
            template:"{common.treetable()} #title#", editor:"text" },
        { id:"price", header:"Price", width:200, editor:"text"}
    ],
    rules:{
        "title": webix.rules.isNotEmpty,
        "price": webix.rules.isNumber
    },
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
                            {id: "Dashboard", cols: [
                                {rows: [tabbarForFilteringYear,tableInMainPart]},
                                    {width: 400, rows:[formInMainPart]}
                                    ]
                            },
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

$$("form-film").bind($$("table-films"));

$$("table-films").registerFilter(
    $$("tabbar"),
    {
        columnId: "year",
        compare: function (year, filter, item) {
            if (filter === "allFilms") return year;
            else if (filter === "newFilms") return year >= 2000;
            else if (filter === "modernFilms") return year >= 1980 && year < 2000;
            else if (filter === "oldFilms") return year < 1980;
        }
    },
    {
        getValue: function (node) {
            return node.getValue();
        },
        setValue: function (node, value) {
            node.setValue(value);
        }
    });

$$("chart-users").sync($$("list-users"), function(){
    this.group({
        by:"country",
        map:{
            name:["country", "count"]
        }
    });
});