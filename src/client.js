var ServerlessRTC;
(function(ServerlessRTC) {
"use strict";

function Client() {
    this.connection = null;
    this.channel = null;
    this.messageHandler = null;
};
Client.prototype.createConnection = function(config) {
    config = config || ServerlessRTC.defaultConfiguration;
    this.connection = ServerlessRTC.Connection.create(config);
    this.connection.onreceivemessage = this.receiveMessage.bind(this);
    this.connection.onLocalOffer = this.onLocalOffer;
    this.connection.onLocalAnswer = this.onLocalAnswer;
    this.connection.init(this.onConnectionStateChange.bind(this));
};

Client.prototype.onConnectionStateChange = function(e) {
    this.showStatus(e.target.iceConnectionState);
};
Client.prototype.initConnection = function() {
    this.connection.initiate();
};
Client.prototype.joinConnection = function(token) {
    this.connection.join(token);
};
Client.prototype.validateConnection = function(token) {
    this.connection.validate(token);
};

Client.prototype.sendMessage = function(message) {
    this.connection.sendMessage(message);
};
Client.prototype.receiveMessage = function(message) {
    if (this.messageHandler) {
        this.messageHandler.receive(message);
    } else {
        console.error('No message handler has been defined for this client.');
    }
};
Client.prototype.setMessageHandler = function(handler) {
    this.messageHandler = handler;
};

Client.prototype.showStatus = function(status) {
    document.getElementById('status').textContent = status;
};

ServerlessRTC.Client = Client;
}(ServerlessRTC || (ServerlessRTC = {})));
