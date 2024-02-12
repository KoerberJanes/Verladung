/*global QUnit*/

sap.ui.define([
	"sup-tp_verladung_2.0/controller/Tour.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Tour Controller");

	QUnit.test("I should test the Tour controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
