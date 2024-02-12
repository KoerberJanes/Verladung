sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/vbm/GeoMap",
    "sap/ui/vbm/Spot",
    "sap/ui/vbm/Spots",
    "sap/ui/vbm/VoAbstract",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Item",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, HashChanger, Filter, Sorter, MessageToast, MessageBox, GeoMap, Spot, Spots, VoAbstract, FilterOperator, Item) {
        "use strict";

        return Controller.extend("suptpverladung2.0.controller.TourConclusion", {
            onInit: function () {

            },

            onAfterRendering:function(){
                this._i18nModel=this.getView().getModel("i18n").getResourceBundle(); //Globales Model für die i18n
                this.getView().byId("tourConclusionPage").attachBrowserEvent('click', // immer wenn geklickt wird, wird der Focus in das respektive Inputfeld gesetzt
                function (oEvent) {
                    //Fokus Methode für die jeweiligen Felder
                }.bind(this));
            },


            ///////////////////////////////////////
            //Backend
            ///////////////////////////////////////

            ///////////////////////////////////////
            //Methoden für die Backend-Daten
            ///////////////////////////////////////

            ///////////////////////////////////////
            //get-Methoden
            ///////////////////////////////////////

            ///////////////////////////////////////
            //set-Methoden
            ///////////////////////////////////////

            ///////////////////////////////////////
            //Navigation
            ///////////////////////////////////////

            ///////////////////////////////////////
            //Dialoge
            ///////////////////////////////////////

            onBusyDialogOpen:function(){
                this.oBusyDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.BusyDialog"
                });
            
                this.oBusyDialog.then((oDialog) => oDialog.open());
            },

            busyDialogClose:function(){
                setTimeout(() => { this.byId("BusyDialog").close() },250);
            },

            onBusyDialogClose:function(){
                this.byId("BusyDialog").close();
            },

            ///////////////////////////////////////
            //Fehlermeldungen
            ///////////////////////////////////////
        });
    });