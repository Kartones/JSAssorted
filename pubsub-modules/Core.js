function Core() {
    var self = this;

    var modules = {};

    this.messageBroker;

    var init = function() {
        self.messageBroker = new MessageBroker(self);
    };

    this.register = function (moduleName, module) {
        if (!(moduleName in modules)) {
            modules[moduleName] = new module(self.messageBroker);
        }
        return self;
    };

    this.unregister = function (moduleName) {
        if (moduleName in modules) {
            delete modules[moduleName];
        }
        return self;
    };

    this.start = function (moduleName) {
        if (moduleName in modules) {
            modules[moduleName].init();
        }
        return self;
    };

    this.stop = function (moduleName) {
        if (moduleName in modules) {
            modules[moduleName].destroy();
        }
        return self;
    };

    this.configure = function (moduleName, data) {
        if (moduleName in modules) {
            modules[moduleName].configure(data);
        }
        return self;
    };

    init();
}