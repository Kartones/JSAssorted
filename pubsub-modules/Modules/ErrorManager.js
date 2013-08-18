function ErrorManager(messageBroker) {
    var self = this;
    var messageBroker = messageBroker;
    var config = {};

    this.init = function () {
        messageBroker.subscribe(ErrorManager.ErrorMessage, ErrorManager.moduleName, self.handleError);
    };

    this.destroy = function () {
        messageBroker.unsubscribe(ErrorManager.ErrorMessage, ErrorManager.moduleName);
    };

    this.configure = function (data) {
        config = data;
    };

    this.handleError = function (error) {
        if (ErrorManager.ErrorMessageDescriptionParam in error) {
            console.log(error[ErrorManager.ErrorMessageDescriptionParam]);
        }
    }
};

ErrorManager.moduleName = "errorManager";
ErrorManager.ErrorMessage = "error";
ErrorManager.ErrorMessageDescriptionParam = "description";