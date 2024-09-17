/*
This file is part of `CloudMechanik`
Copyright 2018 Connessione Technologies

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var WebSocketClient = require('websocket').client; // https://www.npmjs.com/package/websocket
var Defer = require('defer-promise');
import { nanoid } from 'nanoid';
import { ChannelEventProvider } from "./event/eventprovider";
import * as CHANNEL_STATES from './event/channelstates';
var RequestRecord = /** @class */ (function () {
    function RequestRecord(defer, timestamp) {
        this.defer = defer;
        this.timestamp = timestamp;
    }
    return RequestRecord;
}());
export { RequestRecord };
var WSClient = /** @class */ (function (_super) {
    __extends(WSClient, _super);
    function WSClient(config) {
        var _this = _super.call(this) || this;
        _this._connected = false;
        _this._disconnectFlag = false;
        _this._client = undefined;
        _this._requests = new Map();
        _this.host = config.host;
        _this.port = config.port;
        _this.authtoken = config.authtoken;
        _this._wsEndPoint = "ws" + "://" + _this.host + ":" + _this.port + "/" + "ws?" + "token=" + _this.authtoken;
        /* Auto cleanup */
        _this._cleanupId = setInterval(function () { return _this.cleanup_requests(); }, 30000);
        return _this;
    }
    WSClient.prototype.getSocketEndPoint = function () {
        return this._wsEndPoint;
    };
    WSClient.prototype.getHost = function () {
        return this.host;
    };
    WSClient.prototype.getPort = function () {
        return this.port;
    };
    WSClient.prototype.connect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._client == undefined) {
                _this._connection = undefined;
                _this._client = new WebSocketClient();
                _this._client.on('connectFailed', function (error) {
                    _this._connected = false;
                    console.log('Connect Error: ' + error.toString());
                    _this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_ERROR);
                    reject(error);
                });
                _this._client.on('connect', function (connection) {
                    console.info('WebSocket Client Connected');
                    _this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_CONNECTED);
                    _this._connected = true;
                    _this._connection = connection;
                    connection.on('error', function (error) {
                        _this._connected = false;
                        console.error("Connection Error: " + error.toString());
                        _this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_ERROR);
                    });
                    connection.on('close', function () {
                        _this._connected = false;
                        console.debug('protocol Connection Closed');
                        if (_this._disconnectFlag) {
                            _this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_DISCONNECTED);
                        }
                        else {
                            _this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_CONNECTION_LOST);
                        }
                    });
                    connection.on('message', function (message) {
                        if (message.type === 'utf8') {
                            console.debug("Received: '" + message.utf8Data + "'");
                            try {
                                var data = JSON.parse(message.utf8Data);
                                if (data.hasOwnProperty('type') && data["type"] == "rpc") {
                                    _this.resolve_request(data);
                                }
                                else {
                                    _this._onChannelData.dispatch(data);
                                    _this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_DATA);
                                }
                            }
                            catch (e) {
                                console.error("Unexpected message type (not JSON) : " + String(e));
                            }
                        }
                    });
                    resolve(_this);
                });
            }
            if (!_this._connected || _this._client.Closed) {
                _this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_CONNECTIING);
                _this._client.connect(_this._wsEndPoint);
            }
            else {
                console.error("socket is already connected");
            }
        });
    };
    WSClient.prototype.disconnect = function () {
        var _this = this;
        if (this._connected) {
            // use flag to see if disconnect was requested or automatic
            this._disconnectFlag = true;
            setTimeout(function () {
                _this._disconnectFlag = false;
            }, 5000);
            this._client.close();
        }
        else {
            console.error("socket is not connected");
        }
    };
    WSClient.prototype.is_connected = function () {
        if (this._connection == undefined) {
            return false;
        }
        else {
            return this._connection.connected;
        }
    };
    WSClient.prototype.buildRequest = function (requestid, intent, params) {
        return {
            "requestid": requestid,
            "intent": intent,
            "type": "rpc",
            "params": params
        };
    };
    /**
     * Makes RPC request to server
     * `
     * @param methodName
     * @param params
     */
    WSClient.prototype.doRPC = function (intent, params) {
        var _this = this;
        if (params == undefined || params == null) {
            params = {};
        }
        var requestid = nanoid();
        var request = this.buildRequest(requestid, intent, params);
        var deferred = new Defer();
        if (this._connection != undefined && this._connection.connected) {
            try {
                setTimeout(function () {
                    _this._connection.sendUTF(JSON.stringify(request));
                }, 10);
            }
            catch (err) {
                console.error("Unable to send request");
            }
        }
        else {
            console.log("Socket is not connected");
        }
        ;
        this._requests.set(requestid, new RequestRecord(deferred, new Date().getUTCMilliseconds()));
        return deferred.promise;
    };
    WSClient.prototype.cleanup_requests = function () {
        var now = new Date().getUTCMilliseconds();
        this._requests.forEach(function (value, requestid, map) {
            var record = value;
            var request_timestamp = record.timestamp;
            if (now - request_timestamp > 10000) {
                try {
                    var defer = record.defer;
                    defer.reject("RPC Timed out");
                }
                catch (e) {
                    console.error(e);
                }
                finally {
                    map.delete(requestid);
                }
            }
        });
    };
    WSClient.prototype.resolve_request = function (response) {
        var _a;
        var requestid = response["requestid"];
        try {
            var response_timestamp = response["timestamp"];
            var def = (_a = this._requests.get(requestid)) === null || _a === void 0 ? void 0 : _a.defer;
            if (response["status"] == "success") {
                var data = response["data"];
                def.resolve(data);
            }
            else if (response["status"] == "error") {
                var error_message = response["message"];
                def.reject(error_message);
            }
        }
        catch (e) {
            console.error("Error processing request");
        }
        finally {
            this._requests.delete(requestid);
        }
    };
    return WSClient;
}(ChannelEventProvider));
export { WSClient };
//# sourceMappingURL=wsclient.js.map