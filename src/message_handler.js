var ServerlessRTC;
(function(ServerlessRTC) {
"use strict";

function MessageHandler() {

}
MessageHandler.prototype.receive = function(message) {
    console.log('data channel message', message);
};

ServerlessRTC.MessageHandler = MessageHandler;
}(ServerlessRTC || (ServerlessRTC = {})));
