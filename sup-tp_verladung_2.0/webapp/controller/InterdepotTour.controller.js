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

        return Controller.extend("suptpverladung2.0.controller.InterdepotTour", {
            onInit: function () {
                this._sStopParameterModel="";
                this._navigationHandler=navigationHandler;
                this._sortNveHandler=sortNveHandler;

                this._oRouter = this.getOwnerComponent().getRouter();
			    this._oRouter.getRoute("RouteInterdepotTour").attachPatternMatched(this.onObjectMatched, this);
            },

            onAfterRendering:function(){
                this._i18nModel; //Globales Model für die i18n
                this.getView().byId("interdepotNvePage").attachBrowserEvent('click', // immer wenn geklickt wird, wird der Focus in das respektive Inputfeld gesetzt
                function (oEvent) {
                    //Fokus Methode für die jeweiligen Felder
                }.bind(this));
            },

            callNavigationHandler:function(oStop){
                this.busyDialogOpen();
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var oResponseModel=this.getOwnerComponent().getModel("Response");
                this.setStopParameterModel(oStop);
                this._navigationHandler.getNvesOfStop(oStop, oUserSettingsModel.IvIdEumDev, oUserSettingsModel.IvIdTr, oResponseModel);
                this.getKindOfStop();
            },

            setStopParameterModel:function(oStop){ //Setzen des Models für die nächste Seite & Navigation
                this.getOwnerComponent().getModel("StopParameterModel").setProperty("/Stop", oStop);
            },

            onObjectMatched:function(oEvent){
                var oParameters=oEvent.getParameter("arguments");
                this.setGlobalParameters(oParameters);
            },

            setGlobalParameters:function(oParameters){
                this._sStopParameterModel=this.getOwnerComponent().getModel("StopParameterModel");
                this.setUserInterfaceMethodes();
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

            getNvesOfStop:function(oStop){ //Stopp wird übergeben und die NVEs im Backend erfragt
                //this.busyDialogOpen();
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var sPathPos = "/GetFusLoadSet(IvIdEumDev='" + oUserSettingsModel.IvIdEumDev + "',IvIdTr='" + oUserSettingsModel.IvIdTr + "',IvNoStop='" + oStop.NoStop + "')"; // Id
                
                //!BackendAufruf auskommentiert da keine Anbindung in privatem VsCode
                /*
                this.getView().getModel("TP_VERLADUNG_SRV").read(sPathPos, {

                    urlParameters: {
                        "$expand": "GetFusLoadToList/GetFusLoadListMatSet"
                    },
            
                    success: function (oData) {
                        //Möglich, dass der Stopp keine NVEs hat?
                        //Angenommen: Nein --> Weil Stops später übersprungen werden?
                        var aoDataResults=oData.getProperty("/results");

                        this.checkKindOfStop(aoDataResults);
                        

                    }.bind(this),
                    error: function(oError){
                        //NOP
                    }.bind(this)

                });
                */
               //////////////////////////////
                //TODO_5:Demonstrations-Fall
                //!In der normalen Anwendung wieder entfernen!
                //////////////////////////////
                //var oDemoObjekt=this.getView().getModel("Stops").getProperty("/results")[0];
                var oDemoObjekt=this.getOwnerComponent().getModel("Stops").getProperty("/results")[0];
                var aoDataResults=[];
                
                var x=Math.floor(Math.random() *4);

                for(var i=0; i<=x; i++){
                    var _ExidvCounter=0;
                    _ExidvCounter++;
                    var aObjectArray=[];
                    
                    for(var i=1; i<3;i++){
                        
                        var oUnterNve={
                            Description: "UnterNve_" + i+"_",
                            Exidv: i +"0000",
                            Customer: oStop.Name1

                        }
                        aObjectArray.push(oUnterNve);
                    }

                    var oObject={
                        Description:"Ü-NVE_Demo_" +_ExidvCounter +" | 0000" +_ExidvCounter,
                        Exidv:"0000" +_ExidvCounter,
                        Customer:oStop.Name1,
                        children: aObjectArray,
                        FlgInterdepot: true
                    }

                    aoDataResults.push(oObject);
                }

                //Testfall
                this.checkIfStopSequenceNeedsToBeUpdated();
                this.checkKindOfStop(aoDataResults)
            },

            sendNewStopOrderToBackend:function(){ //Versenden der neuen Stoppreihenfolge an das Backend
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");
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

            ///////////////////////////////////////
            //Methoden für die Backend-Daten
            ///////////////////////////////////////

            ///////////////////////////////////////
            //Methoden für das Model
            ///////////////////////////////////////

            onLoadInterdepotNves:function(){ //Methode für das Quittieren von Interdepot NVEs
                var aInterdepotNves= this.getOwnerComponent().getModel("InterdepotNVEs").getProperty("/results");

                for(var i in aInterdepotNves){//Beide Methoden erwarten eine Einzelne NVE, deshalb die Schleife
                    setTimeout(() => { this.saveInInterdepotArray(aInterdepotNves[i]) },5);
                    setTimeout(() => { this.saveInAllNveArray(aInterdepotNves[i]); },10); //?Muss man mal schauen ob Interdepot-NVEs geklärt weden können
                }
                this.removeInterdepotNves();
            },

            saveInInterdepotArray:function(oInterdepotNve){
                var _aInterdepotNvesOfTour=this.getOwnerComponent().getModel("InterdepotNVEs").getProperty("/results");
                if(_aInterdepotNvesOfTour.indexOf(oInterdepotNve)===-1){
                    _aInterdepotNvesOfTour.push(oInterdepotNve);
                }
            },

            saveInAllNveArray:function(oNve){ //Speichern einer NVE, sofern sie behandelt wurde und noch nicht vermerkt ist
                var _aAllNvesOfTour=this.getOwnerComponent().getModel("AllNvesOfTour").getProperty("/results");
                if(_aAllNvesOfTour.indexOf(oNve)===-1){
                    _aAllNvesOfTour.push(oNve);
                }
            },

            removeInterdepotNves:function(){
                var oModel=this.getOwnerComponent().getModel("InterdepotNVEs");
                oModel.setProperty("/results", []);
                this.checkIfStopAfterInterdepotNvesIsNecessary();
            },

            checkIfStopAfterInterdepotNvesIsNecessary:function(){
                var oModel=this.getOwnerComponent().getModel("InterdepotNVEs");
                var aInterdepotNves=oModel.getProperty("/results");

                if(aInterdepotNves.length===0){ //Wenn keine NVEs mehr vorhanden sind, den Stop splicen
                    this.spliceStop();
                }
            },

            spliceStop:function(){ //Entfernen des abgearbeiteten Stopps aus dem Model/ der Liste
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");
                var sCurrentStop=this.getView().byId("InterdepotPageTitle").getText();
                var iIndexCurrentStop;

                for(var i in aStops){
                    var sDescription=aStops[i].Description; //Speichern des Stopp-Namens aus dem Model
                    var sCompareDescription=sDescription.substring(1, sDescription.length); //Entfernen des "*/_"
                    if(sCompareDescription.includes(sCurrentStop)){
                        iIndexCurrentStop=parseInt(i); //Stelle zum Splicen Merken
                    }
                }
                aStops.splice(iIndexCurrentStop, 1); 
                //this.getView().getModel("Stops").refresh(); //Eventuell unnötig
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

            filterFinishedStops: function (aRecievedStops) { //Entfernen von Stopps, deren Verlade-Prozess bereits abgeschlossen ist

                for (var i = aRecievedStops.length - 1; i >= 0; i--) {
                    if (aRecievedStops[i].LoadProcessFinished==="true") {
                        aRecievedStops.splice(parseInt(i), 1);
                    }
                }
                return aRecievedStops;
            },

            ///////////////////////////////////////
            //check-/finder-Methoden
            ///////////////////////////////////////

            checkIfNextStopAvailable:function(){ //Abhängig von der Stopp-Liste wird entweder der nächste Stopp oder die Abschlussübersicht vorbereitet
                var aStops=this.getView().getModel("Stops").getProperty("/results");
                
                if(aStops.length>0){
                    this.getNextStopInLine();
                } else{
                    this.onNavToTourConclusionPage();
                    //this.setInterNvesinClearModel(); //Klärgrund-NVEs für die Abschlussübersicht vorbereiten
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

            checkKindOfStop:function(aoDataResults){
                if(aoDataResults[0].FlgInterdepot){ //Handelt sich um einen Interdepot-Stopp
                    this.setNvesOfStop_InterdepotCase(aoDataResults); //Abhandeln von Interdepot Methoden
                } else{ //Handelt sich um einen Kunden-Stopp
                    this.setNvesOfStop_CustomerCase(aoDataResults);
                }
            },

            ///////////////////////////////////////
            //get-Methoden
            ///////////////////////////////////////

            //!Hier diese Methode muss noch getestet werden
            getNextStopInLine:function(){ //Erhalten des nächsten Stops, abhängig von der derzeitigen Location
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");
                var sCurrentStopTitle=this.getView().byId("InterdepotPageTitle").getText();
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

                this.getNvesOfStop(aFilteredStops[aFilteredStops.length-1]);
            },

            ///////////////////////////////////////
            //set-Methoden
            ///////////////////////////////////////

            setTitleForInterdepotTree:function(){ //Titel des NVE-Trees wird gesetzt. Erwartung: "NVEs: ('Anzahl')"
                this._i18nModel=this.getView().getModel("i18n").getResourceBundle(); //Globales Model für die i18n
                var aInterdepotNves=this.getView().getModel("InterdepotNVEs").getProperty("/results");
                this.getView().byId("InterdepotTreeTitle").setText(this._i18nModel.getText("NveTreeStandardText")+ " " + "("+ aInterdepotNves.length +")");
            },

            setInterdepotStopTitle:function(oStop){ //Titel der InterdepotSeite
                this.getView().byId("InterdepotPageTitle").setText(oStop.Description.substring(1, oStop.Description.length));
            },

            setFocusInterdepotNvePage:function(){ //Focus für den Knopf des Interdepot Verlade Buttons
                this.getView().byId("btnInterdepotStopLoading").focus();
            },

            setSendConsoleLogFocus:function(){
                this.setFocusInterdepotNvePage();
            },
            getKindOfStop:function(){
                var oResponseModel=this.getOwnerComponent().getModel("Response");
                var aResponseNves=oResponseModel.getProperty("/results");
                
                if(oResponseModel.isInterdepot==true){
                    this.setNvesOfStop_InterdepotCase(aResponseNves);
                } else{
                    this.setNvesOfStop_CustomerCase(aResponseNves);
                }
                this.setUserInterfaceMethodes();
            },

            setUserInterfaceMethodes:function(){ //UI wird aktualisiert
                var oStop=this._sStopParameterModel.getProperty("/Stop");

                this.setInterdepotStopTitle(oStop); //Titel der Seite wird angepasst
                this.setTitleForInterdepotTree(); //Anzeige der verbleibenden NVEs wird angepasst

            },

            setNvesOfStop_InterdepotCase:function(aResponseNves){ //Hier werden alle Methoden für den Fall eines Interdepot Stopps abgehandelt
                var oInterdepotModel=this.getOwnerComponent().getModel("InterdepotNVEs");
                //!Derzeit noch nicht getestet weil der sortNveHandler noch in Arbeit ist
                /*
                this._sortNveHandler.setAttributesForLoading(aResponseNves, this._i18nModel);
                var aSortedResponseNves=this.getOwnerComponent().getModel("sortedNveModel").getProperty("/sortedNves");
                */
                oInterdepotModel.setProperty("/results", aResponseNves);//aSortedResponseNves wird hier später als Parameter erwartet
                oInterdepotModel.refresh();
                this.busyDialogClose();
            },
    
            setNvesOfStop_CustomerCase:function(aResponseNves){ //Hier werden alle Methoden für den Fall eines Kunden Stopps abgehandelt
                var oNveModel=this.getOwnerComponent().getModel("NVEs");
                //!Derzeit noch nicht getestet weil der sortNveHandler noch in Arbeit ist
                /*
                this._sortNveHandler.setAttributesForLoading(aResponseNves, this._i18nModel);
                var aSortedResponseNves=this.getOwnerComponent().getModel("sortedNveModel").getProperty("/sortedNves");
                */
                oNveModel.setProperty("/results", aResponseNves);//aSortedResponseNves wird hier später als Parameter erwartet
                oNveModel.refresh();
                this.busyDialogClose();
                this.onNavToNveHandling();
            },

            ///////////////////////////////////////
            //Navigation
            ///////////////////////////////////////

            onNavToTourConclusionPage:function(){
                this._oRouter.navTo("RouteTourConclusion");
            },

            onNavToNveHandling: function() { //schließen vom Busy Dialog notwendig weil erst entschieden werden muss, auf welche Seite Navigiert wird
                this._oRouter.navTo("RouteNveHandling");
            },

            onNavigationBack:function(){
                this._oRouter.navTo("RouteStopsOfTour");
            },

            ///////////////////////////////////////
            //Dialoge
            ///////////////////////////////////////

            onOpenNavigationBackDialog: function() { //Öffnen des Dialoges für Navigation zurück
                //this.playBeepError();
                // create dialog lazily
                this.pDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.NavigationBack"
                });
            
                this.pDialog.then((oDialog) => oDialog.open());
            },

            onCloseNavigationBackDialog:function(){ //Schließen des zurück Dialoges ohne zu navigieren
                // note: We don't need to chain to the pDialog promise, since this event handler
                // is only called from within the loaded dialog itself.
                this.byId("NavigationBackDialog").close();
            },

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

            onFocusBackAbort:function(){
                this.setFocusInterdepotNvePage();
            },

            ///////////////////////////////////////
            //Fehlermeldungen
            ///////////////////////////////////////

            showSendingSuccessfullMessage:function(){
                MessageToast.show(this._i18nModel.getText("successfullySend"), {
                    duration: 1000,
                    width:"15em",
                    onClose:this.setFocusonLatestTour()
                });
            }
        });
    });