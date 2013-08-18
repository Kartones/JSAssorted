function SampleModule2(messageBroker) {
    var self = this;
    var messageBroker = messageBroker;
    var config = {};

    this.init = function () {
        messageBroker.subscribe(SampleModule2.writeSomethingFromOtherModule, SampleModule2.moduleName, self.writeSomethingFromOtherModule);
    };

    this.destroy = function () {
        messageBroker.unsubscribe(SampleModule2.writeSomethingFromOtherModule, SampleModule2.moduleName);
    };

    this.configure = function (data) {
        config = data;
    };

    this.writeSomethingFromOtherModule = function () {
        // Here instead of writing what sent in the message, retrieve from the config and publish an error message if missing stuff
        if ("text" in config && "messageChannel" in config) {
            messageBroker.publish(config.messageChannel, {
                text: config.text
            });
        } else {
            messageBroker.publish(ErrorManager.ErrorMessage, {
                description : "SampleModule2 missing config!"
            });
        }
    };
};

SampleModule2.moduleName = "sample2";
SampleModule2.writeSomethingFromOtherModule = "writeSomethingFromOtherModule";