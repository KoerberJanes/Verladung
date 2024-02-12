sap.ui.define([], function () {
    "use strict";

    const prefix = "A";
    const suffix = "E";
    const timeoutLength = 5000; // in ms

    let scanning = false;
    let scannedValue = "";
    let timeoutId;

    return {
        activateScan: function(){
            scanning = true;
            console.log("Scan activated");
        },
        deactivateScan: function(){
            scanning = false;
            if (this.callbackFunction) {
                this.callbackFunction(scannedValue);
            }
            console.log("Scan deactivated, Scanned value:", scannedValue);
            scannedValue = ""; 
            
            this.endTimeout();
        },
        startTimeout: function(){
            console.log("Timeout started: " + timeoutLength + "ms");
            timeoutId = setTimeout(() => {
                sap.m.MessageBox.error("Scan aborted: Timeout exceeded");
                console.error("Scan aborted: Timeout exceeded");
                scannedValue = ""; 
                scanning=false;
            }, timeoutLength);
        },
        endTimeout: function(){
            clearTimeout(timeoutId);
        },
        registerScanner: function(callback){
            this.callbackFunction = callback;
            document.addEventListener("keypress", this.handleKeyDown.bind(this));
            console.log("Scanner registered");
        },
        unregisterScanner: function(){
            document.removeEventListener("keypress", this.handleKeyDown.bind(this));
            console.log("Scanner unregistered");
        },
        handleKeyDown: function(event){
            if (scanning) {
                if (event.key === suffix) {
                    this.deactivateScan();
                } else {
                    scannedValue += event.key;
                }
            } else if (event.key === prefix) {
                this.activateScan();
                this.startTimeout();
            }
        },
        clearData: function(){
            scannedValue = "";
            console.log("Data cleared");
        },
        isScanning: function(){
            console.log("Is scanning:", scanning);
            return scanning;
        }
    };
});
