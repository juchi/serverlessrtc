Serverless RTC library
======================

## Usage

Start by creating a new client object and setting some callbacks.

```javascript
var client = ServerlessRTC.createClient();
client.onLocalOffer = function(description) {
    console.log(description);
};
client.onLocalAnswer = function(description) {
    console.log(description);
};
client.createConnection();
```

An RTC client may either initiate a new connection
or join a connection opened by another client.

A connection is created with the initConnection() method, which will provide
a descriptive token to the onLocalOffer callback.

```javascript
client.initConnection();
```

The token should be provided to any other client willing to use the connection,
using the joinConnection() method. A new token will be generated
by this second client and passed to its onLocalAnswer callback.

```javascript
client.joinConnection(token);
```

Finally, the first client should validate the second token in order to finalize
the connection. Use the validateConnection() method for this.

```javascript
client.validateConnection(token);
```

Once a connection is established, messages may be exchanged by using the sendMessage() method.
On the distant client, the received message will be provided to the Client's receiveMessage() method.

### Build from source

```
git clone https://github.com/juchi/serverlessrtc.js
npm install
./node_modules/.bin/grunt
```
