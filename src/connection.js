var ServerlessRTC;
(function(ServerlessRTC) {
"use strict";

function Connection(configuration) {
    this.pc = new ServerlessRTC.RTCPeerConnection(configuration);
    this.channel = null;
    this.onreceivemessage = null;
}

Connection.create = function(configuration) {
    return new Connection(configuration);
};

// Initialize the underlying peer connection
Connection.prototype.init = function(oniceconnectionstatechange) {
    var pc = this.pc;
    var self = this;
    pc.ondatachannel = this.onDataChannel.bind(this);
    pc.onicecandidate = function(e) {
        // only refresh the token for the client initiating the connection
        if (pc.iceConnectionState == 'new') {
            self.onLocalOffer(pc.localDescription);
        }
    };
    pc.oniceconnectionstatechange = oniceconnectionstatechange;
};

Connection.prototype.onDataChannel = function(e) {
    this.channel = e.channel;
    initChannel(this);
};

function initChannel(connection) {
    var channel = connection.channel;
    channel.onopen    = function(){console.log('data channel open')};
    channel.onmessage = function(e){connection.onreceivemessage(e.data);};
    channel.onclose   = function(){console.log('data channel close')};
    channel.onerror   = function(){console.log('data channel error')};
}


// Create an offer in order to start a new peer session
Connection.prototype.initiate = function() {
    this.channel = this.pc.createDataChannel(name);
    initChannel(this);

    var pc = this.pc;
    var self = this;
    pc.createOffer(function(offer) {
        pc.setLocalDescription(offer, function() {
            self.onLocalOffer(pc.localDescription);
        }, ServerlessRTC.errorDisplay);
    }, ServerlessRTC.errorDisplay);
};

Connection.prototype.join = function(offer) {
    var pc = this.pc;
    var self = this;
    var offerDesc = new ServerlessRTC.RTCSessionDescription(offer);
    pc.setRemoteDescription(offerDesc, function(){}, ServerlessRTC.errorDisplay);
    pc.createAnswer(function(answer) {
        pc.setLocalDescription(answer, function() {
            self.onLocalAnswer(pc.localDescription);
        }, ServerlessRTC.errorDisplay);
    }, ServerlessRTC.errorDisplay);
};

Connection.prototype.validate = function(answer) {
    var answerDesc = new ServerlessRTC.RTCSessionDescription(answer);
    this.pc.setRemoteDescription(answerDesc, function(){}, ServerlessRTC.errorDisplay);
};


Connection.prototype.sendMessage = function(message) {
    if (!this.channel) {
        ServerlessRTC.errorDisplay('The connection has not yet been established.');
        return;
    }
    this.channel.send(message);
};

ServerlessRTC.Connection = Connection;
}(ServerlessRTC || (ServerlessRTC = {})));
