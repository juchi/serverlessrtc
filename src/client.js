var ServerlessRTC;
(function(ServerlessRTC) {
"use strict";

function Client() {
    this.pc = null;
    this.initConnection();
};
Client.prototype.initConnection = function(config) {
    config = config || ServerlessRTC.defaultConfiguration;
    this.pc = createConnection(config);
};
Client.prototype.initDataChannel = function(name) {
    var channel = this.pc.createDataChannel(name);
    initChannel(channel);
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

function createConnection(configuration) {
    var pc = new ServerlessRTC.RTCPeerConnection(configuration);
    pc.ondatachannel = function(e) {
        initChannel(e.channel);
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

function initChannel(channel) {
    channel.onopen    = function(){console.log('data channel open')};
    channel.onmessage = function(e){console.log('data channel message', e)};
    channel.onclose   = function(){console.log('data channel close')};
    channel.onerror   = function(){console.log('data channel error')};
}

ServerlessRTC.Client = Client;
}(ServerlessRTC || (ServerlessRTC = {})));
