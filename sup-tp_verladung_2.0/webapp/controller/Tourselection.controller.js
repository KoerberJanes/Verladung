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
    "sap/ui/core/Item"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, HashChanger, Filter, Sorter, MessageToast, MessageBox, GeoMap, Spot, Spots, VoAbstract, FilterOperator, Item) {
        "use strict";

        return Controller.extend("suptpverladung2.0.controller.Tourselection", {
            onInit: function () {
                //!Models sind alle aufrufbar aus der manifest mit:
                //!"this.getOwnerComponent().getModel("ModelName");"
                //!Inhalte sind alle aufrufbar aus der manifest mit:
                //!"this.getOwnerComponent().getModel("ModelName").getProperty("/propertyName");"
                //Globale Variablen
                this._IvIdEumDev="";  //Für getUrlParameters notwendig
                this._IvIdTr="";
                this._bStopSequenceChangeable=false; //ABAP --> "X" entspricht true und "" enstpricht false
                this._bManuelInput=false; //Globaler eingabemodus
            },

            onAfterRendering:function(){
                this._i18nModel=this.getView().getModel("i18n").getResourceBundle(); //Globales Model für die i18n
                this.getView().byId("selectTourPage").attachBrowserEvent('click', 
                // immer wenn geklickt wird, wird der Focus in das respektive Inputfeld gesetzt
                function (oEvent) {
                    //Fokus Methode für die jeweiligen Felder --> Hier nicht notwendig, da keine Inputfelder existieren
                }.bind(this));

                //!Methode um die Demo-Models zu Setzen! (Später entfernen)
                this.setDemo();

                this.getUrlParameters();
                this.getToursForDriver(); //Erhalten der Touren für den Fahrer (über URL Parameter erkennbar)
            },

            setDemo:function(){ //Demo Infos in die benötigten Models laden --> Später entfernen!
                var TourModel=this.getOwnerComponent().getModel("Tour"); //results
                var StopsModel=this.getOwnerComponent().getModel("Stops"); //results
                var InterdepotNvesModel=this.getOwnerComponent().getModel("InterdepotNves"); //results
                var ClearedNvesModel=this.getOwnerComponent().getModel("ClearedNves"); //results
                var LoadedNvesModel=this.getOwnerComponent().getModel("LoadedNves"); //results
                var AllNvesOfTourModel=this.getOwnerComponent().getModel("AllNvesOfTour"); //results
                var NvePhotoModelModel=this.getOwnerComponent().getModel("NvePhotoModel"); //photo
                var TourParameterModel=this.getOwnerComponent().getModel("TourParameterModel"); //tour
                var CaseEventsModel=this.getOwnerComponent().getModel("CaseEvents"); //results
                var NVEsModel=this.getOwnerComponent().getModel("NVEs"); //results
                var ClosingNvesModel=this.getOwnerComponent().getModel("ClosingNves"); //results
                var alreadyLoadedModel=this.getOwnerComponent().getModel("alreadyLoadedModel"); //info
                var clearingDialogModel=this.getOwnerComponent().getModel("clearingDialogModel"); //info
                var StopInfoModel=this.getOwnerComponent().getModel("StopInfoModel"); //info
                var SelectModel=this.getOwnerComponent().getModel("SelectModel"); //selectOptions

                var aTours=[{
                    Description:"10x0",
                    IdTr:"00000"
                },{
                    Description:"10x1",
                    IdTr:"00001"
                },{
                    Description:"10x2",
                    IdTr:"00002"
                },{
                    Description:"10x3",
                    IdTr:"00003"
                },{
                    Description:"10x4",
                    IdTr:"00004"
                },{
                    Description:"10x5",
                    IdTr:"00005"
                },{
                    Description:"10x6",
                    IdTr:"00006"
                },{
                    Description:"10x7",
                    IdTr:"00007"
                },{
                    Description:"10x8",
                    IdTr:"00008"
                },{
                    Description:"10x9",
                    IdTr:"00009"
                }];
            TourModel.setProperty("/results", aTours);

            var aSelectOptions=[{
                Description:"Defekt",
                ErrorReason:"000"
            },{
                Description:"Falsche Ware",
                ErrorReason:"001"
            },{
                Description:"Teildefekt",
                ErrorReason:"002"
            },{
                Description:"Nicht gefunden",
                ErrorReason:"003"
            }];
            SelectModel.setProperty("/selectOptions", aSelectOptions);


            },

            getUrlParameters:function(){  //gibt die ID des Faherers als String wieder, die gespeichert werden muss um Touren bearbeiten zu können
                var sIdEumDev;
                try {// aus der URL
                    var startupParams = this.getOwnerComponent().getComponentData().startupParameters;
                    sIdEumDev = startupParams.IdEumDev[0]; // ändern 
                } catch (oError) {// aus der Run Configuration
                    sIdEumDev = jQuery.sap.getUriParameters().get("IdEumDev"); // ändern
                }
                //!Nächste Zeile muss entfernt werden
                sIdEumDev="42069_TestNumber"
                //!Die folgende Zeile ist die Original Zeile, diese muss Bestehen
                this._IvIdEumDev = sIdEumDev; // globale Variable mit this._
            },

            /////////////////////////////
            //Backend
            /////////////////////////////

            getToursForDriver:function(){ // Touren des angemeldeten Fahrers werden aus dem Backend geholt
                this.busyDialogOpen();

                var today = new Date();
                var mm = today.getMonth() + 1; //January is 0!
                var sToday = today.getDate() + "." + mm + "." + today.getFullYear();

                var sPathPos = "/GetToursByDriverFlatSet";
                var oFilter1 = new Filter("IvIdEumDev", FilterOperator.EQ, this._IvIdEumDev); 
                var oFilter2 = new Filter("IvProcess", FilterOperator.EQ, "P"); 
                var oFilter3 = new Filter("IvDate", FilterOperator.EQ, sToday);
                var aFilters = [oFilter1, oFilter2, oFilter3];

                /* BackendAufruf auskommentiert da keine Anbindung in privatem VsCode
                this.getView().getModel("TP_VERLADUNG_SRV").read(sPathPos, {
                    filters: aFilters,

                    success: function (oData) {
                        this.busyDialogClose();
                        this.setDriverDescription(oData); //Setzen von Personenbezogenen Daten 
                        var aRecievedTours=oData.getProperty("/results");

                        if(aRecievedTours.length===0){
                            this.noToursError(); //Fahrer hat keine Touren
                        } else{
                            this.handleRecievedTours(aRecievedTours); //Setzen der Touren in Model
                        }

                    }.bind(this),
                    error: function(oError){
                        this.busyDialogClose();
                        //Bisher keine Funktion
                    }.bind(this)
                });
                */
                //!Testfall
                setTimeout(() => { 
                    this.busyDialogClose(); 

                    var oData=new JSONModel();
                    oData.setProperty("/results", [{DrvDesc: "DriverTest", LsDesc:"Licence Plate"}]);
                    this.setDriverDescription(oData);
                    //!Laden der Demo-Touren aus Component.js
                    var aToursFromDemo=this.getOwnerComponent().getModel("Tour").getProperty("/results");
                    this.handleRecievedTours(aToursFromDemo);
                    
                },250);
            },

            onRefreshTours:function(){ //Touren werden vom Backend erneut geholt nachdem der Update Knopf gedrückt wurde
                this.getToursForDriver();
            },
            
            onSendErrorsToBackend:function(){ //Senden der Console für Fehlermeldungen ans Backend (noch nicht abgeschlossen)
                var oErrorTextField=this.getView().byId("sendConsoleLogDialogInput");
                this.sendLog(oErrorTextField);
            },

            sendLog:function(oErrorTextField){ //TODO: Prüfen ob so gewollt
                this.busyDialogOpen();
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
                        //this.busyDialogClose();
                        oErrorTextField.setValue("");
                        this.showSendingSuccessfullMessage();
                        this.onSendErrorsToBackendDialogClose();
                    }.bind(this),
                    error: function (oError) {
                        //this.busyDialogClose();
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

                //!Success-Fall
                setTimeout(() => { 
                    oErrorTextField.setValue("");
                    this.busyDialogClose(); 
                    this.showSendingSuccessfullMessage();
                    this.onSendErrorsToBackendDialogClose();
                },250); //Test zum Anzeigen des Lade-Dialogs mit 250ms
            },

            ///////////////////////////////////////
            //Methoden für die Backend-Daten
            ///////////////////////////////////////

            handleRecievedTours:function(aRecievedTours){ //Verarbeiten der erhaltenen Backend-Daten
               var oTourModel=this.getOwnerComponent().getModel("Tour");
               oTourModel.setProperty("/results", []);//Entfernen alter Inhalte des Models
               oTourModel.setProperty("/results", aRecievedTours);//Schreiben der neuen Inhalte in das Model
               oTourModel.refresh();
               this.setFocusonLatestTour();
           },

            ///////////////////////////////////////
            //get-Methoden
            ///////////////////////////////////////

            getSelectedTour:function(){ //Ermitteln der ausgewählten Tour aus der Liste
                var oList=this.getView().byId("LTourAuswahl");
                var oListItem=oList.getSelectedItem();

                if(oListItem===undefined){ 
                    this.noTourSelectedError(); //Keine Tour wurde Ausgewählt, also Fehler ausgeben
                } else{
                    this.getModelStop(oList, oListItem); //Ermitteln der Tour aus dem Model
                }
            },

            getModelStop:function(oList, oListItem){ //Ermitteln, des ausgewählten Stopps aus dem Model
                var oTourModel=this.getOwnerComponent().getModel("Tour");
                var iIndexSelectedItemInList=oList.getItems().indexOf(oListItem);
                var oModelStop=oTourModel.getProperty("/results")[iIndexSelectedItemInList];
                //Kann kein Fehler enstehen, denn mindestens eine Tour wird von App selbst ausgewählt
                this.setModelStop(oModelStop); //Setzen der Tour in das Model, das auf der nächste Seite referenziert wird 
            },

            ///////////////////////////////////////
            //set-Methoden
            ///////////////////////////////////////

            setFocusonLatestTour:function(){ //Auf der Tourübersicht-Seite den Fokus auf die letzte Tour legen (ganz unten)
                var oList=this.getView().byId("LTourAuswahl");
                var oaTourListItems=oList.getItems();
            
                if(oaTourListItems[0]!==undefined){ //Wenn midnestens ein Eintrag existiert
                    oList.setSelectedItem(oaTourListItems[oaTourListItems.length-1]);
                } else{
                    //Es existiert kein Eintrag --> NOP, da Meldung ohnehin angezeigt wird
                }
            },

            setDriverDescription:function(oData){ //Setzen der Daten der Personenbezogenen Daten
                var oFahrerInput=this.getView().byId("iFahrer");
                var oVehicleInput=this.getView().byId("iLkw");
                var sDrvDesc=oData.getProperty("/results")[0].DrvDesc;
                var sLsDesc=oData.getProperty("/results")[0].LsDesc;

                oFahrerInput.setValue(sDrvDesc); //Name der Person
                oVehicleInput.setValue(sLsDesc); //Kennzeichen des Fahrzeugs

            },

            setModelStop:function(oModelStop){ //Setzen der Tour in das Model, das für die Stopp-Übersicht benötigt wird
                this.getOwnerComponent().getModel("TourParameterModel").setProperty("/tour", oModelStop);
                this._IvIdTr=oModelStop.IdTr;
                this.onNavToStopView(); //Navigieren, nachdem der Vorgang abgeschlossen ist
            },

            ///////////////////////////////////////
            //check-Methoden
            ///////////////////////////////////////

            onCheckIfTourSelected:function(){ //Prüfung ob eine Tour ausgewählt wurde
                var oSelectedItem=this.getView().byId("LTourAuswahl").getSelectedItem();

                if(oSelectedItem!==null){ //Navigation zur anderen Seite
                    this.getSelectedTour();
                } else{ //Dialog mit Fehler, dass Tour ausgewählt sein muss
                    this.noTourSelectedError();
                }
            },

            //////////////////////////////////////
            //Navigation
            //////////////////////////////////////
            
            onNavToStopView: function() { //Navigation zur Stopp-Übersicht
                const oRouter = this.getOwnerComponent().getRouter();
                var sStopSequenceChangeable=this._bStopSequenceChangeable.toString();
                var _IvIdTr=this.getOwnerComponent().getModel("TourParameterModel").getProperty("/tour").IdTr;
                //Navigation zur Stop-Übersicht
                //Parameter sind:
                //1. ob die Stoppreihenfolge änderbar ist
                //2. Welcher Inputmode gerade aktiv ist
                //3. Die Identifikation der Person
                //4. Die Identifikation der Tour 
                oRouter.navTo("RouteStopsOfTour",{
                    sStopSequenceChangeable:sStopSequenceChangeable, 
                    bManuelInput:this._bManuelInput,
                    IvIdEumDev:this._IvIdEumDev,
                    IvIdTr:this._IvIdTr}); 
            },

            //////////////////////////////////////
            //Dialoge
            //////////////////////////////////////

            onSendErrorsToBackendDialogOpen:function(){ //Öffnen eines Dialoges, weite sind analog zu diesem
                //this.playBeepError();
                this.oErrorDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.SendErrorsToBackend"
                });
            
                this.oErrorDialog.then((oDialog) => oDialog.open());
            },

            onSendErrorsToBackendDialogClose:function(){ //Schließen eines Dialoges, weitere sind analog zu diesem
                // note: We don't need to chain to the pDialog promise, since this event handler
                // is only called from within the loaded dialog itself.
                this.byId("sendConsoleLogToBackendDialog").close();
            },

            busyDialogOpen:function(){ //Dialog um den Lade-Prozess zu visualisieren
                this.oBusyDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.BusyDialog"
                });
            
                this.oBusyDialog.then((oDialog) => oDialog.open());
            },

            busyDialogClose:function(){ //Timeout erforderlich, da der Dialog mehr Zeit benötigt um geschlossen zu werden, als der Fokus
                setTimeout(() => { this.byId("BusyDialog").close() },250);
            },

            onBusyDialogClose:function(){ //Manuelles Schließen des lade Dialoges aus dem UI (Für Fehler notwendig in der Entwicklung)
                this.byId("BusyDialog").close();
                
                this.setFocusonLatestTour();
            },

            //////////////////////////////////////
            //Fehlermeldungen
            //////////////////////////////////////

            playBeepError: function () { //Piep
                var base64 =
                    "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AAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksD/gAAAASwAAAAAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uSwP+AAAABLAAAAAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksD/gAAAASwAAAAAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uSwP+AAAABLAAAAAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAP/7ksD/gAAAASwAAAAAAAAlgAAAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAAA="
                var audio = new Audio("data:audio/wav;base64," + base64);
                audio.volume = 0.2;
                audio.play();
            },

            noTourSelectedError:function(){ //Es wurde keine Tour ausgewählt (eigentlich nicht möglich)
                MessageBox.error(this._i18nModel.getText("noTourSelected"), {
                    onClose:function(){
                        //Fokus in die Inputfelder
                    }.bind(this)
                });
            },

            noToursError:function(){ //Es konnten keine Touren geladen werden
                MessageBox.error(this._i18nModel.getText("noToursLoaded"), {
                    onClose:function(){
                        //NOP:
                    }.bind(this)
                });
            },

            noStopsToThisTourError:function(){ //Tour enthält keine Daten
                MessageBox.error(this._i18nModel.getText("noStopsInTour"), {
                    onClose:function(){
                        this.resetStopInputFields();
                    }.bind(this)
                });
            },

            sendingFailedError:function(errorMsg){ //Fehler Log senden schlägt fehl
                MessageBox.error(errorMsg, {
                    onClose:function(){
                        //NOP
                    }.bind(this)
                });
            },

            showSendingSuccessfullMessage:function(){ //Fehler Log erfolgreich gesendet
                MessageToast.show(this._i18nModel.getText("successfullySend"), {
                    duration: 1000,
                    width:"15em",
                    onClose:this.setFocusonLatestTour()
                });
            }
        });
    });
