sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";

    return {
        
        getNvesOfStop:function(oStop, _IvIdEumDev, _IvIdTr, oResponseModel){ //Stopp wird übergeben und die NVEs im Backend erfragt
            
            var sPathPos = "/GetFusLoadSet(IvIdEumDev='" + _IvIdEumDev + "',IvIdTr='" + _IvIdTr + "',IvNoStop='" + oStop.NoStop + "')"; // Id
            
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
            this.setKindOfStop(aoDataResults, oResponseModel);
        },

        setKindOfStop:function(aoDataResults, oResponseModel){

            if(aoDataResults[0].FlgInterdepot){ //Handelt sich um einen Interdepot-Stopp
                oResponseModel.isInterdepot=true;
            } else{ //Handelt sich um einen Kunden-Stopp
                oResponseModel.isInterdepot=false;
            }
            oResponseModel.setProperty("/results", []); //Nur zur SIcherheit, dass keine "Reste" mehr vorhanden sind
            oResponseModel.setProperty("/results", aoDataResults); //GGf wird hier implizit schon das Array überschrieben
        },
        
    };
});

              