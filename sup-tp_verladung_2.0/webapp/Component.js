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

                /////////////////////////////////////////////////////
            //Bereich für den Test und die dazu gehörenden Models
            /////////////////////////////////////////////////////

            /*
            //Model für die Tourauswahl
            this.setModel(new sap.ui.model.json.JSONModel({
                results:[{
                    Description:"10x0",
                    IdTr:"00000"
                },
                {
                    Description:"10x1",
                    IdTr:"00001"
                },
                {
                    Description:"10x2",
                    IdTr:"00002"
                },
                {
                    Description:"10x3",
                    IdTr:"00003"
                },
                {
                    Description:"10x4",
                    IdTr:"00004"
                },
                {
                    Description:"10x5",
                    IdTr:"00005"
                },
                {
                    Description:"10x6",
                    IdTr:"00006"
                },
                {
                    Description:"10x7",
                    IdTr:"00007"
                },
                {
                    Description:"10x8",
                    IdTr:"00008"
                },
                {
                    Description:"10x9",
                    IdTr:"00009"
                }
            ]
            }), "Tour");

            this.setModel(new sap.ui.model.json.JSONModel({//Model für die Stopps
                results:[
                    
            ]
            }), "Stops");
            
            this.setModel(new sap.ui.model.json.JSONModel({//Model für die Interdepot NVEs
                results:[
                    
            ]
            }), "InterdepotNves");

            this.setModel(new sap.ui.model.json.JSONModel({//Model für die Klärgrund NVEs
                results:[
                    
            ]
            }), "ClearedNves");

            this.setModel(new sap.ui.model.json.JSONModel({//Model für die verladenen NVEs
                results:[
                    
            ]
            }), "LoadedNves");

            this.setModel(new sap.ui.model.json.JSONModel({//Model für alle NVEs einer Tour
                results:[
                    
            ]
            }), "AllNvesOfTour");

            this.setModel(new sap.ui.model.json.JSONModel({//Model für die verladenen NVEs
                photo:{
                    
                }
            }), "NvePhotoModel");

            this.setModel(new sap.ui.model.json.JSONModel({//Model für die verladenen NVEs
                tour:{
                    
                }
            }), "TourParameterModel");

            //Model für die points auf der Map
            this.setModel(new sap.ui.model.json.JSONModel({
                results:[
                    
            ]
            }), "CaseEvents");

            //Model für die NVEs
            this.setModel(new sap.ui.model.json.JSONModel({
                results:[{
                    Description:"Ü-NVE_0 | 100000",
                    Exidv:"100000",
                    Children:
                    [
                        {Description:"Child_0_0 | 110000",
                        Exidv:"110000"},
                        {Description:"Child_0_1 | 110001",
                        Exidv:"110001",},
                        {Description:"Child_0_2 | 110002",
                        Exidv:"110002",},
                        {Description:"Child_0_3 | 110003",
                        Exidv:"110003",},
                    ]
                },{
                    Description:"Ü-NVE_1 | 100001",
                    Exidv:"100001",
                    Children:
                    [
                        {Description:"Child_0_0 | 120000",
                        Exidv:"120000"},
                        {Description:"Child_0_1 | 120001",
                        Exidv:"120001",},
                        {Description:"Child_0_2 | 120002",
                        Exidv:"120002",},
                        {Description:"Child_0_3 | 120003",
                        Exidv:"120003",},
                    ]
                },{
                    Description:"Ü-NVE_2 | 100002",
                    Exidv:"100002",
                    Children:
                    [
                        {Description:"Child_0_0 | 130000",
                        Exidv:"130000"},
                        {Description:"Child_0_1 | 130001",
                        Exidv:"130001",},
                        {Description:"Child_0_2 | 130002",
                        Exidv:"130002",},
                        {Description:"Child_0_3 | 130003",
                        Exidv:"130003",},
                    ]
                }
            ]
            }), "NVEs");


            //Model für Abschlussübersicht
            this.setModel(new sap.ui.model.json.JSONModel({
                results:[{
                    Description:"Closing-Ü-NVE_2 | 100002",
                    Exidv:"100002",
                    Children:
                    [
                        {Description:"Closing-Child_0_0 | 130010",
                        Exidv:"130010"},
                        {Description:"Closing-Child_0_1 | 130011",
                        Exidv:"130011",},
                        {Description:"Closing-Child_0_2 | 130012",
                        Exidv:"130012",},
                        {Description:"Closing-Child_0_3 | 130013",
                        Exidv:"130013",},
                    ]
                },
                {
                    Description:"Closing-Ü-NVE_2 | 100002",
                    Exidv:"100002",
                    Children:
                    [
                        {Description:"Closing-Child_0_0 | 130020",
                        Exidv:"130020"},
                        {Description:"Closing-Child_0_1 | 130021",
                        Exidv:"130021",},
                        {Description:"Closing-Child_0_2 | 130022",
                        Exidv:"130022",},
                        {Description:"Closing-Child_0_3 | 130023",
                        Exidv:"130023",},
                    ]
                }
            ]
            }), "ClosingNves");


            //Model weil bereits verladen
            this.setModel(new sap.ui.model.json.JSONModel({
                info:{
                           
                }
            }), "alreadyLoadedModel");


            //Model weil bereits geklärt
            this.setModel(new sap.ui.model.json.JSONModel({
                info:{
                           
                }
            }), "alreadyClearedModel");


            //Model für Klärgrund (bisher nicht benutzt weil ich nicht weiß, wie ich dem Select als quelle der Items, das Model angeben soll)
            //Ich bekomme nur 4 Items im Select ohne Text obwohl beides im gleichen Model ist
            this.setModel(new sap.ui.model.json.JSONModel({
                info:{
                           
                }
            }), "clearingDialogModel");

            //Model für die NVEs
            this.setModel(new sap.ui.model.json.JSONModel({
                results:[{
                    Description:"Ü-I-NVE_0",
                    Children:
                    [
                        {Description:"Child_0_0"},
                        {Description:"Child_0_1"},
                        {Description:"Child_0_2"},
                        {Description:"Child_0_3"},
                    ]
                },{
                    Description:"Ü-I-NVE_1",
                    Children:
                    [
                        {Description:"Child_1_0"},
                        {Description:"Child_1_1"},
                        {Description:"Child_1_2"},
                        {Description:"Child_1_3"},
                    ]
                },{
                    Description:"Ü-I-NVE_2",
                    Children:
                    [
                        {Description:"Child_2_0"},
                        {Description:"Child_2_1"},
                        {Description:"Child_2_2"},
                        {Description:"Child_2_3"},
                    ]
                },
                {
                    Description:"Ü-I-NVE_3",
                    Children:
                    [
                        {Description:"Child_3_0"},
                        {Description:"Child_3_1"},
                        {Description:"Child_3_2"},
                        {Description:"Child_3_3"},
                    ]
                },
                {
                    Description:"Ü-I-NVE_4",
                    Children:
                    [
                        {Description:"Child_4_0"},
                        {Description:"Child_4_1"},
                        {Description:"Child_4_2"},
                        {Description:"Child_4_3"},
                    ]
                }
            ]
            }), "InterdepotNVEs");

            //Model für die Infos eines Stopps
            this.setModel(new sap.ui.model.json.JSONModel({
                info:{
                    Description:"",
                    DelvInfo:"",
                    Name1:"",
                    Name2:"",
                    Street:"Test Straße",
                    PostCode1:"",
                    City_1:"",
                    City_2:"",
                    Info:"",
                    IdLoc:"",
                    LoadProcessFinished:""
                }
            }), "StopInfoModel")

            //Model für die Tourauswahl
            this.setModel(new sap.ui.model.json.JSONModel({
                selectOptions:[{
                    Description:"Defekt",
                    ErrorReason:"000"
                },
                {
                    Description:"Falsche Ware",
                    ErrorReason:"001"
                },
                {
                    Description:"Teildefekt",
                    ErrorReason:"002"
                },
                {
                    Description:"Nicht gefunden",
                    ErrorReason:"003"
                }
                
            ]
            }), "SelectModel");
            */

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