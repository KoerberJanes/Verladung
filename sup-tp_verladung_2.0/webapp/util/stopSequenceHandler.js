sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/BadgeCustomData",
    "sap/ui/model/json/JSONModel"
], function(
	ManagedObject,
	BadgeCustomData,
    JSONModel
) {
	"use strict";

	return {

        chekIfStopSequenceChangeable:function(oUserSettingsModel, oStopOrderChangeAllowedModel){ //Prüfen ob die Stopreihenfolge generell geändert werden darf

            if(oUserSettingsModel.bStopSequenceChangeable===true){
                oStopOrderChangeAllowedModel.bStopOrderChangeGeneralyAllowed=true;
            } else{
                oStopOrderChangeAllowedModel.bStopOrderChangeGeneralyAllowed=false;
            }
        },

        checkIfNvesAreLoaded:function(aLoadedNves, oStopOrderChangeAllowedModel){ //Prüfen ob Nves verladen sind und deshalb nicht geändert werden darf

            if(aLoadedNves.length===0){
                oStopOrderChangeAllowedModel.bStopOrderChangeAllowedDueToNoNves=true;
            } else{
                oStopOrderChangeAllowedModel.bStopOrderChangeAllowedDueToNoNves=false;
            }
        },
	};
});