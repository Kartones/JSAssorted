function SampleModule(messageBroker) {
    var self = this;
    var messageBroker = messageBroker;
    var config = {};

    this.init = function () {
        messageBroker.subscribe(SampleModule.writeSomethingMessage, SampleModule.moduleName, self.writeSomething);
    };

    this.destroy = function () {
        messageBroker.unsubscribe(SampleModule.writeSomethingMessage, SampleModule.moduleName);
    };

    this.configure = function (data) {
        config = data;
    };

    this.writeSomething = function (message) {
        if ("text" in message) {
            console.log(message.text);
        }
    };
};

SampleModule.moduleName = "sample";
SampleModule.writeSomethingMessage = "writeSomething";