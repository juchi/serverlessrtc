var ServerlessRTC;
(function(ServerlessRTC) {
"use strict";

var ConnectionHandler = {
    initConnection: function(pc, descriptionCallback) {
        pc.createOffer(function(offer) {
            pc.setLocalDescription(offer, function() {
                descriptionCallback(pc.localDescription);
            }, ServerlessRTC.errorDisplay);
        }, ServerlessRTC.errorDisplay);
    },
    joinConnection: function(pc, offer, descriptionCallback) {
        var offerDesc = new ServerlessRTC.RTCSessionDescription(offer);
        pc.setRemoteDescription(offerDesc, function(){}, ServerlessRTC.errorDisplay);
        pc.createAnswer(function(answer) {
            pc.setLocalDescription(answer, function() {
                descriptionCallback(pc.localDescription);
            }, ServerlessRTC.errorDisplay);
        }, ServerlessRTC.errorDisplay);
    },
    validateConnection: function(pc, answer) {
        var answerDesc = new ServerlessRTC.RTCSessionDescription(answer);
        pc.setRemoteDescription(answerDesc, function(){}, ServerlessRTC.errorDisplay);
    }
};

ServerlessRTC.ConnectionHandler = ConnectionHandler;
}(ServerlessRTC || (ServerlessRTC = {})));
