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
    "suptpverladung2/0/util/sortNveHandler",
    "suptpverladung2/0/util/stopSequenceHandler"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, HashChanger, Filter, Sorter, MessageToast, MessageBox, GeoMap, Spot, Spots, VoAbstract, FilterOperator, Item, scanner, navigationHandler, sortNveHandler, stopSequenceHandler) {
        "use strict";

        return Controller.extend("suptpverladung2.0.controller.StopsOfTour", {

            //!Methode für die GeoMap vielleicht i.wie so abändern!
            /*
            onTemplateArt:function(){
                Fragment.load({
                    name:"",
                    controller: this,
                }).then(oDialog => {
                    this.tempDialog=oDialog;
                    //Fragment Id kann hier abgeerufen werden,
                    this.variable=this.getView().byId("ID");
                })
            },
            */

            /* Von Robin Code für den Scan ohne Inputfelder
            myCordova.enableDataWedge = function() {
             
                document.addEventListener('keydown', function(evt) {
                    app.log("keydown: " + evt.key, "I");
                    if (myCordova.interval) {
                        clearInterval(myCordova.interval);
                    }
                    if (evt.code == 'Enter' || evt.key == 'Enter') {
                        if (myCordova.barcode && myCordova.barcode.length > 3) {
                            myCordova.barcode = myCordova.barcode.replace(myCordova.barcodePrefix, "");
                            myCordova.barcode = myCordova.barcode.replace(myCordova.barcodeSuffix, "");
                            app.log("Barcode: " + myCordova.barcode, "I");
                            evt.preventDefault();
                            myCordova.callScanCallback(myCordova.barcode);
                        }
             
                        myCordova.barcode = '';
                        return;
                    }
                    if (evt.key != 'Shift') {
                        if (evt.key.length == '1') {
                            myCordova.barcode += evt.key;
                        }
                        myCordova.interval = setInterval(() => myCordova.barcode = '', 50);
                    }
                });
            }
            */
           
            onInit: function () {

                this._oTour=null;
                this._navigationHandler=navigationHandler;
                this._sortNveHandler=sortNveHandler;
                this._stopSequenceHandler=stopSequenceHandler;

                this._oRouter = this.getOwnerComponent().getRouter();
			    this._oRouter.getRoute("RouteStopsOfTour").attachPatternMatched(this.onObjectMatched, this);
                //this.initiateScanner();
            },

            onAfterRendering:function(){
                this._i18nModel=this.getView().getModel("i18n").getResourceBundle(); //Globales Model für die i18n
                this.getView().byId("stopSortPage").attachBrowserEvent('click', // immer wenn geklickt wird, wird der Focus in das respektive Inputfeld gesetzt
                function (oEvent) {
                    this.setFocusStopSortPage(); //Fokus Methode für die jeweiligen Felder
                }.bind(this));
            },
            /*
            initiateScanner:function(){
                scanner.registerScanner((scannedValue) => {
                    if(scannedValue.match(/[0-9]/) && scannedValue.match(/[a-zA-Z]/)){
                        //only letters
                        //this.setValueInput(scannedValue);
                        sap.m.MessageToast.show("Gescannted Inhalt: "+scannedValue);
                    } else{
                        if(scannedValue.match(/^[0-9]+$/)){
                            //Only Numbers
                            sap.m.MessageToast.show("Gescannted Inhalt: "+scannedValue);
                        }else{
                            sap.m.MessageToast.error("Gescannted Inhalt nicht gültig!");
                        }
                    }
                });
            },
            */
            onObjectMatched:function(oEvent){
                var oParameters=oEvent.getParameter("arguments");
                this.setGlobalParameters(oParameters);
            },

            setGlobalParameters:function(oParameters){
                this._oTour=this.getView().getModel("TourParameterModel").getProperty("/tour");
                this.swapInputMode();
                this.getTourStops(this._oTour);
                this.setTourTitle(this._oTour);
            },

            ChangeFromManToScan:function(){ //Vorbereitung zum Wechseln des Eingabemodus
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");

                if(oUserSettingsModel.bManuelInput){ //Ist der Eingabemodus von Hand?
                    oUserSettingsModel.bManuelInput=false
                } else{
                    oUserSettingsModel.bManuelInput=true;
                }

                this.swapInputMode();
            },

            swapInputMode:function(){ //Austauschen der Inputfelder
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                
                if(oUserSettingsModel.bManuelInput){
                    this.getView().byId("ScanInputStops").setVisible(false);
                    this.getView().byId("ManInputStops").setVisible(true);
                } else{
                    this.getView().byId("ScanInputStops").setVisible(true);
                    this.getView().byId("ManInputStops").setVisible(false);
                }

                this.resetStopInputFields();
            },

            /*
            addCameraPlayerToCameraDialog:function(){ //Erstellen des VideoPlayers für den CameraStream und diesen in den Dialog setzen
                var oPhotoDialog=this.getView().byId("toCustomerPhotoDialog");
                var oCameraPlayer = new sap.ui.core.HTML({
                    content: "<video id='player' width='100%' autoplay></video>"
                });
                oPhotoDialog.addContent(oCameraPlayer);
            },
            */

            ///////////////////////////////////////
            //Backend
            ///////////////////////////////////////

            getTourStops:function(oModelStop){ //Erhalten der Stopps einer Tour aus dem Backend
                this.busyDialogOpen();
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var IdTr=oModelStop.IdTr;
                //var sPathPos = "/GetStopsByTourSet(IvIdEumDev='" + oUserSettingsModel.IvIdEumDev + "',IvIdTr='" + IdTr + "')"; 
                
                /*
                BackendAufruf auskommentiert da keine Anbindung in privatem VsCode
                this.getView().getModel("TP_VERLADUNG_SRV").read(sPathPos, {

                    urlParameters: {
                        "$expand": "GetStopsByTourToStopinfo"
                    },

                    success: function (oData) {
                        this.busyDialogClose();
                        var aRecievedStops=oData.GetStopsByTourToStopinfo.results;

                        if(aRecievedStops.length===0){
                            this.noStopsToThisTourError();
                        } else{
                            this.handleRecievedStops(aRecievedStops, oData);
                        }

                    }.bind(this),
                    error:function(oError){
                        this.busyDialogClose();
                        //Möglichkeit besteht, diese Fehlermeldung in den Fehler-Stack aufzunehmen
                    }.bind(this)
                });
                */
                //!Auskommentiert weil in der Demo keine Verwendung. Für Integrität wird das Programm trotzdem den üblichen Verlauf nehmen

                ///////////////////////////////////////////////////////
                //Tour wird aus einem vorher erstellten Model in der COmponent.json gerladen:
                //Folgender Code muss für das Original entfernt werden
                ///////////////////////////////////////////////////////
                this.busyDialogClose();
                var oTestData= new JSONModel();
                oTestData.EvChangeable="X";
                var sModelName=oModelStop.Description;
                var aSelectedStopList=this.getOwnerComponent().getModel(sModelName).getProperty("/results");
                this.handleRecievedStops(aSelectedStopList, oTestData);

            },

            handleRecievedStops:function(aRecievedStops, oData){ //Verarbeiten der erhaltenen Stopps
                var oStopModel=this.getOwnerComponent().getModel("Stops");
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                 
                if(oData.EvChangeable===""){//"" --> ist in ABAP false --> es dürfen fertig verladene Stops nicht angezeigt werden
                    oUserSettingsModel.bStopSequenceChangeable=false;
                    aRecievedStops=this.filterFinishedStops(aRecievedStops);
                    oStopModel.setProperty("/results", aRecievedStops);
                } else{
                    oUserSettingsModel.bStopSequenceChangeable=true;
                    oStopModel.setProperty("/results", aRecievedStops);
                    this.stopDescriptionRefresh(); //Kann hier direkt aufgerufen werden, denn Daten werden gerade erhlten
                }
                //Code Dopplung im if-else, weil Stoppnummer fest ist, wenn nicht mehr geändert werden darf
            },

            checkIfStopOrderChangeable:function(){
                var aLoadedNves=this.getOwnerComponent().getModel("LoadedNves").getProperty("/results");
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var oStopOrderChangeAllowedModel=this.getOwnerComponent().getModel("oStopOrderChangeAllowedModel").getProperty("/status");
                this._stopSequenceHandler.chekIfStopSequenceChangeable(oUserSettingsModel, oStopOrderChangeAllowedModel);
                this._stopSequenceHandler.checkIfNvesAreLoaded(aLoadedNves, oStopOrderChangeAllowedModel);

                if(oStopOrderChangeAllowedModel.bStopOrderChangeGeneralyAllowed && oStopOrderChangeAllowedModel.bStopOrderChangeAllowedDueToNoNves){
                    this.stopDescriptionRefresh();
                } else{

                }
            },

            checkIfStopOrderChangeableForButtons:function(oEvent){
                var aLoadedNves=this.getOwnerComponent().getModel("LoadedNves").getProperty("/results");
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var oStopOrderChangeAllowedModel=this.getOwnerComponent().getModel("oStopOrderChangeAllowedModel").getProperty("/status");
                this._stopSequenceHandler.chekIfStopSequenceChangeable(oUserSettingsModel, oStopOrderChangeAllowedModel);
                this._stopSequenceHandler.checkIfNvesAreLoaded(aLoadedNves, oStopOrderChangeAllowedModel);

                if(oStopOrderChangeAllowedModel.bStopOrderChangeGeneralyAllowed && oStopOrderChangeAllowedModel.bStopOrderChangeAllowedDueToNoNves){
                    this.checkIfStoppIsSelected(oEvent);
                } else{
                    this.ChangeStopError();
                }
            },
            

            onSendErrorsToBackend:function(){ //Vorbereiten zum Senden des Fehler-Logs
                var oErrorTextField=this.getView().byId("sendConsoleLogDialogInput");
                this.sendLog(oErrorTextField);
            },

            sendLog:function(oErrorTextField){ //Senden des FehlerLogs
                this.busyDialogOpen();
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var oModel = this.getView().getModel("TP_VERLADUNG_SRV");
                var oCreateData = {
                    "IdEumDev": oUserSettingsModel.IvIdEumDev,
                    "ErrorDesc": oErrorTextField.getValue(), 
                    "ErrorLogList": this.getOwnerComponent().getModel("ErrorLog").getProperty("/errors")
                }

                /*
                oModel.create("/ErrorLogCollection", oCreateData, { 
                    success: function (oData) {
                        //this.busyDialogClose();
                        oErrorTextField.setValue("");
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
                    this.onSendErrorsToBackendDialogClose();
                    this.showSendingSuccessfullMessage();
                },250); //Test zum Anzeigen des Lade-Dialogs mit 250ms
            },

            sendNewStopOrderToBackend:function(){ //Versenden der neuen Stoppreihenfolge an das Backend
                this.busyDialogOpen();
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
                        //this.busyDialogClose();
                        this.setFocusNveHandlingPage();
                    },
                    error: function (oError) {
                        //this.busyDialogClose();
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

                setTimeout(() => { this.busyDialogClose(); },100); //Test zum Anzeigen des Lade-Dialogs mit 100ms
            },

            ///////////////////////////////////////
            //Methoden für die Backend-Daten
            ///////////////////////////////////////

            ///////////////////////////////////////
            //Methoden für das Model
            ///////////////////////////////////////

            onZoomToPosition:function(){
                var sGeoLocationOfStop=this.getOwnerComponent().getModel("SpotModel").getProperty("/spot")[0].pos;
                var oGeoMapFragment=this.getView().byId("customerInfoGeoMapDialog");
                var aBananaSplit=sGeoLocationOfStop.split(';');

                oGeoMapFragment.getContent()[0].zoomToGeoPosition(parseFloat(aBananaSplit[0]), parseFloat(aBananaSplit[1]), parseFloat(aBananaSplit[2]));
            },

            fireChangeStopOrderEvent:function(oEvent, oSelectedItem){ //jeder Button der die Stoppsreihenfolge beeinflussen kann löst diese Methode aus
                var sEventTriggerId=oEvent.getSource().sId.substring(oEvent.getSource().sId.lastIndexOf("-")+1); //Id des Buttons der betätigt wurde

                var oModel=this.getOwnerComponent().getModel("Stops");
                var aStops=oModel.getProperty("/results"); //Array aus Objekten des Models
                //!Zwischen den Beiden Arrays besteht ein unterschied: Listenelemente sind nicht die Objekte aus dem Model!
                var aListItems=this.getView().byId("stopList").getItems(); //Array aus Objekten der Liste
                var iIndexSelectedItem=aListItems.indexOf(oSelectedItem); //Stelle in der Liste, die selektiert war
                var oStoppOfModel=aStops[iIndexSelectedItem]; //Element aus dem Model, dass wieder selektiert werden muss

                switch (sEventTriggerId) {
                    case "bUp":
                        if(iIndexSelectedItem>0){ //Befindet sich dann schon ganz oben
                            aStops.splice(iIndexSelectedItem, 1);
                            aStops.splice(iIndexSelectedItem-1, 0, oStoppOfModel);
                        }
                        break;

                    case "bDown":
                        if(iIndexSelectedItem<aListItems.length-1){ //Befindet sich dann schon ganz unten
                            aStops.splice(iIndexSelectedItem, 1);
                            aStops.splice(iIndexSelectedItem+1, 0, oStoppOfModel);
                        }
                        break;

                    case "bStart":
                        aStops.splice(iIndexSelectedItem, 1);
                        aStops.splice(0, 0, oStoppOfModel);
                        break;

                    case "bEnd":
                        aStops.splice(iIndexSelectedItem, 1);
                        aStops.splice(aListItems.length, 0, oStoppOfModel);
                        break;

                    case "btnReverse":
                        aStops.reverse();
                        oModel.refresh();
                        break;
                
                    default:
                        break;
                }
                this.onSelectSameLocation(oStoppOfModel);
                //this.stopDescriptionRefresh();
                this.checkIfStopOrderChangeable();
            },

            onSelectSameLocation:function(oStopOfModel){ //Nachdem ein Stopp in der Reihenfolge verschoben wurde, soll dieser erneut ausgewählt werden
                var oModel=this.getOwnerComponent().getModel("Stops");
                var oList=this.getView().byId("stopList");
                var aListItems=oList.getItems();
                var aListofStopps=oModel.getProperty("/results");
                var iIndexSelectedItem=aListofStopps.indexOf(oStopOfModel);
                
                oList.setSelectedItem(aListItems[iIndexSelectedItem], true);
                this.onScrollToItem(iIndexSelectedItem, aListItems); 
            },
            
            stopDescriptionRefresh:function(){ //Wird benötigt um die Stoppreihenfolge mit der ensprechenden Nummer bzw. dem Präfix "_"/"*" zu versehen
                var oModel=this.getOwnerComponent().getModel("Stops");
                var aStops=oModel.getProperty("/results");
                var sPraefix="";
                var sActualDescription="";
                var iStopnumber=2;

                for(var i in aStops){
                    var sNewDescription="";
                    sActualDescription=aStops[i].Description.substring(aStops[i].Description.indexOf("."), aStops[i].Description.length);

                    if(aStops[i].DelvInfo.length===0){
                        sPraefix="_";
                    } else{
                        sPraefix="*";
                    }

                    if(iStopnumber>=10 && iStopnumber<100){
                        sNewDescription=sNewDescription.concat(sPraefix + "0" + iStopnumber + sActualDescription);
                        aStops[i].Description=sNewDescription;
                    }

                    if(iStopnumber<10){
                        sNewDescription=sNewDescription.concat(sPraefix + "00" + iStopnumber + sActualDescription);
                        aStops[i].Description=sNewDescription;
                    }

                    if(iStopnumber>=100){
                        sNewDescription=sNewDescription.concat(sPraefix + iStopnumber + sActualDescription);
                        aStops[i].Description=sNewDescription;
                    }
                    iStopnumber++;
                }
                oModel.refresh();
                this.resetStopInputFields();
            },

            onScanCustomer:function(oEvent){ //Scannen von Kunden wird abgerufen
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var aLoadedNves=this.getOwnerComponent().getModel("LoadedNves").getProperty("/results");
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                var oStopOrderChangeAllowedModel=this.getOwnerComponent().getModel("oStopOrderChangeAllowedModel").getProperty("/status");
                this._stopSequenceHandler.chekIfStopSequenceChangeable(oUserSettingsModel, oStopOrderChangeAllowedModel);
                this._stopSequenceHandler.checkIfNvesAreLoaded(aLoadedNves, oStopOrderChangeAllowedModel);

                if(oStopOrderChangeAllowedModel.bStopOrderChangeGeneralyAllowed && oStopOrderChangeAllowedModel.bStopOrderChangeAllowedDueToNoNves){
                    this.checkIfStopSelected(aStops);
                } else{
                    this.ChangeStopError(); //Fehler weil nicht geändert werden darf
                }
            },

            processCustomerScan:function(oSelectedStop, iSelectedStopIndex, oScannedStop){ //Tatsächliches verschieben des Stopps im Model
                var oModel=this.getOwnerComponent().getModel("Stops");
                var aStops=oModel.getProperty("/results");
                var iScannedStopIndex=aStops.indexOf(oScannedStop);
                
                if(iSelectedStopIndex<iScannedStopIndex){   //Der gescannte Stopp liegt unterhalb des ausgewählten Stopps
                    aStops.splice(iScannedStopIndex, 1);    //entfernen des gescannten Stopps
                    aStops.splice(iSelectedStopIndex+1, 0, oScannedStop);   //einfügen des gescannten Stopps unterhalb des Selektierten Stopps
                }

                if(iSelectedStopIndex>iScannedStopIndex){   //Der gescannte Stopp liegt oberhalb des ausgewählten Stopps
                    aStops.splice(iScannedStopIndex, 1);
                    aStops.splice(iSelectedStopIndex, 0, oScannedStop);
                }
                //Bei Gleichheit muss nichts gemacht werden

                //Anzeige für den User und fertig machen für den nächsten Scan
                this.stopDescriptionRefresh();
                this.onSelectSameLocation(oScannedStop);
                this.resetStopInputFields();
            },

            onScrollToItem:function(iIndexSelectedItem, aListItems){ //Innerhalb des Scroll-Containers soll die NVE wieder mittig angezeigt werden
                if(iIndexSelectedItem<4){ //Vier ist die Vorgabe, denn das ist ungefähr die Mitte des Screens
                    this.getView().byId("ScrollContainerStopList").scrollToElement(aListItems[[0]]);
                } else{
                    this.getView().byId("ScrollContainerStopList").scrollToElement(aListItems[[iIndexSelectedItem-2]]);
                }
                this.stopDescriptionRefresh();
            },

            filterFinishedStops: function(aRecievedStops) { //Gibt gefiltertes Array zurück

                for (var i = aRecievedStops.length - 1; i >= 0; i--) {
                    if (aRecievedStops[i].LoadProcessFinished==="true") {
                        aRecievedStops.splice(parseInt(i), 1);
                    }
                }
                return aRecievedStops;
            },

            onSelectionChange:function(){ //Fokus in Eingabefeld bei Auswählen in der Liste
                this.setFocusStopSortPage();
            },

            cutStopDescription:function(){ //Description wird auf max 60 Zeichen gekürzt
                //Weil die Stoppreihenfolge immer in der Description angepasst wurde
                //kann dort die aktuelle Reihenfolge ausgelesen werden
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");

                for(var i in aStops){ 
                    var sPreviousDescription=aStops[i].Description;
                    if(sPreviousDescription.length>60){
                        aStops[i].Description=sPreviousDescription.substring(60); //Es reicht, wenn man das Ende des Strings angibt
                    }
                }

                this.setNewValueForNoStop(aStops);
            },

            ///////////////////////////////////////
            //get-Methoden
            ///////////////////////////////////////

            getInputValue: function (customInputId, normalInputId) {
                return this.getView().byId(customInputId).getValue() || this.getView().byId(normalInputId).getValue();
            },

            onToCustomer:function(){ //Prüfen ob ein Kunde in der Sopp-Übersicht ausgewählt wurde
                var oSelectedItem=this.getView().byId("stopList").getSelectedItem();

                if(oSelectedItem){
                    this.getSelectedCustomer(oSelectedItem);
                } else{
                    this.noStopSelectedError(); //Fehler weil nichts ausgewählt wurde
                }
            },

            getSelectedCustomerInformation:function(oEvent){
                var oListItem=oEvent.getParameter("listItem");
                var iIndexSelectedItem=this.getView().byId("stopList").getItems().indexOf(oListItem);
                
                if(iIndexSelectedItem===-1){ //Hier findet die Unterscheidung zwischen den Listen der Views statt
                    iIndexSelectedItem=this.getView().byId("stopListToCustomer").getItems().indexOf(oListItem);
                }
                
                //var oSelectedObject=this.getView().getModel("Stops").getProperty("/results")[iIndexSelectedItem];
                var oSelectedObject=this.getOwnerComponent().getModel("Stops").getProperty("/results")[iIndexSelectedItem];
                this.setCustomerDialogModel(oSelectedObject);
            },

            /*
            getSelectedTour:function(){ //Erhalten des Namens der ausgewählten Tour
                //var aTours=this.getView().getModel("Tour").getProperty("/results");
                var aTours=this.getOwnerComponent().getModel("Tour").getProperty("/results");
                var oList=this.getView().byId("LTourAuswahl"); //TODO: Hier prüfen ob der Teil nicht tatsächlich fehlschlägt
                var aListItems=oList.getItems();
                var oSelectedListItem=oList.getSelectedItem();
                var iIndexSelectedItem=aListItems.indexOf(oSelectedListItem);
                var oListItem=aTours[iIndexSelectedItem];

                this.setTourTitle(oListItem);
            },
            */

            getLastStopOfList:function(){ //Der Letzte Stopp in der Liste wird
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");
                var aFilteredStops=this.filterFinishedStops(aStops);
                var oLastStopOfList=aFilteredStops[aFilteredStops.length-1];

                this.setStopParameterModel(oLastStopOfList);
                this.callNavigationHandler(oLastStopOfList);
            },

            getNextStopInLine:function(aStops){ //Erhalten des nächsten Stops, abhängig von der derzeitigen Location
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

            callNavigationHandler:function(oStop){
                this.busyDialogOpen();
                var oResponseModel=this.getOwnerComponent().getModel("Response");
                var oUserSettingsModel=this.getOwnerComponent().getModel("UserSettings").getProperty("/settings");
                this._navigationHandler.getNvesOfStop(oStop, oUserSettingsModel.IvIdEumDev, oUserSettingsModel.IvIdTr, oResponseModel);
                this.getKindOfStop();
            },

            getKindOfStop:function(){
                var oResponseModel=this.getOwnerComponent().getModel("Response");
                var aResponseNves=oResponseModel.getProperty("/results");
                
                if(oResponseModel.isInterdepot==true){
                    this.setNvesOfStop_InterdepotCase(aResponseNves);
                } else{
                    this.setNvesOfStop_CustomerCase(aResponseNves);
                }

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
                this.onNavToInterdepotNveHandling();
            },
    
            setNvesOfStop_CustomerCase:function(aResponseNves){ //Hier werden alle Methoden für den Fall eines Kunden Stopps abgehandelt
                var oNveModel=this.getOwnerComponent().getModel("NVEs");
                //!Derzeit noch nicht getestet weil der sortNveHandler noch in Arbeit ist
                /*
                this._sortNveHandler.setAttributesForLoading(aResponseNves, this._i18nModel);
                var aSortedResponseNves=this.getOwnerComponent().getModel("sortedNveModel").getProperty("/sortedNves");
                */
                oNveModel.setProperty("/results", aResponseNves); //aSortedResponseNves wird hier später als Parameter erwartet
                oNveModel.refresh();
                this.busyDialogClose();
                this.onNavToNveHandling();
            },

            ///////////////////////////////////////
            //set-Methoden
            ///////////////////////////////////////

            setCustomerSpotForGeoMap:function(){
                var oSpotModel=this.getOwnerComponent().getModel("SpotModel");
                var oDisplayedStop=this.getOwnerComponent().getModel("StopInfoModel").getProperty("/info");
                var oSpot={
                    pos: oDisplayedStop.CoordX+";"+oDisplayedStop.CoordY+";12",
                    tooltip: oDisplayedStop.Name1,
                    type: "Success",
                    text: "oDisplayedStop.Name1",
                    StopNumber: oDisplayedStop.Description.substring(1,4)
                };

                oSpotModel.setProperty("/spot", []); //Entfernen ggf. vorher angezeigter Spots
                oSpotModel.setProperty("/spot", [oSpot]);

                this.onCustomerInfoGeoMapDialogOpen();
            },

            setFocusStopSortPage:function(){ //Focus für die Inputfelder der Stoppreihenfolge mit Verzögerung, da es manchmal probleme gab
                setTimeout(() => { this.getView().byId("ManInputStops").focus() || this.getView().byId("ScanInputStops").focus() },25);
            },

            setCustomerDialogModel:function(oSelectedObject){
                //Setzen von Objekt in das Model:
                //this.getView().getModel("StopInfoModel").setProperty("/info", oSelectedObject);
                this.getOwnerComponent().getModel("StopInfoModel").setProperty("/info", oSelectedObject);
                this.onCustomerInfoDialogOpen();
            },

            onClickSpot: function (oEvent) {
                var oSpot=this.getOwnerComponent().getModel("SpotModel").getProperty("/spot")[0];
                oEvent.getSource().openDetailWindow("Stopp Nummer "+oSpot.StopNumber +" "+oSpot.StopNumber, "0", "0" );
            },

            setTourTitle:function(oTour){ //Setzen des Titels für die Stopp-Auswahl Seite
                this.getView().byId("StopSortPageTitle").setText(oTour.Description);
            },

            setFocusDialogClose:function(){
                this.setFocusStopSortPage();
            },

            setNewValueForNoStop:function(aStops){ //?Soll es sich hier um 10 Zeichen handeln?
                for (var i in aStops) {
                    var iIndexOfDot=aStops[i].Description.indexOf(".");
                    aStops[i].NoStop="0000000" + aStops[i].Description.substring(1,iIndexOfDot);
                }
                this.sendNewStopOrderToBackend();
            },

            setStopParameterModel:function(oStop){ //Setzen des Models für die nächste Seite & Navigation
                this.getOwnerComponent().getModel("StopParameterModel").setProperty("/Stop", oStop);
            },

            ///////////////////////////////////////
            //check-/finder-Methoden
            ///////////////////////////////////////

            checkIfStoppIsSelected:function(oEvent){ //Wird für die Buttons gemacht
                var oSelectedItem=this.getView().byId("stopList").getSelectedItem();
                if(oSelectedItem!==null){
                    this.fireChangeStopOrderEvent(oEvent, oSelectedItem);
                } else{
                    this.StopSelectError();
                }
            },

            checkIfStopSelected:function(aStops){ //Wird für den Scan gemacht
                var oSelectedListStop=this.getView().byId("stopList").getSelectedItem();
                var oSelectedStop=undefined;

                if(oSelectedListStop) { //Prüfen ob Stopp selektiert wurde
                    var iSelectedStopIndex=this.getView().byId("stopList").getItems().indexOf(oSelectedListStop);
                    oSelectedStop=aStops[iSelectedStopIndex];
                    this.findScannedCustomer(oSelectedStop, iSelectedStopIndex);
                } else {
                    this.noStopSelectedError(); //Fehler weil kein Stopp selektiert wurde
                }
            },

            findScannedCustomer:function(oSelectedStop, iSelectedStopIndex){ //Prüfe ob der gescannte Kunde in der Liste existiert
                var sInput= this.getInputValue("ManInputStops", "ScanInputStops");
                //TODO_8: sInput = sInput.replace(/^0+/, '');
                //var aStops=this.getView().getModel("Stops").getProperty("/results");
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");
                var oScannedStop=undefined;

                for(var i in aStops){
                    if(aStops[i].IdLoc===sInput){
                        oScannedStop=aStops[i];
                    }
                }

                if(oScannedStop!==undefined){
                    this.processCustomerScan(oSelectedStop, iSelectedStopIndex, oScannedStop);
                } else{
                    this.noStopWithThisIdError(sInput); //Fehler weil er nicht in der Liste vorhanden ist
                }
            },

            getSelectedCustomer:function(oSelectedItem){ //Finden des Kunden
                var iIndexSelectedItem=this.getView().byId("stopList").getItems().indexOf(oSelectedItem);
                var aStops=this.getOwnerComponent().getModel("Stops").getProperty("/results");
                var oSelectedObject=aStops[iIndexSelectedItem];

                this.setStopParameterModel(oSelectedObject);
                this.callNavigationHandler(oSelectedObject);

            },

            ///////////////////////////////////////
            //Navigation
            ///////////////////////////////////////

            onNavigationBack:function(){
                this._oRouter.navTo("RouteTourSelection");
            },

            onNavToNveHandling: function() { //schließen vom Busy Dialog notwendig weil erst entschieden werden muss, auf welche Seite Navigiert wird
               this._oRouter.navTo("RouteNveHandling");
            },

            onNavToInterdepotNveHandling:function(){ //schließen vom Busy Dialog notwendig weil erst entschieden werden muss, auf welche Seite Navigiert wird
                this._oRouter.navTo("RouteInterdepotTour");
            },

            
            ///////////////////////////////////////
            //Dialoge
            ///////////////////////////////////////

            onOpenNavigationBackDialog: function() {
                //this.playBeepError();
                // create dialog lazily
                this.oNavBackDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.NavigationBack"
                });
            
                this.oNavBackDialog.then((oDialog) => oDialog.open());
            },

            onCloseNavigationBackDialog:function(){
                this.byId("NavigationBackDialog").close();
            },

            onSendErrorsToBackendDialogOpen:function(){
                this.oErrorDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.SendErrorsToBackend"
                });
            
                this.oErrorDialog.then((oDialog) => oDialog.open());
            },

            onSendErrorsToBackendDialogClose:function(){
                this.byId("sendConsoleLogToBackendDialog").close();
                this.setFocusStopSortPage();
            },

            onCustomerInfoDialogOpen:function(){
                this.oCustomerInfoDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.CustomerInfo"
                });
            
                this.oCustomerInfoDialog.then((oDialog) => oDialog.open());
            },

            onCustomerInfoDialogClose:function(){
                this.byId("customerInfoDialog").close();
            },

            onCustomerInfoGeoMapDialogOpen:function(){
                this.oGeoMapDialog ??= this.loadFragment({
                    name: "suptpverladung2.0.view.fragments.GeoMap"
                });
                
                this.oGeoMapDialog.then((oDialog) => oDialog.open());
            },

            onCustomerInfoGeoMapDialogClose:function(){
                this.byId("customerInfoGeoMapDialog").close();
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
                this.setFocusStopSortPage();
            },

            //////////////////////////////////////
            //Fokus-/Reset-Methoden
            //////////////////////////////////////

            resetStopInputFields:function(){ //Leeren der Inputfelder für die Stopp-Reihenfolge + Focus setzen
                this.getView().byId("ManInputStops").setValue("");
                this.getView().byId("ScanInputStops").setValue("");
                this.setFocusStopSortPage();
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

            StopSelectError:function(){ //Verschieben des Stopps über Buttons während kein Stopp ausgewählt ist
                MessageBox.error(this._i18nModel.getText("selectStopToChange"), {
                    onClose:function(){
                        this.resetStopInputFields();
                    }.bind(this)
                });
            },

            noStopWithThisIdError:function(sInput){ //Stopp wurde nicht gefunden
                this.playBeepError();
                MessageBox.error(this._i18nModel.getText("stopWithIdNotFound_1")+" " + sInput + " "+this._i18nModel.getText("stopWithIdNotFound_2"), {
                    onClose:function(){
                        this.resetStopInputFields();
                    }.bind(this)
                });
            },

            noStopSelectedError:function(){ //Kein Stopp selektiert
                MessageBox.error(this._i18nModel.getText("noStopSelected"), {
                    onClose:function(){
                        this.resetStopInputFields();
                    }.bind(this)
                });
            },

            ChangeStopError:function(){  //Die Stoppreihenfolge darf nicht verändert werden
                this.playBeepError();
                MessageBox.error(this._i18nModel.getText("stopsNotChangeable"), {
                    onClose:function(){
                        this.resetStopInputFields();
                    }.bind(this)
                });
            },

            showSendingSuccessfullMessage:function(){
                MessageToast.show(this._i18nModel.getText("successfullySend"), {
                    duration: 1000,
                    width:"15em",
                    onClose:this.resetStopInputFields()
                });
            }
        });
    });