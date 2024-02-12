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

        return Controller.extend("suptpverladung2.0.controller.ToCustomer", {
            onInit: function () {

            },
            
            onAfterRendering:function(){
                this._i18nModel=this.getView().getModel("i18n").getResourceBundle(); //Globales Model für die i18n
                this.getView().byId("toCustomerPage").attachBrowserEvent('click', // immer wenn geklickt wird, wird der Focus in das respektive Inputfeld gesetzt
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

            setSendConsoleLogFocus:function(){
                //Focus-Methode fehlt
                //this.setFocusonLatestTour();
            },

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

            checkIfCustomerIsSelected:function(){
                var oSelectedItem=this.getView().byId("stopListToCustomer").getSelectedItem();
                if(oSelectedItem!==null){ //Navigation zur anderen Seite
                    this.onNavToStopView();
                } else{ //Dialog mit Fehler, dass Tour ausgewählt sein muss
                    this.noStopSelectedError();
                }
            },

            onOpenNavigationBackDialog: function() {
                //this.playBeepError();
                // create dialog lazily
                this.pDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.NavigationBack"
                });
            
                this.pDialog.then((oDialog) => oDialog.open());
            },

            onCloseNavigationBackDialog:function(){
                // note: We don't need to chain to the pDialog promise, since this event handler
                // is only called from within the loaded dialog itself.
                this.byId("NavigationBackDialog").close();
            },

            noStopSelectedError:function(){ //Kein Stopp selektiert
                MessageBox.error(this._i18nModel.getText("noStopSelected"), {
                    onClose:function(){
                        //this.resetStopInputFields();
                    }.bind(this)
                });
            },

            onNavToStopView: function() {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteNveHandling");
            },
        });
    });