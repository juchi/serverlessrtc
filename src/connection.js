var ServerlessRTC;
(function(ServerlessRTC) {
"use strict";

function Connection(configuration) {
    this.pc = new ServerlessRTC.RTCPeerConnection(configuration);
}

Connection.create = function(configuration) {
    return new Connection(configuration);
};

// Initialize the underlying peer connection
Connection.prototype.init = function(ondatachannel) {
    var pc = this.pc;
    pc.ondatachannel = ondatachannel;
    pc.onicecandidate = function(e) {
        // only refresh the token for the client initiating the connection
        if (pc.iceConnectionState == 'new') {
            ServerlessRTC.displayLocalOffer(pc.localDescription);
        }
    };
    pc.oniceconnectionstatechange = function(e) {
        console.log(e);
    };
};

// Create an offer in order to start a new peer session
Connection.prototype.initiate = function(descriptionCallback) {
    var pc = this.pc;
    pc.createOffer(function(offer) {
        pc.setLocalDescription(offer, function() {
            descriptionCallback(pc.localDescription);
        }, ServerlessRTC.errorDisplay);
    }, ServerlessRTC.errorDisplay);
};

Connection.prototype.join = function(offer, descriptionCallback) {
    var pc = this.pc;
    var offerDesc = new ServerlessRTC.RTCSessionDescription(offer);
    pc.setRemoteDescription(offerDesc, function(){}, ServerlessRTC.errorDisplay);
    pc.createAnswer(function(answer) {
        pc.setLocalDescription(answer, function() {
            descriptionCallback(pc.localDescription);
        }, ServerlessRTC.errorDisplay);
    }, ServerlessRTC.errorDisplay);
};
Connection.prototype.validate = function(answer) {
    var answerDesc = new ServerlessRTC.RTCSessionDescription(answer);
    this.pc.setRemoteDescription(answerDesc, function(){}, ServerlessRTC.errorDisplay);
};

ServerlessRTC.Connection = Connection;
}(ServerlessRTC || (ServerlessRTC = {})));
