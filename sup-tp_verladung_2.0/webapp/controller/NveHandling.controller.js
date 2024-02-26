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
    "suptpverladung2/0/util/scanner",
    "suptpverladung2/0/util/navigationHandler",
    "suptpverladung2/0/util/sortNveHandler"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, HashChanger, Filter, Sorter, MessageToast, MessageBox, GeoMap, Spot, Spots, VoAbstract, FilterOperator, Item, scanner, navigationHandler, sortNveHandler) {
        "use strict";

        return Controller.extend("suptpverladung2.0.controller.NveHandling", {
            onInit: function () {
                this._navigationHandler=navigationHandler;
                this._sortNveHandler=sortNveHandler;

                this._oRouter = this.getOwnerComponent().getRouter();
			    this._oRouter.getRoute("RouteNveHandling").attachPatternMatched(this.onObjectMatched, this);
            },

            onAfterRendering:function(){
                this._i18nModel=this.getView().getModel("i18n").getResourceBundle(); //Globales Model für die i18n
                this.getView().byId("nveHandlingPage").attachBrowserEvent('click', // immer wenn geklickt wird, wird der Focus in das respektive Inputfeld gesetzt
                function (oEvent) {
                    this.setFocusNveHandlingPage();//Fokus Methode für die jeweiligen Felder
                }.bind(this));
            },

            callNavigationHandler:function(oStop){ //
                this.busyDialogOpen();
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var oResponseModel=this.getOwnerComponent().getModel("Response");
                this.setStopParameterModel(oStop);
                this._navigationHandler.getNvesOfStop(oStop, oUserSettingsModel.IvIdEumDev, oUserSettingsModel.IvIdTr, oResponseModel); //Util methode um oData und infos über Stopart zu erhalten
                this.getKindOfStop();
            },

            getKindOfStop:function(){ //Erfahren um welche Stopart es sich handelt und anpassen der Daten
                var oResponseModel=this.getOwnerComponent().getModel("Response");
                var aResponseNves=oResponseModel.getProperty("/results");
                
                if(oResponseModel.isInterdepot==true){ //Interdepot
                    this.setNvesOfStop_InterdepotCase(aResponseNves);
                } else{ //Customer
                    this.setNvesOfStop_CustomerCase(aResponseNves);
                }
                
                this.setUserInterfaceMethodes(); //Aktualisieren des UIs
            },

            setNvesOfStop_InterdepotCase:function(aResponseNves){ //Hier werden alle Methoden für den Fall eines Interdepot Stopps abgehandelt
                var oInterdepotModel=this.getOwnerComponent().getModel("InterdepotNVEs");
                //!Derzeit noch nicht getestet weil der sortNveHandler noch in Arbeit ist
                /*
                this._sortNveHandler.setAttributesForLoading(aResponseNves, this._i18nModel);
                var aSortedResponseNves=this.getOwnerComponent().getModel("sortedNveModel").getProperty("/sortedNves");
                */
                oInterdepotModel.setProperty("/results", aResponseNves); //aSortedResponseNves wird hier später als Parameter erwartet
                oInterdepotModel.refresh();
                this.busyDialogClose();
                this.onNavToInterdepotPage();
            },
    
            setNvesOfStop_CustomerCase:function(aResponseNves){ //Hier werden alle Methoden für den Fall eines Kunden Stopps abgehandelt
                var oNveModel=this.getOwnerComponent().getModel("NVEs");
                //!Derzeit noch nicht getestet weil der sortNveHandler noch in Arbeit ist
                /*
                this._sortNveHandler.setAttributesForLoading(aResponseNves, this._i18nModel);
                var aSortedResponseNves=this.getOwnerComponent().getModel("sortedNveModel").getProperty("/sortedNves");
                */
                oNveModel.setProperty("/results", aResponseNves);
                oNveModel.refresh();
                this.busyDialogClose();
            },

            onObjectMatched:function(oEvent){ //Seite wird Identifiziert und globale Parameter gesetzt
                //Wird komischer Weise 2x ausgeführt
                var oParameters=oEvent.getParameter("arguments");
                this.setGlobalParameters(oParameters);
            },

            setGlobalParameters:function(oParameters){  
                this.checkIfTourIsTheSameAsLast();
                this.setUserInterfaceMethodes();
            },

            setUserInterfaceMethodes:function(){ //UI wird aktualisiert
                var oStop=this.getOwnerComponent().getModel("StopParameterModel").getProperty("/Stop");

                this.swapInputMode(); //Eingabemodus vorheriger Seiten wird übernommen
                this.setNveStoptitle(oStop); //Titel der Seite wird angepasst
                this.setTitleForNveTree(); //Anzeige der verbleibenden NVEs wird angepasst
                this.setFocusNveHandlingPage(); //Fokus in das Eingabefeld
            },

            ChangeFromManToScan:function(){
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");

                if(oUserSettingsModel.bManuelInput){ //Ist der Eingabemodus von Hand?
                    oUserSettingsModel.bManuelInput=false
                } else{
                    oUserSettingsModel.bManuelInput=true;
                }

                this.swapInputMode();
            },

            swapInputMode:function(){ //Labels wurden aus Platz-Gründen entfernt --> Der Wechsel zwischen custom Inputfeldern und den Normalen wird vollzogen
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                
                if(oUserSettingsModel.bManuelInput){
                    this.getView().byId("ScanInputNve").setVisible(false);
                    this.getView().byId("ManInputNve").setVisible(true);
                } else{
                    this.getView().byId("ScanInputNve").setVisible(true);
                    this.getView().byId("ManInputNve").setVisible(false);
                }

                this.resetNveInputFields();
            },

            checkIfTourIsTheSameAsLast:function(){ //Vergleicht zuletzt verarbeitete Tour mit der Derzeitigen
                var oLastTourModel=this.getOwnerComponent().getModel("lastTourModel").getProperty("/tour");
                var oCurrentTourModel=this.getOwnerComponent().getModel("TourParameterModel").getProperty("/tour"); 

                if(oCurrentTourModel.IdTr!==oLastTourModel.IdTr){ //Wenn unterschiedlich (kann ggf. auch um andere Parameter erweitert werden)
                    //Verlagerung in die Methode zum Verladen möglich, aber umständlich.
                    //Bisher nicht gemacht, weil es in der Aktuellen verladung auch so ist.
                    this.setCurrentTourInCompareModel();
                    this.resetTourData();
                }
            },

            resetTourData:function(){ //Entfernt alle bisher gespeicherten Informationen einer Tour
                var oLoadedNveModel=this.getOwnerComponent().getModel("LoadedNves");
                var oInterdepotModel=this.getOwnerComponent().getModel("InterdepotNVEs");
                var oClearedNveModel=this.getOwnerComponent().getModel("ClearedNves");
                var oClosingNveModel=this.getOwnerComponent().getModel("ClosingNves");
                var oAllNvesOfTourModel=this.getOwnerComponent().getModel("AllNvesOfTour");

                oLoadedNveModel.setProperty("/results", []);
                oInterdepotModel.setProperty("/results", []);
                oClearedNveModel.setProperty("/results", []);
                oClosingNveModel.setProperty("/results", []);
                oAllNvesOfTourModel.setProperty("/results", []);
            },

            setCurrentTourInCompareModel:function(){ //Zum Späteren Abgleich wird sich die "abgeschlossene" Tour gemerkt
                var oCompareModel=this.getOwnerComponent().getModel("lastTourModel");
                var oCurrentTourModel=this.getOwnerComponent().getModel("TourParameterModel");

                oCompareModel.setProperty("/tour", oCurrentTourModel.getProperty("/tour"));
            },


            ///////////////////////////////////////
            //Backend
            ///////////////////////////////////////

            onSendErrorsToBackend:function(){ //Senden der Console für Fehlermeldungen ans Backend (noch nicht abgeschlossen)
                var oErrorTextField=this.getView().byId("sendConsoleLogDialogInput");
                this.sendLog(oErrorTextField);
            },

            sendLog:function(oErrorTextField){ //TODO: Prüfen ob Array/Objekte oder Text gesendet werden soll
                //this.busyDialogOpen();
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var oModel = this.getView().getModel("TP_VERLADUNG_SRV");
                var oCreateData = {
                    "IdEumDev": oUserSettingsModel.IvIdEumDev,
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

            FuPackagingSet:function(oFoundNve){
                const sVhilm = "000000009997100"; // also zb Kolli setzen wir fest 
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var oModel = this.getView().getModel("TP_EINPACKENAUSPACKEN_SRV");
    
                if(this._newPackaging){
                    var sExUpper = "";
                }
    
                // erstellen der JSON-Struktur für die Übergabe ans Backend-System
                var oCreateData = {
                    "IdEumDev": oUserSettingsModel.IvIdEumDev,
                    "Vhilm": sVhilm,
                    "ExidvUpper": sExUpper,
                    "ExidvLower": oFoundNve.sExidv,
                    "Process": "E"
                }
                /*
                oModel.create("/NestFusSetSet", oCreateData, {
    
                    success: (oData) => {
    
                        sExUpper=oData.ExExidvUpper;
                        this.updateNves();//Prüfen ob das klappen würde
                        this._newPackaging=false;
                        this.resetNveInputFields();
                    },
    
                    error: (oError) => {
                        var errorMsg;
                        try {
                            errorMsg = JSON.parse(oError.responseText).error.message.value;
                        } catch (err) {
                            errorMsg = this.getResourceBundle().getText("msgBusinessException");
                        }
                        MessageBox.error(this._i18nModel.getText("selectStopToChange"), {
                            onClose:function(){
                                this.resetNveInputFields();
                            }.bind(this)
                        });
                        this.playBeepError();
                    }
                });*/
    
                //!Demo zeigt auch hier nur den Success-Fall
                this._newPackaging=false;
                this.resetNveInputFields();
            },

            FuLoadingSet:function(oNve){ //NVE zum Verladen ans Backend schicken
                //this.onSortStops(this.getOwnerComponent().getModel("Stops").getProperty("/results")); //Entfernen abgearbeiteter Stops --> Prüfen ob nicht schon erledigt
                this.busyDialogOpen();
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                //TODO_5
                /*
                var oModel = this.getView().getModel("TP_VERLADUNG_SRV");
                var oCreateData = this.getView().getModel("StopsExpanded").oData;
                this.byId("UeNveScanKeyboard_4").getValue();
                var oCreateData = {
                    "IvIdEumDev": oUserSettingsModel.IvIdEumDev, // IdEumDev
                    "IvIdTr": oUserSettingsModel.IvIdTr,
                    "IvPickupNumber": 0, // Integer
                    "IvExidv": oNve.Exidv,
                    "IvIdLoc": Idloc
                }

                oModel.create("/FuLoadingSet", oCreateData, { 
                    //Event für erfolgreiches Speichern der Daten
                    success: function (oData) { //Speichern der verladenen NVE
                        this.busyDialogClose();

                        oUserSettingsModel.bStopSequenceChangeable=false; //Kann wahrscheinlich geändert werden

                        if(sIdDisplayedPage==="nveHandlingPage"){
                            this.saveLoadedNve(oNve);
                            this.spliceNveOutOfNveModel(oNve);
                            this.CheckIfModelIsEmpty();
                        }else{
                            this.spliceNveOutOfClearingModel(oNve);
                            this.onSwapFromClearedToLoaded();
                            this.UpdateClearingModel();
                        }
                        this.MessageSuccesfullyLoaded();
                    }.bind(this),
                    error:function(oError){
                        this.busyDialogClose();
                        var sErrorMsg;

                        try {
                            sErrorMsg = JSON.parse(oError.responseText).error.message.value;
                        } catch (err) {
                            sErrorMsg = that.getResourceBundle().getText("msgBusinessException");
                        }

                        this.loadingFailedError(sErrorMsg);

                    }.bind(this)

                });
                */


                //!Für Demozwecke werden Methoden hier für den Success-Fall aufgerufen, der Error-Fall wurde vernachlässigt
                setTimeout(() => { 
                    this.busyDialogClose(); 
                    try {
                        var bAlreadeyClearedDialogIsOpen=this.getView().byId("alreadyClearedDialog").isOpen();
                        if(bAlreadeyClearedDialogIsOpen){
                            this.onAlreadyClearedDialogClose();
                        }
                    } catch (error) {
                        
                    }

                    this.saveLoadedNve(oNve);
                    this.spliceNveOutOfNveModel(oNve);
                    this.checkIfStopOrderCanBeChanged();
                    this.CheckIfModelIsEmpty();
                    //this.MessageSuccesfullyLoaded();
                },250);
            },

            FuClearingSet:function(oNve, sErrorReason, bAlreadeyLoadedDialogIsOpen, bClearingDialogIsOpen){
                //Beide 'isOpen' Parameter werden der vollständigkeit halber mitgegeben --> doppelte sicherheit
                this.busyDialogOpen();
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                /*
                var oModel = this.getView().getModel("TP_VERLADUNG_SRV");
                var oCreateData = this.getView().getModel("StopsExpanded").oData;
                
                var oCreateData = {
                    "IdEumDev": oUserSettingsModel.IvIdEumDev, // IdEumDev
                    "IdTr": oUserSettingsModel.IvIdTr,
                    "IvPickupNumber": 0, // Integer
                    "Exidv": oNve.Exidv,
                    "ErrorReason": sErrorReason, //Muss ich schauen, ob hier String oder Objekt verlangt wird (Ausgangssituation --> String)
                    "Process": "L"
                }

                oModel.create("/FuClearingSet", oCreateData, { 
                    //Event für erfolgreiches Speichern der Daten
                    success: function (oData) { //Speichern der verladenen NVE
                        this.busyDialogClose();

                        
                    }.bind(this),
                    error:function(oError){
                        this.busyDialogClose();
                        var sErrorMsg;

                        try {
                            sErrorMsg = JSON.parse(oError.responseText).error.message.value;
                        } catch (err) {
                            sErrorMsg = that.getResourceBundle().getText("msgBusinessException");
                        }

                        this.loadingFailedError(sErrorMsg);

                    }.bind(this)
                })

                */
               //!Für Demozwecke werden Methoden hier für den Success-Fall aufgerufen, der Error-Fall wurde vernachlässigt
               setTimeout(() => { 
                    this.busyDialogClose(); 
                    //Prüfen welcher Dialog offen war
                    if(bAlreadeyLoadedDialogIsOpen==true && bClearingDialogIsOpen==false){
                        this.onAlreadyLoadedDialogClose();
                    }
                    if(bAlreadeyLoadedDialogIsOpen==false && bClearingDialogIsOpen==true){
                        this.onClearingDialogClose();
                    }

                    this.saveClearedNve(oNve);
                    this.spliceNveOutOfNveModel(oNve);
                    this.CheckIfModelIsEmpty();
                },250);
            },

            sendNewStopOrderToBackend:function(){ //Versenden der neuen Stoppreihenfolge an das Backend
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                /*
                var oCreateData = {
                    "IvIdEumDev": oUserSettingsModel.IvIdEumDev, // IdEumDev
                    "IvIdTr": oUserSettingsModel.IvIdTr,
                    "UpdateStopSequenceToStopList": {
                        "results": aStops
                    }
                }

                // Aufruf der Create Methode am Model, mit Url und JSON Daten
                oModel.create("/UpdateStopSequenceSet", oCreateData, { // eventuell Url anpassen
                    //Event für erfolgreiches Speichern der Daten
                    success: function (oData) {
                        //Eventuell ist hier ein delay von Nöten
                        this.setFocusNveHandlingPage();
                    },
                    error: function (oError) {
                        //schließen des Lade Dialogs
                        var errorMsg;
                        try {
                            errorMsg = JSON.parse(oError.responseText).error.message.value;
                        } catch (err) {
                            errorMsg = that.getResourceBundle().getText("msgBusinessException");
                        }
                        this.updateNotPossibleError(errorMsg);
                    }
                });
                */
            },

            getAlreadyClearedSelectOptions:function(){
                this.busyDialogOpen();
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var sPathPos="/GetClearReasonSet";
                var oFilter1=new Filter("IvIdEumDev", FilterOperator.EQ, oUserSettingsModel.IvIdEumDev);
                var oFilter2=new Filter("IvPodMode", FilterOperator.EQ, "true");
                var aFilters=[oFilter1, oFilter2];
                /*
                this.getView().getModel("TP_VERLADUNG_SRV").read(sPathPos, {
                    filters: aFilters,

                    success:function(oData){
                        this.busyDialogClose();
                        var aRecievedErrorReasons=oData.getProperty("/results");

                        if(aRecievedErrorReasons.length===0){
                            //Fehler
                        } else{
                            this.handleRecievedErrorReasons(aRecievedErrorReasons);
                        }
                    }.bind(this),

                    error:function(oError){
                        this.busyDialogClose();
                        var sErrorMsg="";
                        try{
                            sErrorMsg=JSON.parse(oError.responseText).error.message.value;
                        }catch{
                            sErrorMsg=this.getResourceBundle().getText("msgBusinessException");
                        }  
                    }.bind(this)
                })*/

                //!Testfall
                var booleanTest=false;
                var aRecievedErrorReasons=[
                    {Description: "Defekt", ErrorReason:"000", Flgload:"true"},
                    {Description: "Falsche Ware", ErrorReason:"001", Flgload:"true"},
                    {Description: "Teilweise Defekt (VL)", ErrorReason:"002", Flgload:"true"}
                ];
                if(booleanTest){
                    console.log("TestFailed");
                } else{
                    this.handleAlreadyLoadedErrorReasons(aRecievedErrorReasons);
                }
                this.onAlreadyLoadedDialogOpen();
            },

            getClearSelectOptions:function(){
                this.busyDialogOpen();
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var sPathPos="/GetClearReasonSet";
                var oFilter1=new Filter("IvIdEumDev", FilterOperator.EQ, oUserSettingsModel.IvIdEumDev);
                var oFilter2=new Filter("IvPodMode", FilterOperator.EQ, "true");
                var aFilters=[oFilter1, oFilter2];
                /*
                this.getView().getModel("TP_VERLADUNG_SRV").read(sPathPos, {
                    filters: aFilters,

                    success:function(oData){
                        this.busyDialogClose();
                        var aRecievedErrorReasons=oData.getProperty("/results");

                        if(aRecievedErrorReasons.length===0){
                            //Fehler
                        } else{
                            this.handleRecievedErrorReasons(aRecievedErrorReasons);
                        }
                    }.bind(this),

                    error:function(oError){
                        this.busyDialogClose();
                        var sErrorMsg="";
                        try{
                            sErrorMsg=JSON.parse(oError.responseText).error.message.value;
                        }catch{
                            sErrorMsg=this.getResourceBundle().getText("msgBusinessException");
                        }  
                    }.bind(this)
                })*/

                //!Testfall
                var booleanTest=false;
                var aRecievedErrorReasons=[
                    {Description: "Defekt", ErrorReason:"000", Flgload:"true"},
                    {Description: "Falsche Ware", ErrorReason:"001", Flgload:"true"},
                    {Description: "Teilweise Defekt (VL)", ErrorReason:"002", Flgload:"true"}
                ];
                if(booleanTest){
                    console.log("TestFailed");
                } else{
                    this.handleRecievedErrorReasons(aRecievedErrorReasons);
                }
                this.onOpenClearingReasonDialog();
            },

            ///////////////////////////////////////
            //Methoden für die Backend-Daten
            ///////////////////////////////////////

            handleAlreadyLoadedErrorReasons:function(aRecievedErrorReasons){
                var oSelectModel=this.getOwnerComponent().getModel("SelectModel");
                var aErrorOptions=[];

                var oItemTemplate = new Item({ //nicht sicher ob ich das wirklich brauche
                    Description: "{text}",
                    ErrorReason: "{ErrorReason}"
                });

                for(var i in aRecievedErrorReasons){ //Für jede Option wird ein Element erstellt
                    var oItem= {
                        Description: aRecievedErrorReasons[i].Description,
                        ErrorReason: aRecievedErrorReasons[i].ErrorReason
                    };
                    
                    if(aRecievedErrorReasons[i].Flgload){ //Wenn laden --> hinzufügen zum Array an Optionen
                        aErrorOptions.push(oItem);
                    }
                }

                oSelectModel.setProperty("/selectOptions", []);
                oSelectModel.setProperty("/selectOptions", aErrorOptions);
                this.busyDialogClose();
            },

            handleRecievedErrorReasons:function(aRecievedErrorReasons){
                var oSelectModel=this.getOwnerComponent().getModel("SelectModel");
                var aErrorOptions=[];

                var oItemTemplate = new Item({ //nicht sicher ob ich das wirklich brauche
                    Description: "{text}",
                    ErrorReason: "{ErrorReason}"
                });

                for(var i in aRecievedErrorReasons){ //Für jede Option wird ein Element erstellt
                    var oItem= {
                        Description: aRecievedErrorReasons[i].Description,
                        ErrorReason: aRecievedErrorReasons[i].ErrorReason
                    };
                    
                    if(aRecievedErrorReasons[i].Flgload){ //Wenn laden --> hinzufügen zum Array an Optionen
                        aErrorOptions.push(oItem);
                    }
                }

                oSelectModel.setProperty("/selectOptions", []);
                oSelectModel.setProperty("/selectOptions", aErrorOptions);
                this.busyDialogClose();
            },

            ///////////////////////////////////////
            //Methoden für das Model
            ///////////////////////////////////////

            onNveWasLoaded:function(){
                var oLoadedNve=this.getOwnerComponent().getModel("alreadyLoadedModel").getProperty("/info");
                var sErrorReason=this.getView().byId("DialogAlreadyLoadedSelect").getSelectedItem().getText();
                this.setClearingReasonForNve(oLoadedNve, sErrorReason);
            },

            onNveWasCleared:function(){ //NVE befand sich in Klärung und wird jetzt verladen
                var oClearedNve=this.getOwnerComponent().getModel("alreadyClearedModel").getProperty("/info");
                this.FuLoadingSet(oClearedNve);
            },

            setClearingReasonForNve:function(oSelectedNve, sErrorReason){
                var bAlreadeyLoadedDialogIsOpen=this.getView().byId("alreadyLoadedDialog").isOpen();
                var bClearingDialogIsOpen=false;
                if(oSelectedNve.ClearingReason===undefined){ //Wenn das Attribut nicht existiert --> erstellen
                    oSelectedNve.ClearingReason="";
                }
                
                oSelectedNve.ClearingReason=sErrorReason; //Attribut mit Wert füllen
                //this.onSwapFromLoadedToCleared();
                this.FuClearingSet(oSelectedNve, sErrorReason, bAlreadeyLoadedDialogIsOpen, bClearingDialogIsOpen);
            },

            shortenInput:function(sInput){ //Wert der Inputfelder kürzen, damit auch mit kurzen Werten gesucht werden kann
                var sShortenedInput;
                if(sInput.length>5){
                    sInput = sInput.replace(/^0+/, '');
                    sShortenedInput=sInput.substring(sInput.length-5);
                } else{
                    sShortenedInput=sInput;
                }

                this.searchUeberNves(sInput, sShortenedInput);
            },

            onSortStops:function(aRecievedStops){ //Entfernen der Stopps, bei denen das Verladen abgeschlossen wurde
                //Normale schleife notwendig weil das Splicen eines Stopps forne dazu führt,
                //dass ggf. einer der Stopps nicht geprüft wird weil der Index springt
                for(var i =aRecievedStops.length-1; i>=0; i--){
                    if(aRecievedStops[i].LoadProcessFinished==="true"){
                        aRecievedStops.splice(parseInt(i), 1);
                    }
                }
            },

            saveLoadedNve:function(oNve){ //Speichern einer Verladenen NVE in "_aLoadedNvesOfTour", wenn sie darin noch nicht existiert

                var _aLoadedNvesOfTour=this.getOwnerComponent().getModel("LoadedNves").getProperty("/results");
                if(_aLoadedNvesOfTour.indexOf(oNve)===-1){
                    _aLoadedNvesOfTour.push(oNve);
                    this.spliceClearedArray(oNve);
                    this.saveInAllNveArray(oNve);
                } else{
                    this.onSwapFromClearedToLoaded();
                }
            },

            saveClearedNve:function(oNve){ //Speichern einer Verladenen NVE in "_aLoadedNvesOfTour", wenn sie darin noch nicht existiert

                var _aClearedNvesOfTour=this.getOwnerComponent().getModel("ClearedNves").getProperty("/results");
                if(_aClearedNvesOfTour.indexOf(oNve)===-1){
                    _aClearedNvesOfTour.push(oNve);
                    this.spliceLoadedArray(oNve);
                    this.saveInAllNveArray(oNve);
                } else{
                    this.onSwapFromLoadedToCleared();
                }
            },

            onSwapFromClearedToLoaded:function(){ //Wechseln des Status einer NVE von geklärt zu verladen
                var oClearedNve=this.getOwnerComponent().getModel("alreadyClearedModel").getProperty("/info"); //Holen der NVE aus dem Model
                var aClearedNvesOfTour=this.getOwnerComponent().getModel("ClearedNves").getProperty("/results");
                var aLoadedNvesOfTour=this.getOwnerComponent().getModel("LoadedNves").getProperty("/results");
                aClearedNvesOfTour.splice(aClearedNvesOfTour.indexOf(oClearedNve), 1); //Entfernen der NVE aus den geklärten NVEs
                aLoadedNvesOfTour.push(oClearedNve); //Speichern der NVE in den verladenen NVEs
            },

            onSwapFromLoadedToCleared:function(){ //Wechseln des Status einer NVE von geklärt zu verladen
                var oClearedNve=this.getOwnerComponent().getModel("alreadyLoadedModel").getProperty("/info"); //Holen der NVE aus dem Model
                var aClearedNvesOfTour=this.getOwnerComponent().getModel("ClearedNves").getProperty("/results");
                var aLoadedNvesOfTour=this.getOwnerComponent().getModel("LoadedNves").getProperty("/results");
                aLoadedNvesOfTour.splice(aClearedNvesOfTour.indexOf(oClearedNve), 1); //Entfernen der NVE aus den verladenen NVEs
                aClearedNvesOfTour.push(oClearedNve); //Speichern der NVE in den geklärten NVEs
            },

            spliceClearedArray:function(oNve){ //Nachdem NVE verladen wurde, muss sie aus den Klärungen entfernt werden
                var _aClearedNvesOfTour=this.getOwnerComponent().getModel("ClearedNves").getProperty("/results");
                var iIndex=_aClearedNvesOfTour.indexOf(oNve);
                if(iIndex!==-1){
                    _aClearedNvesOfTour.splice(iIndex, 1);
                }
            },

            spliceLoadedArray:function(oNve){ //Nachdem NVE verladen wurde, muss sie aus den Klärungen entfernt werden
                var _aLoadedNvesOfTour=this.getOwnerComponent().getModel("LoadedNves").getProperty("/results");
                var iIndex=_aLoadedNvesOfTour.indexOf(oNve);
                if(iIndex!==-1){
                    _aLoadedNvesOfTour.splice(iIndex, 1);
                }
            },

            saveInAllNveArray:function(oNve){ //Speichern einer NVE, sofern sie behandelt wurde und noch nicht vermerkt ist
                var _aAllNvesOfTour=this.getOwnerComponent().getModel("AllNvesOfTour").getProperty("/results");
                if(_aAllNvesOfTour.indexOf(oNve)===-1){
                    _aAllNvesOfTour.push(oNve);
                }
            },

            spliceNveOutOfNveModel:function(oNve){ //Entfernen einer NVE aus dem NVE-Tree eines Stopps
                var oModel=this.getOwnerComponent().getModel("NVEs");
                var aNves=oModel.getProperty("/results");
                var iIndexOfNve=aNves.indexOf(oNve);

                if(iIndexOfNve!==-1){
                    aNves.splice(aNves.indexOf(oNve), 1);
                }
                oModel.refresh();
                //UI Methoden 
                this.resetNveInputFields(); //Eingabefeld leeren und Fokus setzen
                this.setTitleForNveTree(); //Hier evtl. nicht von Nöten, macht es nur hübscher
            },

            spliceStop:function(){ //Entfernen des abgearbeiteten Stopps aus dem Model/ der Liste
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");
                var sCurrentStop=this.getView().byId("NveHandlingPageTitle").getText();
                var iIndexCurrentStop;

                for(var i in aStops){
                    var sDescription=aStops[i].Description; //Speichern des Stopp-Namens aus dem Model
                    var sCompareDescription=sDescription.substring(1, sDescription.length); //Entfernen des "*/_"
                    if(sCompareDescription.includes(sCurrentStop)){
                        iIndexCurrentStop=parseInt(i); //Stelle zum Splicen Merken
                    }
                }
                aStops.splice(iIndexCurrentStop, 1); 
                //this.getOwnerComponent().getModel("Stops").refresh(); //Eventuell unnötig
                this.checkIfNextStopAvailable(); //Prüfen ob der nächste Stopp verfügbar ist
            },

            UpdateStopSequence:function(){ 
                this.cutStopDescription();
            },

            cutStopDescription:function(){ //Weil die Stoppreihenfolge immer in der Description angepasst wurde
                //kann dort die aktuelle Reihenfolge ausgelesen werden
                var aStops=this.getView().getModel("Stops").getProperty("/results");

                for(var i in aStops){ //Abschneiden der Description weil diese im Backend maximal 60 Zeichen umfassen darf
                    var sPreviousDescription=aStops[i].Description;
                    if(sPreviousDescription.length>60){
                        aStops[i].Description=sPreviousDescription.substring(60); //Es reicht, wenn man das Ende des String angibt
                    }
                }

                this.setNewValueForNoStop(aStops);
            },

            setNewValueForNoStop:function(aStops){ //?Soll es sich hier um 10 Zeichen handeln?
                for (var i in aStops) {
                    var iIndexOfDot=aStops[i].Description.indexOf(".");
                    aStops[i].NoStop="0000000" + aStops[i].Description.substring(1,iIndexOfDot);
                }
                this.sendNewStopOrderToBackend();
            },

            ///////////////////////////////////////
            //Navigation
            ///////////////////////////////////////

            onNavigateToOtherCustomer:function(){
                this._oRouter.navTo("RouteToCustomer");
            },

            ///////////////////////////////////////
            //Dialoge
            ///////////////////////////////////////

            onToCustomerPhotoDialogOpen:function(){ //Starten des Streams und öffnen des Dialoges

                this.customerPhotoDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.Photo"
                });
            
                this.customerPhotoDialog.then((oDialog) => oDialog.open());
                /*
                this.setMediaStream();
                this.getView().byId("toCustomerPhotoDialog").setVisible(true);
                this.getView().byId("toCustomerPhotoDialog").open();
                */
            },

            onFocusBackAbort:function(){
                this.setFocusNveHandlingPage();
            },

            ///////////////////////////////////////
            //get-Methoden
            ///////////////////////////////////////

            getInputValue: function (customInputId, normalInputId) {
                return this.getView().byId(customInputId).getValue() || this.getView().byId(normalInputId).getValue();
            },

            getNveFromGlobalArray:function(sInput, sShortInput){ //Jede Nve die jemals in dieser Tour verarbeitet wurde, wird durchsucht
                var oFoundNve;
                var sStop=this.getView().byId("NveHandlingPageTitle").getText();
                var aAllNvesOfTour=this.getOwnerComponent().getModel("AllNvesOfTour").getProperty("/results");

                for(var i in aAllNvesOfTour){
                    if(aAllNvesOfTour[i].Exidv===sInput || 
                        aAllNvesOfTour[i].Exidv.substring(aAllNvesOfTour[i].Exidv.length-5)===sShortInput){
                            oFoundNve=aAllNvesOfTour[i];
                    }
                }
                
                if(oFoundNve){ //Wenn Nve bearbeitet wurde
                    this.CheckIfAlreadyLoaded(oFoundNve); //Siehe nach ob sie Verladen ist
                } else{
                    this.unableToLoadCuzNotFoundError(sInput, sStop); //Sie gehört nicht zur Tour
                }
            },

            getSwitchState:function(){
                var bSwitchStateEinpacken = this.byId("switchEinpackenOderVerladen").getState();
                return bSwitchStateEinpacken;
            },

            
            getNextStopInLine:function(){ //Erhalten des nächsten Stops, abhängig von der derzeitigen Location
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");
                var sCurrentStopTitle=this.getView().byId("NveHandlingPageTitle").getText();
                var sCurrentStopNumber=sCurrentStopTitle.substring(0, 3);
                var iNextStopIndex=undefined;

                for( var i in aStops){ //Nächst geringere Stoppnummer holen --> Muss dafür auch angezeigt werden
                    var sCompareableStopDescription=aStops[i].Description;
                    var sCompareableStopNumber=sCompareableStopDescription.substring(1, 4);
                    if(parseInt(sCompareableStopNumber) < parseInt(sCurrentStopNumber)){
                        iNextStopIndex=i;
                    }
                }

                if(iNextStopIndex===undefined){ //Es existiert keine geringere Stoppnummer, also wird der letzte Stopp aus der Liste genommen 
                    this.getLastStopOfList();
                } else{
                    this.callNavigationHandler(aStops[iNextStopIndex]);
                }
            },
            
            getLastStopOfList:function(){ //Der Letzte Stopp in der Liste wird
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");
                var aFilteredStops=this.filterFinishedStops(aStops);
                var oLastStopOfList=aFilteredStops[aFilteredStops.length-1];
                //this.setStopParameterModel(oLastStopOfList);
                this.callNavigationHandler(oLastStopOfList);
            },
            

            getSelectedNveForPhotoModel:function(oSelectedItem){
                var oTreeOfNves=this.getView().byId("TreeOfNves");
                var iIndexSelectedNve=oTreeOfNves.getItems().indexOf(oSelectedItem);
                var oNveModel=this.getOwnerComponent().getModel("NVEs");
                var oNve=oNveModel.getProperty("/results")[iIndexSelectedNve];
                this.setPhotoInputValue(oNve);
            },

            ///////////////////////////////////////
            //set-Methoden
            ///////////////////////////////////////

            setStopParameterModel:function(oStop){ //Setzen des Models für die nächste Seite & Navigation
                this.getOwnerComponent().getModel("StopParameterModel").setProperty("/Stop", oStop);
            },

            resetNveInputFields:function(){ //Leeren der Inputfelder für die NVEs + Focus setzen
                this.getView().byId("ManInputNve").setValue("");
                this.getView().byId("ScanInputNve").setValue("");
                this.setFocusNveHandlingPage();
            },

            setFocusNveHandlingPage:function(){ //Focus für die Inputfelder der NVE eines Stopps mit Verzögerung da es manchmal Probleme gab
                setTimeout(() => { this.getView().byId("ManInputNve").focus() || this.getView().byId("ScanInputNve").focus() },25);
            },

            setAlreadyLoadedDialogModel:function(oFoundNve){ //Für den BereitsVerladen Dialog wird das Model zum Anzeigen gesetzt und geöffnet
                this.getOwnerComponent().getModel("alreadyLoadedModel").setProperty("/info", oFoundNve);
                this.getAlreadyClearedSelectOptions();
            },

            setAlreadyClearedDialogModel:function(oFoundNve){
                this.getOwnerComponent().getModel("alreadyClearedModel").setProperty("/info", oFoundNve);
                this.onAlreadyClearedDialogOpen();
            },

            resetNveInputFields:function(){ //Leeren der Inputfelder für die NVEs + Focus setzen
                this.getView().byId("ManInputNve").setValue("");
                this.getView().byId("ScanInputNve").setValue("");
                this.setFocusNveHandlingPage();
            },

            setTitleForNveTree:function(){ //Titel des NVE-Trees wird gesetzt. Erwartung: "NVEs: ('Anzahl')"
                var aTreeNves=this.getOwnerComponent().getModel("NVEs").getProperty("/results");
                this.getView().byId("titleTreeOfNVEs").setText(this._i18nModel.getText("NveTreeStandardText")+ " " + "("+ aTreeNves.length +")");
            },

            resetNveInputFields:function(){ //Leeren der Inputfelder für die NVEs + Focus setzen
                this.getView().byId("ManInputNve").setValue("");
                this.getView().byId("ScanInputNve").setValue("");
                this.setFocusNveHandlingPage();
            },

            setPhotoInputValue:function(oNve){ //Setzen des Namens der NVE in das Inputfeld der Anzeige (Kann auch als einzeiler gemacht werden)
                //var oPhotoModel=this.getView().getModel("NvePhotoModel");
                var oPhotoModel=this.getOwnerComponent().getModel("NvePhotoModel");
                oPhotoModel.setProperty("/photo", oNve);
            },

            setNveStoptitle:function(oStop){ //Titel der NVE-Seite setzen indem der Kundenname und die Stoppnummer angezeigt werden.
                this.getView().byId("NveHandlingPageTitle").setText(oStop.Description.substring(1, oStop.Description.length));
            },

            setSendConsoleLogFocus:function(){
                this.setFocusNveHandlingPage();
            },

            ///////////////////////////////////////
            //check-/finder-Methoden
            ///////////////////////////////////////

            checkIfStopOrderCanBeChanged:function(){
                var oLoadedNvesModel=this.getOwnerComponent().getModel("LoadedNves");
                var aLoadedNves=oLoadedNvesModel.getProperty("/results");
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                if(aLoadedNves.length>0){
                    oUserSettingsModel.bStopSequenceChangeable=false;
                } else{
                    oUserSettingsModel.bStopSequenceChangeable=true;
                }
            },

            onGetEnteredNve:function(oEvent){ //Inputfelder auslesen und prüfen ob die mindestlänge erreicht wurde
                var sInput= this.getInputValue("ManInputNve", "ScanInputNve");
                
                if(sInput.length>4){
                    this.shortenInput(sInput);
                } else{
                    this.inputShortError(sInput);
                }
            },

            onCheckIfNveIsSelected:function(){
                var oSelectedItem=this.getView().byId("TreeOfNves").getSelectedItem();
                if(oSelectedItem!==null){ //Navigation zur anderen Seite
                    this.setNveForClearingDialog(oSelectedItem);
                } else{ //Dialog mit Fehler, dass Tour ausgewählt sein muss
                    this.noItemSelectedClearingError();
                }
            },

            getNveAboutToClear:function(){
                var bClearingDialogIsOpen=false;
                var bAlreadeyLoadedDialogIsOpen=false;
                try {
                    bAlreadeyLoadedDialogIsOpen=this.getView().byId("alreadyLoadedDialog").isOpen();
                } catch (error) { //! GGf. Abgleichen mit den Dialogen, die offen sein können
                    this.onClearingDialogClose();
                    //NOP --> da mit false Initialisiert
                }
                var oClearingDialogModel=this.getOwnerComponent().getModel("clearingDialogModel");
                var oNveAboutToBeCleared=oClearingDialogModel.getProperty("/info"); //NVE die derzeit angezeigt wird
                var sErrorReasonKey=this.getView().byId("DialogClearingSelect").getSelectedKey();
                //KLär-Methonde aufrufen!
                this.FuClearingSet(oNveAboutToBeCleared, sErrorReasonKey, bAlreadeyLoadedDialogIsOpen, bClearingDialogIsOpen);
            },

            setNveForClearingDialog:function(oSelectedItem){
                var oModel=this.getOwnerComponent().getModel("NVEs");
                var oTree=this.getView().byId("TreeOfNves");
                var iIndexSelectedNve=oTree.getItems().indexOf(oSelectedItem);
                var oSelectedNveInModel=oModel.getProperty("/results")[iIndexSelectedNve];
                var oClearingDialogModel=this.getOwnerComponent().getModel("clearingDialogModel");

                oClearingDialogModel.setProperty("/info", []);
                oClearingDialogModel.setProperty("/info", oSelectedNveInModel);
                this.getClearSelectOptions();
            },

            searchUeberNves:function(sInput, sShortInput){ //In den Ü-NVEs wird gesucht ob eine NVE existiert, deren Exidv mit dem Input übereinstimmt
                var oFoundNve;
                var aTreeNves=this.getOwnerComponent().getModel("NVEs").getProperty("/results");
                for(var i in aTreeNves){
                    if(aTreeNves[i].Exidv===sInput || aTreeNves[i].Exidv.substring(aTreeNves[i].Exidv.length-5)===sShortInput){
                        oFoundNve=aTreeNves[i];
                    }
                }

                if(oFoundNve){ //Wenn objekt gefunden wurde
                    this.checkSwitchStatus(oFoundNve);
                } else{
                    this.searchUnterNves(sInput, sShortInput); //Wenn Objekt nicht gefunden wurde
                }
            },

            checkSwitchStatus:function(oFoundNve){
                if (this.getSwitchState()) { //wenn Switch auf Einpacken 
                    this.FuPackagingSet(oFoundNve);
                } else { //wenn Switch auf Verladung 
                    this.FuLoadingSet(oFoundNve);
                }
            },

            searchUnterNves:function(sInput, sShortInput){
                var oFoundNve;
                var aNves=this.getOwnerComponent().getModel("NVEs").getProperty("/results");
                var aUnterNves=[];
                
                for(var i in aNves){ //erstellen des Arrays für UnterNves:
                    if(aNves[i].children){
                        for(var j in aNves[i].children){
                            aUnterNves.push(aNves[i].children[j]);
                        }
                    }
                }

                for(var k in aUnterNves){ //Herausfinden ob Nve eine U-Nve ist
                    if(aUnterNves[k].Exidv===sInput || aUnterNves[k].Exidv.substring(aUnterNves[k].Exidv.length-5)===sShortInput){
                        oFoundNve=aUnterNves[k];
                    }
                }

                if(oFoundNve){ //Wenn gefunden
                    this.unableToLoadCuzUnterNveError(sShortInput); //Meldung Unter-Nve kann nicht verladen werden
                }else{
                    this.getNveFromGlobalArray(sInput, sShortInput); //Nachsehen ob sie zu dieser Tour gehört
                }
            },

            CheckIfAlreadyLoaded:function(oFoundNve){ //Prüfen ob NVE in den bereits verladen wurde 
                var aLoadedNvesOfTour=this.getOwnerComponent().getModel("LoadedNves").getProperty("/results");
                const bAlreadyLoaded= (element) => element.Exidv===oFoundNve.Exidv;   //! Prüfen ob der Parameter sExidv oder Exidv heißt

                if(aLoadedNvesOfTour.some(bAlreadyLoaded)){
                    this.setAlreadyLoadedDialogModel(oFoundNve);
                } else{
                    this.CheckIfAlreadyCleared(oFoundNve); 
                }
            },

            CheckIfAlreadyCleared:function(oFoundNve){ //Prüfen ob NVE in Klärung ist
                var aClearedNvesOfTour=this.getOwnerComponent().getModel("ClearedNves").getProperty("/results");
                const bAlreadyCleared= (element) => element.Exidv===oFoundNve.Exidv;  //! Prüfen ob der Parameter sExidv oder Exidv heißt

                if(aClearedNvesOfTour.some(bAlreadyCleared)){
                    this.setAlreadyClearedDialogModel(oFoundNve);
                } else{
                    this.FuLoadingSet(oFoundNve); //! Prüfung notwendig, ob Fall eintreten kann weil in der Methode "getNveFromGlobalArray" der Ausstieg passieren wrde
                }
            },

            checkIfNextStopIsNecessary:function(){ //Prüfen ob NVE-Tree leer ist und somit ein neuer Stopp aufgerufen werden soll
                var oModel=this.getOwnerComponent().getModel("NVEs");
                var aNves=oModel.getProperty("/results");

                if(aNves.length===0){ //Wenn keine NVEs mehr vorhanden sind, den Stop splicen
                    this.spliceStop();
                }
            },

            chekIfNveIsSelectedForPhoto:function(){ //Ist nur da um zu sehen ob eine Nve selektiert wurde
                var oSelectedItem=this.getView().byId("TreeOfNves").getSelectedItem();

                if(oSelectedItem!== null){
                    this.getSelectedNveForPhotoModel(oSelectedItem); //Setzen der Beschreibung einer Nve in das Inputfeld
                    this.onToCustomerPhotoDialogOpen();
                } else{
                    this.noNveForPhotoSelectedError();
                }
            },

            CheckIfModelIsEmpty:function(){ //Wenn eine NVE verladen wurde soll geprüft werden, ob noch eine NVE zu diesem Stopp existiert
                var aTreeNves=this.getOwnerComponent().getModel("NVEs").getProperty("/results");
                if(aTreeNves.length===0){ //Wenn keine weitere NVE --> Löschen des Stops aus der Übersicht
                    this.spliceStop();
                }
            },

            checkIfStopSequenceNeedsToBeUpdated:function(){
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                if(oUserSettingsModel.bStopSequenceChangeable){
                    this.UpdateStopSequence();
                }else{
                    //NOP
                }
            },

            checkIfNextStopAvailable:function(){ //Abhängig von der Stopp-Liste wird entweder der nächste Stopp oder die Abschlussübersicht vorbereitet
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");
                
                if(aStops.length>0){
                    this.getNextStopInLine();
                } else{
                    this.onNavToTourConclusionPage();
                    //this.setInterNvesinClearModel(); //Klärgrund-NVEs für die Abschlussübersicht vorbereiten
                }
            },

            checkKindOfStop:function(aoDataResults){
                if(aoDataResults[0].FlgInterdepot){ //Handelt sich um einen Interdepot-Stopp
                    this.setNvesOfStop_InterdepotCase(aoDataResults); //Abhandeln von Interdepot Methoden
                } else{ //Handelt sich um einen Kunden-Stopp
                    this.setNvesOfStop_CustomerCase(aoDataResults);
                }
            },

            ///////////////////////////////////////
            //Navigation
            ///////////////////////////////////////

            onNavToTourConclusionPage:function(){
                this._oRouter.navTo("RouteTourConclusion");
            },

            onNavigationBack:function(){
                this._oRouter.navTo("RouteStopsOfTour");
            },

            onNavToInterdepotPage:function(){
                this._oRouter.navTo("RouteInterdepotTour");
            },

            ///////////////////////////////////////
            //Dialoge
            ///////////////////////////////////////

            onAlreadyClearedDialogOpen:function(){
                // create dialog lazily
                this.oAlreadyClearedDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.AlreadyCleared"
                });
            
                this.oAlreadyClearedDialog.then((oDialog) => oDialog.open());
            },

            onAlreadyClearedDialogClose:function(){
                this.byId("alreadyClearedDialog").close();
            },

            onAlreadyLoadedDialogOpen:function(){ //Dialog wird nach dem erhalten der Kl#ärgründe geöffnet
                this.oAlreadyLoadedDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.AlreadyLoaded"
                });
            
                this.oAlreadyLoadedDialog.then((oDialog) => oDialog.open());
            },

            onAlreadyLoadedDialogClose:function(){
                this.byId("alreadyLoadedDialog").close();
            },

            onOpenNavigationBackDialog: function() {
                // create dialog lazily
                this.oNavBackDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.NavigationBack"
                });
            
                this.oNavBackDialog.then((oDialog) => oDialog.open());
            },

            onCloseNavigationBackDialog:function(){
                this.byId("NavigationBackDialog").close();
            },

            onSendErrorsToBackendDialogOpen:function(){ //Öffnen eines Dialoges, weite sind analog zu diesem
                this.oErrorDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.SendErrorsToBackend"
                });
            
                this.oErrorDialog.then((oDialog) => oDialog.open());
            },

            onSendErrorsToBackendDialogClose:function(){
                this.byId("sendConsoleLogToBackendDialog").close();
                this.setFocusNveHandlingPage();
            },

            onOpenClearingReasonDialog: function() {
                // create dialog lazily
                this.oClearingReasonDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.Clearing"
                });
            
                this.oClearingReasonDialog.then((oDialog) => oDialog.open());
            },

            onClearingDialogClose:function(){
                this.byId("klaergrundDialog").close();
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
            },

            ///////////////////////////////////////
            //Utily/Reset Methoden
            ///////////////////////////////////////

            resetInputFields:function(sManInputId, sScanInputId){ //Leeren der Inputfelder aus der Abschlussübersicht + Focus setzen
                this.getView().byId(sManInputId).setValue("");
                this.getView().byId(sScanInputId).setValue("");
            },

            setFocusStopSortPage:function(sManInputId, sScanInputId){ //Focus für die Inputfelder der Stoppreihenfolge
                this.getView().byId(sManInputId).focus() || this.getView().byId(sScanInputId).focus();
            },

            ///////////////////////////////////////
            //Fehlermeldungen
            ///////////////////////////////////////

            unableToLoadCuzUnterNveError:function(sShortInput){
                this.playBeepError();
                MessageBox.error(this._i18nModel.getText("loadingOfUnveNotAllowed_1")+" '"+sShortInput+ "' "+this._i18nModel.getText("loadingOfUnveNotAllowed_2"), {
                    onClose:function(){
                        this.resetNveInputFields();
                        //this.resetInputFields("ManInputNve", "ScanInputNve");
                    }.bind(this)
                });
            },

            MessageSuccesfullyLoaded:function(){ //Erfolgreich verladen
                MessageToast.show(this._i18nModel.getText("successfullyLoaded"));
            },

            inputShortError:function(sInput){ //Eingabe für NVEs zu kurz
                this.playBeepError();
                MessageBox.error(this._i18nModel.getText("inputTooShort_1")+" '"+sInput+ "' "+this._i18nModel.getText("inputTooShort_2"), {
                    onClose:function(){
                        this.resetNveInputFields();
                        //this.resetInputFields("ManInputNve", "ScanInputNve");
                    }.bind(this)
                });
            },

            noItemSelectedClearingError:function(){ //Keine NVE für KLärung ausgewählt
                //this.playBeepError();
                MessageBox.warning(this._i18nModel.getText("noClearingNveSelected"), {
                    onClose:function(){
                        //this.resetNveInputFields();
                        //this.resetInputFields("ManInputClosingNve", "ScanInputClosingNve");
                    }.bind(this)
                });
            },

            noNveForPhotoSelectedError:function(){ //Fehlermeldung, wenn keine NVE ausgewählt wurde um ein Foto dieser zu schießen
                this.playBeepError();
                MessageBox.error(this._i18nModel.getText("noNveFoPhotoSelected"), {
                    onClose:function(){
                        this.setFocusNveHandlingPage();
                    }.bind(this)
                });
            },

            unableToLoadCuzNotFoundError:function(sInput, sStop){ //Die NVE gehört nicht zum Stopp
                this.playBeepError();
                MessageBox.error(this._i18nModel.getText("nveDoesNotBelongToStop_1") +" "+sInput+" "+ this._i18nModel.getText("nveDoesNotBelongToStop_2") +" "+sStop, {
                    onClose:function(){
                        //this.resetNveInputFields();
                        this.resetInputFields("ManInputNve", "ScanInputNve");
                    }.bind(this)
                });
            },
            updateNotPossibleError:function(errorMsg){ //Senden der neuen Stoppreihenfolge an das Backend ist gescheitert
                MessageBox.error(errorMsg, {
                    onClose:function(){
                        this.setFocusStopSortPage("ManInputStops", "ScanInputStops");
                    }.bind(this)
                });
            },

            playBeepError: function () { //Piep
                var base64 =
                    "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AAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksD/gAAAASwAAAAAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uSwP+AAAABLAAAAAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksD/gAAAASwAAAAAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uSwP+AAAABLAAAAAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAP/7ksD/gAAAASwAAAAAAAAlgAAAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAAA="
                var audio = new Audio("data:audio/wav;base64," + base64);
                audio.volume = 0.2;
                audio.play();
            },

            showSendingSuccessfullMessage:function(){
                MessageToast.show(this._i18nModel.getText("successfullySend"), {
                    duration: 1000,
                    width:"15em",
                    onClose:this.setFocusNveHandlingPage()
                });
            }
        });
    });