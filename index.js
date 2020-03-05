let userCollection = new webix.DataCollection({
    url:"data/users.js",
    scheme:{
        $init:function(user){
            if(user.age < 26){
                user.$css = "user-yellow-background";
            }
        }
    }
});

let categoryCollection = new webix.DataCollection({
    url:"data/categories.js"
});

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

const tableInDashboard = {
    view: "datatable",
    id: "table-films",
    select: true,
    url: "data/data.js",
    gravity: 4,
    scrollX: false,
    hover: "hover-background",
    editable:true,
    columns: [
        {id: "id", autoWidth: true, header:"", css: "row-in-table-background", width:60},
        {id: "title", sort: "string", header: ["Title", {content: "textFilter"}], fillspace: true},
        {id: "cat_id", header: ["Category", {content:"selectFilter"}], editor:"select", options:categoryCollection},
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

const formInDashboard = {
        view: "form",
        id: "form-film",
        width: 400,
        elements: [
            {type: "section", template: "Edit films"},
            {view: "text", label: "Title", name: "title", invalidMessage: "Title must be filled in"},
            {view: "text", label: "Year", name: "year", invalidMessage: "Year should be between 1900 and current"},
            {view: "text", label: "Rating", name: "rating", invalidMessage: "Rating cannot be empty or 0"},
            {view: "text", label: "Votes", name: "votes", invalidMessage: "Votes must be less than 1'000'000 and filled in"},
            {view: "richselect", label: "Category", options: categoryCollection},
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


const listInUsers = {
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
                {view: "buttonWithState", states: {0:"Off",1:"SortAsc",2:"Sort Desc"},  width: 150, state: 0,
                    on: {
                        onStateChange: function (state) {
                            let users = $$("list-users");
                            switch (state) {
                                case 0:
                                    users.sort("#id#", "asc", "int");
                                    break;
                                case 1:
                                    users.sort("#name#", "asc");
                                    break;
                                case 2:
                                    users.sort("#name#", "desc");
                                    break;
                            }
                        }
                    }
                },
                {view: "button", id: "btn-add-user", value: "Add User", css: "webix_primary", width: 150, click:function(){
                        const age = Math.floor(Math.random() * 100) + 1;
                        userCollection.add({name:"User", country:"USA", age: age}, 0);
                    }},
            ]
        },
        {
            view: "editlist",
            editable: true,
            editor: "text",
            editValue: "name",
            id: "list-users",
            select: true,
            template: "#id# | #name# from #country#, #age# <span class='webix_icon wxi-close'></span>",
            onClick: {
                "wxi-close": function (e, id) {
                    userCollection.remove(id);
                    return false;
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

const chartInUsers = {
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

const treeInProducts = {
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

const tableInAdmin = {
    view: "datatable",
    id: "table-categories",
    select: true,
    scrollX: false,
    editable: true,
    columns: [
        {id: "id", autoWidth: true, header:"", css: "row-in-table-background", width:60},
        {id: "value", header:"Value", fillspace: true, editor: "text"},
        {id: "del", header:"", template: "{common.trashIcon()}", width:50}
    ],
    onClick: {
        "wxi-trash": function (e, id) {
            categoryCollection.remove(id);
            return false;
        }
    },
};

const formInAdmin = {
    view: "form",
    id: "form-categories",
    width: 400,
    elements: [
        {type: "section", template: "Add categories"},
        {view: "text", placeholder: "Enter Category", name: "value", invalidMessage: "Category must be filled in"},
        {cols: [
                {view: "button", value: "Add", css: "webix_primary", click:
                        function () {
                            const form = $$("form-categories");
                            if (!form.validate()) {
                                webix.message("Please check fields");
                                return false;
                            } else {
                                categoryCollection.add(form.getValues(), 0)
                                webix.message("Category was added");
                                form.clear();
                            }
                        }
                }
            ]
        }
    ],
    rules: {
        value: webix.rules.isNotEmpty
    }
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
                                    {id: "Admin", title: "Admin"},
                                    {id: "Forms", title: "Forms"}
                                ],
                                ready: function(){
                                    this.select(this.getFirstId());
                                },
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
                            {id: "Dashboard", cols: [{rows: [tabbarForFilteringYear,tableInDashboard]}, formInDashboard]},
                            {id: "Users", rows: [listInUsers,chartInUsers]},
                            {id: "Products", rows:[treeInProducts]},
                            {id: "Admin", cols:[tableInAdmin, {rows:[ formInAdmin, {}]}]},
                            {id: "Forms", rows:[{ view: "formGenerator", fields: ["one", "two"]}, {}]}
                        ],
                        fitBiggest:true
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

const productsTree = $$("tree-products");
productsTree.load("data/products.js").then(function(){
    productsTree.openAll();
});

$$("form-film").bind($$("table-films"));

$$("table-films").registerFilter(
    $$("tabbar"),
    {
        columnId: "year",
        compare: function (year, filter, item) {
            switch (filter) {
                case "allFilms":
                    return true;
                    break;
                case "newFilms":
                    return year >= 2000;
                    break;
                case "modernFilms":
                    return year >= 1980 && year < 2000;
                    break;
                case "oldFilms":
                    return year < 1980;
                    break;
            }
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

$$("list-users").sync(userCollection);
$$("chart-users").sync(userCollection, function(){
    this.group({
        by:"country",
        map:{
            name:["country", "count"]
        }
    });
});

$$("table-categories").sync(categoryCollection);