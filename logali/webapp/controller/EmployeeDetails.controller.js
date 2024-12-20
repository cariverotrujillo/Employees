sap.ui.define([
    "logaligroup/logali/controller/Base.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/m/MessageBox"
],
    function (Base, Filter, FilterOperator, formatter, MessageBox) {
        "use strict";

        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
        }
        function createIncidence() {
            var tableIncidence = this.getView().byId("TableIncidence")
            var newIncidence = sap.ui.xmlfragment("logaligroup.logali.fragment.NewIncidence", this)
            var incidenceModel = this.getView().getModel("incidenceModel")
            var odata = incidenceModel.getData()
            var index = odata.length
            odata.push({ index: index + 1, _ValidateDate: false, enabledSave: false })
            incidenceModel.refresh()
            newIncidence.bindElement("incidenceModel>/" + index)
            tableIncidence.addContent(newIncidence)

        }
        function DeleteIcidence(oEvent) {
            var tableIncidence = this.getView().byId("TableIncidence")
            var rowIncidence = oEvent.getSource().getParent().getParent()
            var incidenceModel = this.getView().getModel("incidenceModel")
            var odata = incidenceModel.getData()
            var oContext = rowIncidence.getBindingContext("incidenceModel")

            odata.splice(oContext.index - 1, 1)
            for (var i in odata) {
                odata[i].index = parseInt(i) + 1
            }
            incidenceModel.refresh()
            tableIncidence.removeContent(rowIncidence)

            for (var j in tableIncidence.getContent()) {
                tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j)

            }

        }
        function onSaveIncidence(oEvent) {

            var incidence = oEvent.getSource().getParent().getParent()
            var rowIncidence = incidence.getBindingContext("incidenceModel")

            this._bus.publish("incidence", "onSaveIncidence", { rowIncidence: rowIncidence.sPath.replace('/', '') })

        }
        function updateCreatetionDate(oEvent) {
            let context = oEvent.getSource().getBindingContext("incidenceModel")
            let contextObj = context.getObject()
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle()

            if (!oEvent.getSource().isValidValue()) {
                contextObj._ValidateDate = false
                contextObj.CreationDateState = "Error"
                MessageBox.error(oResourceBundle.getText("InvalidDate"), {
                    title: "error",
                    onClose: null,
                    styleClass: "",
                    actions: MessageBox.Action.Close,
                    emphasizedAction: null,
                    initialFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit
                })
            } else {
                contextObj.CreationDateX = true
                contextObj._ValidateDate = true
                contextObj.CreationDateState = "None"
            }
            if (oEvent.getSource().isValidValue() && contextObj.Reason) {
                contextObj.enabledSave = true
            } else {
                contextObj.enabledSave = false
            }
            context.getModel().refresh()

        }
        function updateReason(oEvent) {

            let context = oEvent.getSource().getBindingContext("incidenceModel")
            let contextObj = context.getObject()

            if (oEvent.getSource().getValue()) {
                contextObj.ReasonX = true
                contextObj.ReasonState = "None"
            } else {
                contextObj.ReasonState = "Error"

            }

            if (contextObj._ValidateDate && oEvent.getSource().getValue()) {
                contextObj.enabledSave = true
            } else {
                contextObj.enabledSave = false
            }
            context.getModel().refresh()

        }
        function updateType(oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel")
            var contextObj = context.getObject()
            contextObj.TypeX = true

            if (contextObj._ValidateDate && contextObj.Reason) {
                contextObj.enabledSave = true
            } else {
                contextObj.enabledSave = false
            }
            context.getModel().refresh()
        }
        function DeleteIcidence(oEvent) {

            var context = oEvent.getSource().getBindingContext("incidenceModel").getObject()
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle()

            MessageBox.confirm(oResourceBundle.getText("ConfirmDelete"), {
                onClose: function (oAction) {
                    if (oAction === "OK") {
                        this._bus.publish("incidenceDele", "onDeleteIncidence", {
                            IncidenceId: context.IncidenceId,
                            SapId: context.SapId,
                            EmployeeId: context.EmployeeId
                        })
                    }
                }.bind(this)
            })

        }

        var main = Base.extend("logaligroup.logali.controller.EmployeeDetails", {});
        main.prototype.onInit = onInit;
        main.prototype.createIncidence = createIncidence;
        main.prototype.Formatter = formatter;
        main.prototype.DeleteIcidence = DeleteIcidence;
        main.prototype.onSaveIncidence = onSaveIncidence;
        main.prototype.updateCreatetionDate = updateCreatetionDate;
        main.prototype.updateReason = updateReason;
        main.prototype.updateType = updateType;
        main.prototype.DeleteIcidence = DeleteIcidence;
        return main
    });