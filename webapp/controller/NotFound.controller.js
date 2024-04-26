sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("erick.app.airlines.eychapp.controller.NotFound", {
            onInit: function () {
            },


            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },


            onNavBack: function () {
                var oHistory, sPreviousHash;

                oHistory = sap.ui.core.routing.History.getInstance();
                sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getRouter().navTo("TargetAirlines", true /*no history*/);
                }
            }


        });
    });
