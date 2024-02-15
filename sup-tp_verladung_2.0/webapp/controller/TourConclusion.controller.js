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
    "suptpverladung2/0/util/navigationHandler",
    "suptpverladung2/0/util/sortNveHandler"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, HashChanger, Filter, Sorter, MessageToast, MessageBox, GeoMap, Spot, Spots, VoAbstract, FilterOperator, Item, navigationHandler, sortNveHandler) {
        "use strict";

        return Controller.extend("suptpverladung2.0.controller.TourConclusion", {
            onInit: function () {
                this._IvIdEumDev="";
                this._IvIdTr="";
                this._bStopSequenceChangeable=true;
                this._bManuelInput=false;
                this._navigationHandler=navigationHandler;
                this._sortNveHandler=sortNveHandler;

                this._oRouter = this.getOwnerComponent().getRouter();
			    this._oRouter.getRoute("RouteTourConclusion").attachPatternMatched(this.onObjectMatched, this);
            },

            onAfterRendering:function(){
                this._i18nModel=this.getView().getModel("i18n").getResourceBundle(); //Globales Model für die i18n
                this.getView().byId("tourConclusionPage").attachBrowserEvent('click', // immer wenn geklickt wird, wird der Focus in das respektive Inputfeld gesetzt
                function (oEvent) {
                    //Fokus Methode für die jeweiligen Felder
                    this.setFocusClosingPage();
                }.bind(this));
            },

            onObjectMatched:function(oEvent){ //Seite wird Identifiziert und globale Parameter gesetzt
                var oParameters=oEvent.getParameter("arguments");
                this.setGlobalParameters(oParameters);
            },

            setGlobalParameters:function(oParameters){  
                this._sStopParameterModel=this.getOwnerComponent().getModel("ClosingNves");
                this._IvIdEumDev=oParameters.IvIdEumDev;
                this._IvIdTr=oParameters.IvIdTr;
                
                this._bManuelInput=(/true/).test(oParameters.bManuelInput); //Kommt als String an, obwohl hier ein Boolean erwartet wird
                this._bStopSequenceChangeable=(/true/).test(oParameters.sStopSequenceChangeable);
                //Bevor UI angepasst wird, müssen NVEs aus dem Backend erhalten werden!
                this.getFusClearSet();
            },

            ChangeFromManToScan:function(){

                if(this._bManuelInput){ //Ist der Eingabemodus von Hand?
                    this._bManuelInput=false
                } else{
                    this._bManuelInput=true;
                }

                this.swapInputMode();
            },

            swapInputMode:function(){ //Labels wurden aus Platz-Gründen entfernt --> Der Wechsel zwischen custom Inputfeldern und den Normalen wird vollzogen
                
                if(this._bManuelInput){
                    this.getView().byId("ScanInputClosingNve").setVisible(false);
                    this.getView().byId("ManInputClosingNve").setVisible(true);
                } else{
                    this.getView().byId("ScanInputClosingNve").setVisible(true);
                    this.getView().byId("ManInputClosingNve").setVisible(false);
                }

                this.resetClosingInputFields();
            },


            ///////////////////////////////////////
            //Backend
            ///////////////////////////////////////#

            getFusClearSet: function () {
                this.busyDialogOpen();

                const sPathPos = `/GetFusClearSet(IvIdEumDev='${this._IvIdEumDev}',IdTr='${this._IvIdTr}')`; // Iv zu Id
                
                const sModelPath = "TP_TOURFREIGABE_SRV";
                /*
                this.getView().getModel(sModelPath).read(sPathPos, {
                    urlParameters: {
                        "$expand": "GetFusClearToList/GetFusClearListToMat"
                    },

                    success: function (oData) {
                        this.busyDialogClose();

                        var aResponseNves=oData.getProperty("/results");
                        this._sortNveHandler.setAttributesForLoading(aResponseNves, this._i18nModel);
                        var aSortedResponseNves=this.getOwnerComponent().getModel("sortedNveModel").getProperty("/sortedNves");
                        this._sStopParameterModel.setProperty("/results", aSortedResponseNves);
                    }.bind(this),

                    error: function (oError) {
                        //I.ein Fehler
                    }.bind(this)
                });
                */

                //! Demo für die NVEs, da ohnehin die NVEs gespeichert wurden
                setTimeout(() => { 
                    this.busyDialogClose(); 

                    var oNotDisplayedClearedNvesModel=this.getOwnerComponent().getModel("ClearedNves");
                    var aNotDisplayedClearedNves=oNotDisplayedClearedNvesModel.getProperty("/results");
                    var oDisplayableClearNvesModel=this.getOwnerComponent().getModel("ClosingNves");

                    oDisplayableClearNvesModel.setProperty("/results", aNotDisplayedClearedNves);
                    this.setUserInterfaceMethodes();
                },250);
            },

            onSendErrorsToBackend:function(){ //Senden der Console für Fehlermeldungen ans Backend (noch nicht abgeschlossen)
                var oErrorTextField=this.getView().byId("sendConsoleLogDialogInput");
                this.sendLog(oErrorTextField);
            },

            sendLog:function(oErrorTextField){ //TODO: Prüfen ob Array/Objekte oder Text gesendet werden soll
                //this.busyDialogOpen();
                var oModel = this.getView().getModel("TP_VERLADUNG_SRV");
                var oCreateData = {
                    "IdEumDev": this._IvIdEumDev,
                    "ErrorDesc": oErrorTextField.getValue(), 
                    "ErrorLogList": this.getOwnerComponent().getModel("ErrorLog").getProperty("/errors")
                }

                /*
                oModel.create("/ErrorLogCollection", oCreateData, { // eventuell Url anpassen
                    //Event für erfolgreiches Speichern der Daten
                    success: function (oData) {
                        //schließen des Lade Dialogs
                        oErrorTextField.setValue("");
                        this.showSendingSuccessfullMessage();
                        this.onSendErrorsToBackendDialogClose();
                    }.bind(this),
                    error: function (oError) {
                        //schließen des Lade Dialogs
                        var errorMsg;
                        try {
                            errorMsg = JSON.parse(oError.responseText).error.message.value;
                        } catch (err) {
                            errorMsg = that.getResourceBundle().getText("msgBusinessException");
                        }
                        this.sendingFailedError(errorMsg);
                    }.bind(this)
                });
                */
               //this.busyDialogClose();

                //!Success-Fall
                oErrorTextField.setValue("");
                this.showSendingSuccessfullMessage();
                this.onSendErrorsToBackendDialogClose();
            },

            ///////////////////////////////////////
            //Methoden für die Backend-Daten
            ///////////////////////////////////////

            ///////////////////////////////////////
            //get-Methoden
            ///////////////////////////////////////

            ///////////////////////////////////////
            //set-Methoden
            ///////////////////////////////////////

            setUserInterfaceMethodes:function(){ //UI wird aktualisiert
                var oStop=this._sStopParameterModel.getProperty("/Stop");

                this.swapInputMode(); //Eingabemodus vorheriger Seiten wird übernommen
                //this.setNveStoptitle(oStop); //Titel der Seite wird angepasst
                this.setTitleForClosingPageTree(); //Anzeige der verbleibenden NVEs wird angepasst
                this.setFocusClosingPage(); //Fokus in das Eingabefeld
            },

            setTitleForClosingPageTree:function(){
                var sTreeTitle="";
                var aClearedNves=this.getOwnerComponent().getModel("ClosingNves").getProperty("/results");

                sTreeTitle=this._i18nModel.getText("clearingTextForTree");
                sTreeTitle=sTreeTitle + "(" +aClearedNves.length + ")";

                this.getView().byId("ClosingTreeTitle").setText(sTreeTitle);
            },

            setFocusClosingPage:function(){
                this.getView().byId("ManInputClosingNve").focus() || this.getView().byId("ScanInputClosingNve").focus()
            },

            resetClosingInputFields:function(){
                this.getView().byId("ManInputClosingNve").setValue("");
                this.getView().byId("ScanInputClosingNve").setValue("");
                this.setFocusClosingPage();
            },

            ///////////////////////////////////////
            //Navigation
            ///////////////////////////////////////

            onNavToTourSelection:function(){
                this._oRouter.navTo("RouteTourSelection",{
                });
            },

            ///////////////////////////////////////
            //Dialoge
            ///////////////////////////////////////

            onSendErrorsToBackendDialogOpen:function(){ //Öffnen eines Dialoges, weite sind analog zu diesem
                this.oErrorDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.SendErrorsToBackend"
                });
            
                this.oErrorDialog.then((oDialog) => oDialog.open());
            },

            onSendErrorsToBackendDialogClose:function(){
                this.byId("sendConsoleLogToBackendDialog").close();
                this.setFocusClosingPage();
            },

            busyDialogOpen:function(){
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
                this.setFocusClosingPage();
            },

            ///////////////////////////////////////
            //Fehlermeldungen
            ///////////////////////////////////////

            showSendingSuccessfullMessage:function(){
                MessageToast.show(this._i18nModel.getText("successfullySend"), {
                    duration: 1000,
                    width:"15em",
                    onClose:this.setFocusClosingPage()
                });
            }
        });
    });