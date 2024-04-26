sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("erick.app.airlines.eychapp.controller.Airlines", {
            onInit: function () {

            },

            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },

            onPress: function (e) {
                var item = e.getSource();
                var oContx = item.getBindingContext();
                var airId = oContx.getProperty("Carrid");

                this.getRouter().navTo("flights", {
                    airlineId: airId
                }, false);
            },

            onFiltrarCode: function (){
                var aFilter = [];
                var vAirline = "";
                var vCode = "";
                var oModel = this.getView().getModel();
            
                if (this.getView().byId("codeAirline").getSelectedKey()) {
                    vCode = this.getView().byId("codeAirline").getSelectedKey();
                    if (vCode !== "") {
                        aFilter.push(new Filter("Carrid", "EQ", vCode));
                    }
                }

                if (this.getView().byId("nameAirline").getValue()) {
                    vAirline = this.getView().byId("nameAirline").getValue();
                    aFilter.push(new Filter("Carrname", sap.ui.model.FilterOperator.Contains, vAirline));
                }
            
                this.getView().byId("tableAirlines").setBusy(true);
                oModel.read("/UX_C_Carrier_TP", {
                    filters: aFilter,
                    success: function(oData){
                        if (oData.results && oData.results.length > 0) {
                            var filteredModel = new sap.ui.model.json.JSONModel();
                            filteredModel.setProperty("/UX_C_Carrier_TP", oData.results);
                            this.getView().byId("tableAirlines").setModel(filteredModel);
                        }
                        this.getView().byId("tableAirlines").setBusy(false);
                    }.bind(this),
                    error: function(){
                        sap.m.MessageToast.show("Error to connect with SAP");
                        this.getView().byId("tableAirlines").setBusy(false);
                    }.bind(this)
                });
            },
            onRefresh: function() {
               
                this.getView().byId("nameAirline").setValue("");
                this.getView().byId("codeAirline").setSelectedKey("");
                
                this.onFiltrarCode();
            }
            
        });
    });