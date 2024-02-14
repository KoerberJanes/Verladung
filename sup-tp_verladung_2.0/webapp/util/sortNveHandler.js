sap.ui.define([
	"sap/ui/base/ManagedObject"
], function(ManagedObject) {
	"use strict";

	return ManagedObject.extend("suptpverladung2.0.util.sortNveHandler", {
        //!Wird die Aufgabe übernehmen, den NVEs eine Hierarchie zu geben und sie zu Sortieren


        setAttributesForLoading:function(aRecievedNves, i18nModel){ //! Schwerer Teil, nochmal genau prüfen

            for(var i in aRecievedNves){
                //if-else Statement notwendig weil Ü-NVEs keine Menge/Artikelbezeichnung haben
                if(aRecievedNves[i].GetFusLoadListMatSet.results.length!==0){
                    let oRecievedNve=aRecievedNves[i].GetFusLoadListMatSet.results[0];
                    aRecievedNves[i].MatDesc = oRecievedNve.Description;
                    aRecievedNves[i].Quantity = oRecievedNve.Quantity.substring(0, oRecievedNve.Quantity.lastIndexOf("."));

                    aRecievedNves[i].aInfos = {};
                    aRecievedNves[i].aInfos.Description = "";
                    aRecievedNves[i].aInfos.Description = oRecievedNve.Description;
                } else{
                    aRecievedNves[i].MatDesc = "";
                    aRecievedNves[i].Quantity = "";

                    aRecievedNves[i].aInfos = {};
                    aRecievedNves[i].aInfos.Description = "";
                    aRecievedNves[i].aInfos.Description = i18nModel.getText("uNvesAnzeigen");
                }
                delete aRecievedNves[i].GetFusLoadListMatSet;
            }
            this.setNewAttributesForNves(aRecievedNves);
        },

        setAttributesForClearing:function(aRecievedNves, i18nModel){ //! Schwerer Teil, nochmal genau prüfen

            for(var i in aRecievedNves){
                //if-else Statement notwendig weil Ü-NVEs keine Menge/Artikelbezeichnung haben
                if(aRecievedNves[i].GetFusClearListToMat.results.length !== 0){
                    let oRecievedNve=aRecievedNves[i].GetFusLoadListMatSet.results[0];
                    aRecievedNves[i].MatDesc = "";
                    aRecievedNves[i].MatDesc = oRecievedNve.Description;
                    aRecievedNves[i].Quantity = ""; //Bisher keine Backend-Daten

                    aRecievedNves[i].aInfos = {};
                    aRecievedNves[i].aInfos.Description = "";
                    aRecievedNves[i].aInfos.Description = oRecievedNve.Description;
                } else{
                    aRecievedNves[i].MatDesc = "";
                    aRecievedNves[i].Quantity = "";
                    //aRecievedNves[i].Packmittel = "";
                    aRecievedNves[i].aInfos = {};
                    aRecievedNves[i].aInfos.Description = "";
                    aRecievedNves[i].aInfos.Description = i18nModel.getText("uNvesAnzeigen");
                }
                delete aRecievedNves[a].GetFusClearListToMat;
            }
            this.setNewAttributesForNves(aRecievedNves);
        },

        setNewAttributesForNves:function(aRecievedNves){ //! Schwerer Teil, nochmal genau prüfen
            //Neue Attribute Setzen, die benötigt werden
            for (var i in aRecievedNves) {
                aRecievedNves[i].NodeID = this.NodeID,
                aRecievedNves[i].HierarchyLevel = this.HierarchyLevel;
                aRecievedNves[i].ParentNodeID = 0;
                aRecievedNves[i].DrillState = "expanded";
                aRecievedNves[i].Children = [];
                this.NodeID++;
                //Löschen der Metadata Informatinoen weil der Tree-renderer die Metadaten als eigenen Node erkennt
                delete aRecievedNves[i].__metadata;
            }

            this.sortDifferentNveTypes(aRecievedNves);
        },

        sortDifferentNveTypes:function(aRecievedNves){ //! Schwerer Teil, nochmal genau prüfen
            var aLowerNves = []; //Bestätigte U-NVEs
            var aUpperNves = []; //Bestätigte Ü-NVEs
            var aEitherUpperOrUnpackedNves=[]; //Ü-Nve oder nicht eingepackte U-Nve
            var aPackedLowerNves=[]; //Bestätigte eingepackte U-Nves
            
            for(var i in aRecievedNves){ //Filtern zwischen Ü-Nves und möglichen U-Nves
                if(aRecievedNves[i].UpperIdFu === "0000000000"){ //Wenn nicht eingepackt 
                    aEitherUpperOrUnpackedNves.push(aRecievedNves[i]);
                } else{ //Wenn eingepackt
                    aPackedLowerNves.push(aRecievedNves[i]);
                }
            }

            this.differentiatePackedAndUnpackedNves(aLowerNves, aUpperNves, aEitherUpperOrUnpackedNves, aPackedLowerNves);
        },

        differentiatePackedAndUnpackedNves:function(aLowerNves, aUpperNves, aEitherUpperOrUnpackedNves, aPackedLowerNves){ //! Schwerer Teil, nochmal genau prüfen
            for(var i in aEitherUpperOrUnpackedNves){
                for(var j in aPackedLowerNves){
                    if(aEitherUpperOrUnpackedNves[i].IdFu === aPackedLowerNves[j].UpperIdFu){ //Nve ist verpackt, muss also in Children
                        aPackedLowerNves[j].ParentNodeID=aEitherUpperOrUnpackedNves[i].NodeID; //!Prüfen ob das so passt
                        aPackedLowerNves[j].HierarchyLevel++;
                        aEitherUpperOrUnpackedNves[i].Children.push(aPackedLowerNves[j]);
                    }
                }
            }

            //Nur zur sicherheit, für den Fall, dass hier 3 mal verpackt wurde.
            for(var x in aEitherUpperOrUnpackedNves){
                for(var y in aEitherUpperOrUnpackedNves[x].Children){
                    for(var z in aPackedLowerNves){
                        if(aEitherUpperOrUnpackedNves[x].Children[y].IdFu === aPackedLowerNves[z].UpperIdFu){
                            aEitherUpperOrUnpackedNves[x].Children[y].Children.push(aPackedLowerNves[z]);
                        }
                    }
                }
            }
            //aEitherUpperOrUnpackedNves enthält inzwischen nur U-Nves
            this.SortUpperAndLowerNvesInFinalArrays(aLowerNves, aUpperNves, aEitherUpperOrUnpackedNves, aPackedLowerNves);
        },

        SortUpperAndLowerNvesInFinalArrays:function(aLowerNves, aUpperNves, aEitherUpperOrUnpackedNves, aPackedLowerNves){ //! Schwerer Teil, nochmal genau prüfen

            for(var i in aEitherUpperOrUnpackedNves){ 
                if(aEitherUpperOrUnpackedNves[i].Children.length>0){//Wenn in eine Nve etwas eibgepackt wurde --> Über-Nve
                    aUpperNves.push(aEitherUpperOrUnpackedNves[i]);
                } else{ //Eine Leere NVE --> Unter-Nve
                    aEitherUpperOrUnpackedNves[i].DrillState="leaf";
                    aLowerNves.push(aEitherUpperOrUnpackedNves[i]);
                }
            }
            this.CreateResultArray(aUpperNves, aLowerNves);
        },

        CreateResultArray:function(aUpperNves, aLowerNves){ //! Schwerer Teil, nochmal genau prüfen
            var aResultArray=[];

            aResultArray.concat(aUpperNves, aLowerNves);
            this.deleteUnnessecaryArrays(aResultArray, aUpperNves);
        },

        deleteUnnessecaryArrays:function(aResultArray, aUpperNves){ //! Schwerer Teil, nochmal genau prüfen
            for(var i in aResultArray){ //Löschen des Child-Arrays für die Ü-Nves
                if(aResultArray[i].Children.length===0){
                    delete aResultArray[i].Children;
                } else{ //Prüfen ob mehrfach verpackt wurde und dort dann das Child-Array löschen
                    for(var j in aResultArray[i].Children){
                        if(aResultArray[i].Children[j].Children.length===0){
                            delete aResultArray[i].Children[j].Children;
                        }
                    }
                }
            }
            this.NodeID=0; //Zurücksetzen der Id für die Zuweiseungen innerhalb der Nves
            this.treeModelLowerNveCount(aResultArray, aUpperNves)
        },

        treeModelLowerNveCount:function(aResultArray, aUpperNves){ //! Schwerer Teil, nochmal genau prüfen
            for(var i in aUpperNves){
                var iQuantityOfLowerNves=aUpperNves[i].Children.length;
                aUpperNves.Description.concat(" (" + iQuantityOfLowerNves+")");
            }

            this.setTreeModel(aResultArray);
        },

        setTreeModel:function(aResultArray){ //! Schwerer Teil, nochmal genau prüfen
            //Setzen der Nves in das Model, dass angezeigt werden soll.
            var oPage=this.getView().byId("wizardNavContainer").getCurrentPage();
            var sIdDisplayedPage=oPage.sId.substring(oPage.sId.lastIndexOf("-")+1, oPage.sId.length);

            switch (sIdDisplayedPage) {
                case "nveHandlingPage":
                    this.getView().getModel("NVEs").setProperty("/results", []);
                    this.getView().getModel("NVEs").setProperty("/results", aResultArray);
                    break;
                case "interdepotNvePage":
                    this.getView().getModel("InterdepotNVEs").setProperty("/results", []);
                    this.getView().getModel("InterdepotNVEs").setProperty("/results", aResultArray);
                    break;
                case "closingPage":
                    this.getView().getModel("ClosingNves").setProperty("/results", []);
                    this.getView().getModel("ClosingNves").setProperty("/results", aResultArray);
                    break;
                    
                default:
                    break;
            }
        },
	});
});