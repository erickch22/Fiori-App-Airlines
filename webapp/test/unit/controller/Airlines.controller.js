/*global QUnit*/

sap.ui.define([
	"erickappairlines/eych_app/controller/Airlines.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Airlines Controller");

	QUnit.test("I should test the Airlines controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
