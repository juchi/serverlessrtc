var ServerlessRTC;
(function(ServerlessRTC) {
"use strict";

function Client() {
    this.pc = null;
    this.connection = null;
    this.channel = null;
    this.messageHandler = null;
    this.initConnection();
};
Client.prototype.initConnection = function(config) {
    config = config || ServerlessRTC.defaultConfiguration;
    this.connection = ServerlessRTC.Connection.create(config);
    this.connection.init(function(e) {this.channel = e.channel; initClientChannel(this);}.bind(this));
    this.pc = this.connection.pc;
};
Client.prototype.initDataChannel = function(name) {
    this.channel = this.pc.createDataChannel(name);
    initClientChannel(this);
    this.connection.initiate(ServerlessRTC.displayLocalOffer)
};
Client.prototype.joinConnection = function(token) {
    token = JSON.parse(token);
    this.connection.join(token, ServerlessRTC.displayLocalAnswer);
};
Client.prototype.validateConnection = function(token) {
    token = JSON.parse(token);
    this.connection.validate(token);
};
Client.prototype.sendMessage = function(message) {
    if (!this.channel) {
        ServerlessRTC.errorDisplay('The connection has not yet been established.');
        return;
    }
    this.channel.send(message);
};
Client.prototype.receiveMessage = function(message) {
    this.messageHandler.receive(message);
};
Client.prototype.setMessageHandler = function(handler) {
    this.messageHandler = handler;
};

function initClientChannel(client) {
    var channel = client.channel;
    channel.onopen    = function(){console.log('data channel open')};
    channel.onmessage = function(e){client.receiveMessage(e.data);};
    channel.onclose   = function(){console.log('data channel close')};
    channel.onerror   = function(){console.log('data channel error')};
}

ServerlessRTC.Client = Client;
}(ServerlessRTC || (ServerlessRTC = {})));
