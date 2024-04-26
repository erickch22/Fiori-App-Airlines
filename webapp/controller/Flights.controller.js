sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel) {
        "use strict";

        return Controller.extend("erick.app.airlines.eychapp.controller.Flights", {
            onInit: function () {
                var oRouter = this.getRouter();
                oRouter.getRoute("flights").attachMatched(this._onObjectMatched, this);
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
                    this.getRouter().navTo("TargetAirlines", true);
                }
            },

            _onObjectMatched: function (oEvent) {
                var oArgs = oEvent.getParameter("arguments");
                this._sCarrierId = oArgs.airlineId;
                var oView = this.getView();
            
                oView.bindElement({
                    path: "/UX_C_Carrier_TP('" + this._sCarrierId + "')",
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function () {
                            oView.setBusy(true);
                        },
                        dataReceived: function () {
                            oView.setBusy(false);
                        }
                    }
                });
            
                var oModel = this.getView().getModel();
                oModel.read("/UX_C_Connection_TP", {
                    success: function (oData) {
                        var model = new sap.ui.model.json.JSONModel();
                        model.setData(oData.results);
                        this.getView().setModel(model, "ConnectionModel");
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error to connect with SAP");
                    }.bind(this)
                });
            },

            _onBindingChange: function () {
                var oElementBinding;

                oElementBinding = this.getView().getElementBinding();
                if (oElementBinding && !oElementBinding.getBoundContext()) {
                    this.getRouter().getTargets().display("notFound");
                }
            },


            // onPressDetail: function (e){
            //     var item = e.getSource();
            //     var oContx = item.getBindingContext();
            //     var aConn= oContx.getProperty("Connid");
            //     var airId = oContx.getProperty("Carrid");

            //     this.getRouter().navTo("Details", {
            //         airlineId: airId,
            //     }, false);
            // }

            onDetailView: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext();
                var oFlightData = oContext.getObject();
            
                var oModel = this.getView().getModel("ConnectionModel");
                var aFilteredData = oModel.getProperty("/").filter(function(item) {
                    return item.Connid === oFlightData.Connid;
                });
            
                var oFilteredModel = new sap.ui.model.json.JSONModel(aFilteredData);
                this.getView().setModel(oFilteredModel, "FilteredConnectionModel");
            
                if (!this.pDetail) {
                    this.pDetail = this.loadFragment({
                        name: "erick.app.airlines.eychapp.view.Detail",
                        data: {
                            flightData: oFlightData
                        }
                    });
                }
            
                this.pDetail.then(function (oDialog) {
                    oDialog.open();
                });
            },
            
            

            onCloseDetail: function () {
                this.byId("detailFragment").close();
            }
        });
    });
