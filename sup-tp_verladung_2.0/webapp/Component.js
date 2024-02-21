/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "suptpverladung2/0/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("suptpverladung2.0.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {

            ///////////////////////////////////////////////
            //Helper Models für die Tourauswahl (10 Stück):
            ///////////////////////////////////////////////


            this.setModel(new sap.ui.model.json.JSONModel({
                results:[
                    {
                        Description:"002.Daphnis 10x0",
                        DelvInfo:"",
                        Name1:"Daphnis Beireuther T_10x0",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        CoordX:"8.8054900",
                        CoordY:"53.0794200",
                        Info:"Info Test_7",
                        IdLoc:"00000000",
                        LoadProcessFinished:"false",
                        NoStop:"002",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Janes 10x0",
                        DelvInfo:"",
                        Name1:"Janes Nannt T_10x0",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        CoordX:"420",
                        CoordY:"69",
                        Info:"Info Test_7",
                        IdLoc:"00000001",
                        LoadProcessFinished:"false",
                        NoStop:"003",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Timo 10x0",
                        DelvInfo:"",
                        Name1:"Timo Hotzy T_10x0",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        CoordX:"69",
                        CoordY:"420",
                        Info:"Info Test_7",
                        IdLoc:"00000002",
                        LoadProcessFinished:"false",
                        NoStop:"004",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Simon 10x0",
                        DelvInfo:"",
                        Name1:"Simon Schmid T_10x0",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        CoordX:"8.8054900",
                        CoordY:"53.0794200",
                        Info:"Info Test_7",
                        IdLoc:"00000003",
                        LoadProcessFinished:"false",
                        NoStop:"005",
                        FlgInterdepot: false
                    }
            ]
            }), "10x0");

            this.setModel(new sap.ui.model.json.JSONModel({
                results:[
                    {
                        Description:"002.Daphnis 10x1",
                        DelvInfo:"",
                        Name1:"Daphnis Beireuther T_10x1",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000010",
                        LoadProcessFinished:"false",
                        NoStop:"002",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Janes 10x1",
                        DelvInfo:"",
                        Name1:"Janes Nannt T_10x1",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000011",
                        LoadProcessFinished:"false",
                        NoStop:"003",
                        FlgInterdepot: false
                    }
            ]
            }), "10x1");

            this.setModel(new sap.ui.model.json.JSONModel({
                results:[
                    {
                        Description:"002.Daphnis 10x2",
                        DelvInfo:"",
                        Name1:"Daphnis Beireuther T_10x2",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000020",
                        LoadProcessFinished:"false",
                        NoStop:"002",
                        FlgInterdepot: false,
                        CoordX: "9.6",
                        CoordY: "69"
                    },
                    {
                        Description:"002.Janes 10x2",
                        DelvInfo:"test",
                        Name1:"Janes Nannt T_10x2",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000021",
                        LoadProcessFinished:"true",
                        NoStop:"003",
                        FlgInterdepot: false,
                        CoordX: "6.9",
                        CoordY: "60"
                    },
                    {
                        Description:"002.Timo 10x2",
                        DelvInfo:"",
                        Name1:"Timo Hotzy T_10x2",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000022",
                        LoadProcessFinished:"false",
                        NoStop:"004",
                        FlgInterdepot: false,
                        CoordX: "3",
                        CoordY: "96"
                    },
                    {
                        Description:"002.Simon 10x2",
                        DelvInfo:"",
                        Name1:"Simon Schmid T_10x2",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000023",
                        LoadProcessFinished:"true",
                        NoStop:"005",
                        FlgInterdepot: false,
                        CoordX: "4",
                        CoordY: "69"
                    },
                    {
                        Description:"002.Lisa 10x2",
                        DelvInfo:"",
                        Name1:"Lisa T_10x2",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000020",
                        LoadProcessFinished:"false",
                        NoStop:"002",
                        FlgInterdepot: false,
                        CoordX: "2",
                        CoordY: "52"
                    },
                    {
                        Description:"002.Chloé 10x2",
                        DelvInfo:"",
                        Name1:"Chloé T_10x2",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000020",
                        LoadProcessFinished:"false",
                        NoStop:"002",
                        FlgInterdepot: false,
                        CoordX: "9.3519846",
                        CoordY: "50.1946587",
                        EvChangeable: ""
                    },
                    {
                        Description:"002.Alina 10x2",
                        DelvInfo:"",
                        Name1:"Alina T_10x2",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000020",
                        LoadProcessFinished:"true",
                        NoStop:"002",
                        FlgInterdepot: false,
                        CoordX: "8.3775400",
                        CoordY: "48.9365900",
                        EvChangeable: ""
                    }
            ]
            }), "10x2");

            this.setModel(new sap.ui.model.json.JSONModel({
                results:[
                    {
                        Description:"002.Daphnis 10x3",
                        DelvInfo:"",
                        Name1:"Daphnis Beireuther T_10x3",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000030",
                        LoadProcessFinished:"false",
                        NoStop:"002",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Janes 10x3",
                        DelvInfo:"",
                        Name1:"Janes Nannt T_10x3",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000031",
                        LoadProcessFinished:"false",
                        NoStop:"003",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Timo 10x3",
                        DelvInfo:"",
                        Name1:"Timo Hotzy T_10x3",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000032",
                        LoadProcessFinished:"false",
                        NoStop:"004",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Simon 10x3",
                        DelvInfo:"",
                        Name1:"Simon Schmid T_10x3",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000033",
                        LoadProcessFinished:"false",
                        NoStop:"005",
                        FlgInterdepot: false
                    }
            ]
            }), "10x3");

            this.setModel(new sap.ui.model.json.JSONModel({
                results:[
                    {
                        Description:"002.Daphnis 10x4",
                        DelvInfo:"",
                        Name1:"Daphnis Beireuther T_10x4",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000040",
                        LoadProcessFinished:"false",
                        NoStop:"002",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Janes 10x4",
                        DelvInfo:"",
                        Name1:"Janes Nannt T_10x4",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000041",
                        LoadProcessFinished:"false",
                        NoStop:"003",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Timo 10x4",
                        DelvInfo:"",
                        Name1:"Timo Hotzy T_10x4",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000042",
                        LoadProcessFinished:"false",
                        NoStop:"004",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Simon 10x4",
                        DelvInfo:"",
                        Name1:"Simon Schmid T_10x4",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000043",
                        LoadProcessFinished:"false",
                        NoStop:"005",
                        FlgInterdepot: false
                    }
            ]
            }), "10x4");

            this.setModel(new sap.ui.model.json.JSONModel({
                results:[
                    {
                        Description:"002.Daphnis 10x5",
                        DelvInfo:"",
                        Name1:"Daphnis Beireuther T_10x5",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000050",
                        LoadProcessFinished:"false",
                        NoStop:"002",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Janes 10x5",
                        DelvInfo:"",
                        Name1:"Janes Nannt T_10x5",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000051",
                        LoadProcessFinished:"false",
                        NoStop:"003",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Timo 10x5",
                        DelvInfo:"",
                        Name1:"Timo Hotzy T_10x5",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000052",
                        LoadProcessFinished:"false",
                        NoStop:"004",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Simon 10x5",
                        DelvInfo:"",
                        Name1:"Simon Schmid T_10x5",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000053",
                        LoadProcessFinished:"false",
                        NoStop:"005",
                        FlgInterdepot: false
                    }
            ]
            }), "10x5");

            this.setModel(new sap.ui.model.json.JSONModel({
                results:[
                    {
                        Description:"002.Daphnis 10x6",
                        DelvInfo:"",
                        Name1:"Daphnis Beireuther T_10x6",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000060",
                        LoadProcessFinished:"false",
                        NoStop:"002",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Janes 10x6",
                        DelvInfo:"",
                        Name1:"Janes Nannt T_10x6",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000061",
                        LoadProcessFinished:"false",
                        NoStop:"003",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Timo 10x6",
                        DelvInfo:"",
                        Name1:"Timo Hotzy T_10x6",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000062",
                        LoadProcessFinished:"false",
                        NoStop:"004",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Simon 10x6",
                        DelvInfo:"",
                        Name1:"Simon Schmid T_10x6",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000063",
                        LoadProcessFinished:"false",
                        NoStop:"005",
                        FlgInterdepot: false
                    }
            ]
            }), "10x6");

            this.setModel(new sap.ui.model.json.JSONModel({
                results:[
                    {
                        Description:"002.Daphnis 10x7",
                        DelvInfo:"",
                        Name1:"Daphnis Beireuther T_10x7",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000070",
                        LoadProcessFinished:"false",
                        NoStop:"002",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Janes 10x7",
                        DelvInfo:"",
                        Name1:"Janes Nannt T_10x7",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000071",
                        LoadProcessFinished:"false",
                        NoStop:"003",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Timo 10x7",
                        DelvInfo:"",
                        Name1:"Timo Hotzy T_10x9",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000072",
                        LoadProcessFinished:"false",
                        NoStop:"004",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Simon 10x7",
                        DelvInfo:"",
                        Name1:"Simon Schmid T_10x9",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000073",
                        LoadProcessFinished:"false",
                        NoStop:"005",
                        FlgInterdepot: false
                    }
            ]
            }), "10x7");

            this.setModel(new sap.ui.model.json.JSONModel({
                results:[
                    {
                        Description:"002.Daphnis 10x8",
                        DelvInfo:"",
                        Name1:"Daphnis Beireuther T_10x8",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000080",
                        LoadProcessFinished:"false",
                        NoStop:"002",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Janes 10x8",
                        DelvInfo:"",
                        Name1:"Janes Nannt T_10x8",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000081",
                        LoadProcessFinished:"false",
                        NoStop:"003",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Timo 10x8",
                        DelvInfo:"",
                        Name1:"Timo Hotzy T_10x8",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000082",
                        LoadProcessFinished:"false",
                        NoStop:"004",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Simon 10x8",
                        DelvInfo:"",
                        Name1:"Simon Schmid T_10x8",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000083",
                        LoadProcessFinished:"false",
                        NoStop:"005",
                        FlgInterdepot: false
                    }
            ]
            }), "10x8");

            this.setModel(new sap.ui.model.json.JSONModel({
                results:[
                    {
                        Description:"002.Daphnis 10x9",
                        DelvInfo:"",
                        Name1:"Daphnis Beireuther T_10x9",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000090",
                        LoadProcessFinished:"false",
                        NoStop:"002",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Janes 10x9",
                        DelvInfo:"",
                        Name1:"Janes Nannt T_10x9",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000091",
                        LoadProcessFinished:"false",
                        NoStop:"003",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Timo 10x9",
                        DelvInfo:"",
                        Name1:"Timo Hotzy T_10x9",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        Info:"Info Test_7",
                        IdLoc:"00000092",
                        LoadProcessFinished:"false",
                        NoStop:"004",
                        FlgInterdepot: false
                    },
                    {
                        Description:"002.Simon 10x9",
                        DelvInfo:"",
                        Name1:"Simon Schmid T_10x9",
                        Name2:"",
                        Street:"Straße Test_7",
                        PostCode1:"42069",
                        City_1:"City Test_7",
                        City_2:"",
                        CoordX:"42.069",
                        CoordY:"69.420",
                        Info:"Info Test_7",
                        IdLoc:"00000093",
                        LoadProcessFinished:"false",
                        NoStop:"005",
                        FlgInterdepot: false
                    }
            ]
            }), "10x9");

                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);