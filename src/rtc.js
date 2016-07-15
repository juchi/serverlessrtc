var ServerlessRTC;
(function(ServerlessRTC) {
"use strict";

ServerlessRTC.createClient = function() {
    return new ServerlessRTC.Client();
};
ServerlessRTC.errorDisplay = function(err) {
    console.error(err);
};
// google STUN server
var googleStunUrl = "stun:stun.l.google.com:19302";
ServerlessRTC.defaultConfiguration = {"iceServers":[{"urls":googleStunUrl}]};

// API compatibility
var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
if (!RTCPeerConnection || !RTCSessionDescription) {
    ServerlessRTC.errorDisplay('This browser does not support WebRTC!');
    return;
}

ServerlessRTC.RTCPeerConnection = RTCPeerConnection;
ServerlessRTC.RTCSessionDescription = RTCSessionDescription;

}(ServerlessRTC || (ServerlessRTC = {})));
