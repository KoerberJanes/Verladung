sap.ui.define([], function () {
    "use strict";

    return {

        registerNavigationHandler: function(callback){
            this._callbackFunction = callback;
            //console.log("Routing registered");
        },

        setGlobalValuables:function(bStopSequenceChangeable, bManuelInput, IvIdEumDev, IvIdTr, oRouter){
            this._bStopSequenceChangeable=bStopSequenceChangeable; 
            this._bManuelInput=Boolean(bManuelInput);
            this._IvIdEumDev=IvIdEumDev;
            this._IvIdTr=IvIdTr;
            this._oRouter=oRouter;
        },

        getNvesOfStop:function(oStop, oNveModel, oInterdepotModel){ //Stopp wird übergeben und die NVEs im Backend erfragt
            
            var sPathPos = "/GetFusLoadSet(IvIdEumDev='" + this._IvIdEumDev + "',IvIdTr='" + this._IvIdTr + "',IvNoStop='" + oStop.NoStop + "')"; // Id
            
            //!BackendAufruf auskommentiert da keine Anbindung in privatem VsCode
            
            // this.getView().getModel("TP_VERLADUNG_SRV").read(sPathPos, {

            //     urlParameters: {
            //         "$expand": "GetFusLoadToList/GetFusLoadListMatSet"
            //     },
        
            //     success: function (oData) {
            //         //Möglich, dass der Stopp keine NVEs hat?
            //         //Angenommen: Nein --> Weil Stops später übersprungen werden?
            //         var aoDataResults=oData.getProperty("/results");

            //         this.checkKindOfStop(aoDataResults);
                    

            //     }.bind(this),
            //     error: function(oError){
            //         //NOP
            //     }.bind(this)

            // });
            
           //////////////////////////////
            //TODO_5:Demonstrations-Fall
            //!In der normalen Anwendung wieder entfernen!
            //////////////////////////////
            var aoDataResults=[];
            

            for(var i=0; i<=2; i++){
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
                //Normale NVE test
                var oObject={
                    Description:"Ü-NVE_Demo_" +_ExidvCounter +" | 0000" +_ExidvCounter,
                    Exidv:"0000" +_ExidvCounter,
                    Customer:oStop.Name1,
                    children: aObjectArray,
                    FlgInterdepot: false
                }
                aoDataResults.push(oObject);
            }

            //Testfall
            //this.checkIfStopSequenceNeedsToBeUpdated();
            this.checkKindOfStop(aoDataResults, oNveModel, oInterdepotModel);
        },

        checkKindOfStop:function(aoDataResults, oNveModel, oInterdepotModel){
            if(aoDataResults[0].FlgInterdepot){ //Handelt sich um einen Interdepot-Stopp
                this.setNvesOfStop_InterdepotCase(aoDataResults, oInterdepotModel);
            } else{ //Handelt sich um einen Kunden-Stopp
                this.setNvesOfStop_CustomerCase(aoDataResults, oNveModel);
            }
        },

        setNvesOfStop_InterdepotCase:function(aoDataResults, oInterdepotModel){ //Hier werden alle Methoden für den Fall eines Interdepot Stopps abgehandelt
            //TODO: Aufbau der NVEs muss noch gemacht werden (also das TreeModel)
            oInterdepotModel.setProperty("/results", aoDataResults);
            this.navToInterdepotPage();
        },

        setNvesOfStop_CustomerCase:function(aoDataResults, oNveModel){ //Hier werden alle Methoden für den Fall eines Kunden Stopps abgehandelt
            //TODO: Aufbau der NVEs muss noch gemacht werden (also das TreeModel)
            oNveModel.setProperty("/results", aoDataResults);
            this.navToNveHandling();
        },

        navToInterdepotPage:function(){
            this._oRouter.navTo("RouteInterdepotTour",{
                sStopSequenceChangeable:this._bStopSequenceChangeable, 
                bManuelInput:this._bManuelInput,
                IvIdEumDev:this._IvIdEumDev,
                IvIdTr:this._IvIdTr
            });
        },

        navToNveHandling: function() {
            this._oRouter.navTo("RouteNveHandling",{ 
                sStopSequenceChangeable:this._bStopSequenceChangeable, 
                bManuelInput:this._bManuelInput, 
                IvIdEumDev:this._IvIdEumDev,
                IvIdTr:this._IvIdTr
            });
        }
        
    };
});

              