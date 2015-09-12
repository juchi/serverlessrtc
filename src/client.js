var ServerlessRTC;
(function(ServerlessRTC) {
"use strict";

function Client() {
    this.pc = null;
    this.channel = null;
    this.messageHandler = null;
    this.initConnection();
};
Client.prototype.initConnection = function(config) {
    config = config || ServerlessRTC.defaultConfiguration;
    this.pc = createConnection(this, this.config);
};
Client.prototype.initDataChannel = function(name) {
    this.channel = this.pc.createDataChannel(name);
    initClientChannel(this);
    ServerlessRTC.ConnectionHandler.initConnection(this.pc, ServerlessRTC.displayLocalOffer)
};
Client.prototype.joinConnection = function(token) {
    token = JSON.parse(token);
    ServerlessRTC.ConnectionHandler.joinConnection(this.pc, token, ServerlessRTC.displayLocalAnswer);
};
Client.prototype.validateConnection = function(token) {
    token = JSON.parse(token);
    ServerlessRTC.ConnectionHandler.validateConnection(this.pc, token);
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

function createConnection(client, configuration) {
    var pc = new ServerlessRTC.RTCPeerConnection(configuration);
    pc.ondatachannel = function(e) {
        client.channel = e.channel;
        initClientChannel(client);
    };
    pc.onicecandidate = function(e) {
        // only refresh the token for the client initiating the connection
        if (pc.iceConnectionState == 'new') {
            ServerlessRTC.displayLocalOffer(pc.localDescription);
        }
    };
    pc.oniceconnectionstatechange = function(e) {
        console.log(e);
    };

    return pc;
}

function initClientChannel(client) {
    var channel = client.channel;
    channel.onopen    = function(){console.log('data channel open')};
    channel.onmessage = function(e){client.receiveMessage(e.data);};
    channel.onclose   = function(){console.log('data channel close')};
    channel.onerror   = function(){console.log('data channel error')};
}

ServerlessRTC.Client = Client;
}(ServerlessRTC || (ServerlessRTC = {})));
