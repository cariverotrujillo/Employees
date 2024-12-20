sap.ui.define([],

    function () {
        "use strict"
        return {
            dateFormat: function (date) {
                var timeDay = 24 * 60 * 60 * 1000
                if (date) {
                    var dateNow = new Date()
                    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy/MM/dd" })
                    var dateNowFormat = new Date(dateFormat.format(dateNow))

                    const resourceBundle = this.getView().getModel("i18n").getResourceBundle()
                    switch (true) {
                        case date.getTime() === dateNowFormat.getTime(): return resourceBundle.getText("Today");
                        case date.getTime() === dateNowFormat.getTime() + timeDay: return resourceBundle.getText("Tomorrow");
                        case date.getTime() === dateNowFormat.getTime() - timeDay: return resourceBundle.getText("Yesterday");
                        default: return "";
                    }
                }
            }
        }
    }

);