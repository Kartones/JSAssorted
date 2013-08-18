function MessageBroker(core) {
    var self = this;
    var core = core;

    var subscriptions = {};

    this.publish = function (messageName, messageData) {
        if (messageName in subscriptions) {
            for (var handler in subscriptions[messageName]) {
                subscriptions[messageName][handler](messageData);
            }
        }
    };

    this.subscribe = function (messageName, moduleName, handler) {
        if (!(messageName in subscriptions)) {
            subscriptions[messageName] = {};
        }
        subscriptions[messageName][moduleName] = handler;
    };

    this.unsubscribe = function (messageName, moduleName) {
        if (messageName in subscriptions) {
            if (moduleName in subscriptions[messageName]) {
                delete subscriptions[messageName][moduleName];
            }
        }
    };
}