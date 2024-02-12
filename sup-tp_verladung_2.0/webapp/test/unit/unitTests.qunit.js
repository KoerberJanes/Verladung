/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sup-tp_verladung_2.0/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
