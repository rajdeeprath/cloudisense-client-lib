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
import 'reflect-metadata';
import { WSClient } from "./wsclient";
import { sha256 } from 'js-sha256';
import { EventList } from "strongly-typed-events";
import { ClientEventProvider } from "./event/eventprovider";
import { Base64 } from 'js-base64';
import { ClientStateType, ClientState, Credentials, CloudMechanikClientStatsDataEvent, CloudMechanikClientLogDataEvent, CloudMechanikClientSimpleNotificationEvent, CloudMechanikClientErrorEvent } from "./models";
import { TOPIC_SCRIPT_MONITORING, TOPIC_LOG_MONITORING, TOPIC_STATS_MONITORING, TOPIC_DELEGATE_MONITORING } from "./event/events";
import * as CHANNEL_STATES from './event/channelstates';
import * as EVENTS from './event/events';
import axios from 'axios';
var CloudMechanikApiClient = /** @class */ (function (_super) {
    __extends(CloudMechanikApiClient, _super);
    function CloudMechanikApiClient(config) {
        var _this = _super.call(this) || this;
        _this._topicevents = new EventList();
        _this._errorCount = 0;
        _this.host = config.host;
        _this.port = config.port;
        _this.autoconnect = (typeof config.autoconnect === 'undefined' || config.autoconnect === null) ? false : config.autoconnect;
        _this.reconnectOnFailure = (typeof config.reconnectOnFailure === 'undefined' || config.reconnectOnFailure === null) ? false : config.reconnectOnFailure;
        _this._restEndPoint = "http" + "://" + _this.host + ":" + _this.port; // fix this later
        return _this;
    }
    /**
     * Subscribes to a specific DataEvent topic
     *
     * @param topicname topic name to subscribe to
     * @param fn subscriber handler function
     */
    CloudMechanikApiClient.prototype.subscribeTopic = function (topicname, fn) {
        this._topicevents.get(topicname).subscribe(fn);
    };
    /**
     * Unsubscribes from a specific DataEvent topic. The handler is executed at most once
     *
     * @param topicname topic name to unsubscribe from
     * @param fn subscriber handler function
     */
    CloudMechanikApiClient.prototype.unsubscribeTopic = function (topicname, fn) {
        this._topicevents.get(topicname).unsubscribe(fn);
    };
    /**
     * Checks to see if a given DataEvent topic has a handler registered against it or not
     *
     * @param topicname
     * @param fn
     */
    CloudMechanikApiClient.prototype.hasTopicHandler = function (topicname, fn) {
        return this._topicevents.get(topicname).has(fn);
    };
    /**
     * Fetched the content of a simple text file from server
     *
     * @returns
     */
    CloudMechanikApiClient.prototype.read_file = function (path) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var url = _this.getBaseAPIendPoint() + "/file/read";
            var params = new URLSearchParams();
            params.append('path', path);
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            var promise = axios.post(url, params, config);
            promise.then(function (result) {
                if (result.status == 200) {
                    var content = Base64.decode(result.data.data);
                    console.debug(content);
                    resolve(content);
                }
                else {
                    throw new Error("Invalid or unexpected response");
                }
            })
                .catch(function (err) {
                console.error(err.toString());
                reject(err);
            });
        });
        return promise;
    };
    /**
     * Saves the content of a simple text file on server
     *
     * @returns
     */
    CloudMechanikApiClient.prototype.write_file = function (path, content) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var url = _this.getBaseAPIendPoint() + "/file/write";
            var params = new URLSearchParams();
            params.append('path', path);
            params.append('content', Base64.encode(content));
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            var promise = axios.post(url, params, config);
            promise.then(function (result) {
                if (result.status == 200) {
                    var content_1 = Base64.decode(result.data.data);
                    console.debug(content_1);
                    resolve(content_1);
                }
                else {
                    throw new Error("Invalid or unexpected response");
                }
            })
                .catch(function (err) {
                console.error(err.toString());
                reject(err);
            });
        });
        return promise;
    };
    /**
     * Gets list of accessible logs
     *
     * @returns Promise that resolved to List of logs
     */
    CloudMechanikApiClient.prototype.get_logs = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promise = _this._socketservice.doRPC("list_logs");
            promise.then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Subscribes to stats channel (topic path) to get realtime data
     *
     * @returns Promise that resolved to subscribable topic path for the data channel for stats
     */
    CloudMechanikApiClient.prototype.subscribe_stats = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var payload = {
                "topic": TOPIC_STATS_MONITORING
            };
            var promise = _this._socketservice.doRPC("subscribe_channel", payload);
            promise.then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Subscribes to log channel (topic path) to get realtime data
     *
     * @param logkey
     * @returns Promise that resolved to subscribable topic path for the data channel of thsi log
     */
    CloudMechanikApiClient.prototype.subscribe_log = function (logkey) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var payload = {
                "topic": TOPIC_LOG_MONITORING + "/" + logkey
            };
            var promise = _this._socketservice.doRPC("subscribe_channel", payload);
            promise.then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     *
     * Unsubscribes from a log channel
     *
     * @param logkey
     * @returns
     */
    CloudMechanikApiClient.prototype.unsubscribe_log = function (logkey) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var payload = {
                "topic": TOPIC_LOG_MONITORING + "/" + logkey
            };
            var promise = _this._socketservice.doRPC("unsubscribe_channel", payload);
            promise.then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Requests to download a log file from server
     *
     * @param logkey
     * @returns
     */
    CloudMechanikApiClient.prototype.download_log = function (logkey) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var url = _this.getBaseAPIendPoint() + "/log/download/static";
            var params = new URLSearchParams();
            params.append('logname', logkey);
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            var promise = axios.post(url, params, config);
            promise.then(function (result) {
                if (result.data.status == "success") {
                    var download_url = _this.getBaseAPIendPoint() + "/" + result.data.data;
                    resolve(download_url);
                }
                else {
                    throw new Error('Exception response received ' + JSON.stringify(result));
                }
            })
                .catch(function (err) {
                console.error(err.toString());
                reject(err);
            });
        });
        return promise;
    };
    /**
     * Gets list of system services that can be started/stopped through the service
     *
     * @returns
     */
    CloudMechanikApiClient.prototype.get_system_services = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promise = _this._socketservice.doRPC("list_targets");
            promise.then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Starts a system service using its name
     *
     * @param name
     * @returns
     */
    CloudMechanikApiClient.prototype.start_service = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var payload = {
                "module": name
            };
            var promise = _this._socketservice.doRPC("start_target", payload);
            promise.then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Stops a system service using its name
     *
     * @param name
     * @returns
     */
    CloudMechanikApiClient.prototype.stop_service = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var payload = {
                "module": name
            };
            var promise = _this._socketservice.doRPC("stop_target", payload);
            promise.then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Restarts a system service using its name
     *
     * @param name
     * @returns
     */
    CloudMechanikApiClient.prototype.restart_service = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var payload = {
                "module": name
            };
            var promise = _this._socketservice.doRPC("restart_target", payload);
            promise.then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Connects to backend service using a set of valid credentials
     *
     * @param username
     * @param password
     * @returns
     */
    CloudMechanikApiClient.prototype.connect = function (username, password) {
        var _this = this;
        console.log("connecting to service");
        return new Promise(function (resolve, reject) {
            var hashed_password = sha256.create().update(password).hex();
            _this.authenticate(username, hashed_password).then(function (res) {
                if (res.status == 200) {
                    _this._authtoken = res.data.data;
                    _this._authtime = new Date().getUTCMilliseconds();
                    // Connect to websocket
                    new WSClient({
                        host: _this.host,
                        port: _this.port,
                        authtoken: _this._authtoken
                    })
                        .connect()
                        .then(function (client) {
                        _this._errorCount = 0;
                        _this._socketservice = client;
                        _this._lastCredentials = new Credentials(username, password);
                        _this._onClientStateUpdate.dispatch(new ClientState(ClientStateType.CONNECTED));
                        _this._socketservice.onChannelData.subscribe(function (data) {
                            _this.processChannelData(data);
                        });
                        _this._socketservice.onChannelState.subscribe(function (state) {
                            switch (state) {
                                case CHANNEL_STATES.STATE_CHANNEL_ERROR:
                                    _this._onClientStateUpdate.dispatch(new ClientState(ClientStateType.CONNECTION_ERROR));
                                    _this._errorCount++;
                                    if (_this.reconnectOnFailure) {
                                        // try to connect again
                                        _this.attemptReconnect();
                                    }
                                    break;
                                case CHANNEL_STATES.STATE_CHANNEL_DISCONNECTED:
                                    _this._onClientStateUpdate.dispatch(new ClientState(ClientStateType.CONNECTION_TERMINATED));
                                    break;
                                case CHANNEL_STATES.STATE_CHANNEL_CONNECTION_LOST:
                                    _this._onClientStateUpdate.dispatch(new ClientState(ClientStateType.CONNECTION_LOST));
                                    if (_this.reconnectOnFailure) {
                                        // try to connect again                                    
                                        _this.attemptReconnect();
                                    }
                                    break;
                                case CHANNEL_STATES.STATE_CHANNEL_CONNECTIING:
                                    _this._onClientStateUpdate.dispatch(new ClientState(ClientStateType.CONNECTING));
                                    break;
                            }
                        });
                        resolve(_this);
                    })
                        .catch(function (err) {
                        console.error(err);
                        reject(err);
                    });
                }
                else {
                    console.log(res);
                }
            }).catch(function (err) {
                console.log(err);
                _this._errorCount++;
                var message = err.toString();
                if (message.indexOf("ECONNREFUSED") > 0) {
                    if (_this.reconnectOnFailure) {
                        _this.attemptReconnect();
                    }
                }
            });
        });
    };
    /**
     * Attempts to reconenct back to service using last successful credentials
     */
    CloudMechanikApiClient.prototype.attemptReconnect = function () {
        var _this = this;
        console.log("Attempting to reconnect");
        if (this._lastCredentials != undefined && this._lastCredentials != null) {
            if (this._errorCount < CloudMechanikApiClient.MAX_ERROR_TOLERANCE) {
                setTimeout(function () {
                    _this.connect(_this._lastCredentials.username, _this._lastCredentials.password);
                }, 5000);
            }
            else {
                throw new Error("too many connection failures");
            }
        }
    };
    /**
     * Process push data from server and dispatch events for client
     *
     * @param data
     */
    CloudMechanikApiClient.prototype.processChannelData = function (data) {
        if (data["type"] == "event") {
            var event_1 = data;
            var notificationData = undefined;
            this._onClientStateUpdate.dispatch(new ClientState(ClientStateType.EVENT_RECEIVED));
            console.log(JSON.stringify(event_1));
            switch (event_1.name) {
                case EVENTS.SERVER_PING_EVENT:
                    console.debug("Server ping message");
                    break;
                case EVENTS.TEXT_NOTIFICATION_EVENT:
                    this._onTextNotificationEvent.dispatchAsync(new CloudMechanikClientSimpleNotificationEvent(event_1.topic, event_1.data, event_1.meta, event_1.note, event_1.timestamp));
                    break;
                case EVENTS.TEXT_DATA_NOTIFICATION_EVENT:
                    console.debug("data notification event");
                    this._onTextNotificationEvent.dispatchAsync(new CloudMechanikClientSimpleNotificationEvent(event_1.topic, event_1.data, event_1.meta, event_1.note, event_1.timestamp));
                    this._dispatchTopicOrientedDataEvent(event_1);
                    break;
                case EVENTS.ERROR_EVENT:
                    this._dispatchTopicOrientedErrorEvent(event_1);
                    break;
                case EVENTS.DATA_EVENT:
                    this._dispatchTopicOrientedDataEvent(event_1);
                    break;
                default:
                    console.debug("Unrecognized event type");
                    break;
            }
        }
    };
    /**
     * Dispatches topic specific error event with topic specific data
     * @param event
     */
    CloudMechanikApiClient.prototype._dispatchTopicOrientedErrorEvent = function (event) {
        var topic = event.topic;
        switch (topic) {
            case (topic.startsWith(TOPIC_LOG_MONITORING)) ? topic : null:
                this._topicevents.get(topic).dispatchAsync(this, new CloudMechanikClientErrorEvent(event.topic, event.data, event.meta, event.note, event.timestamp));
                break;
            case (topic.startsWith(TOPIC_SCRIPT_MONITORING)) ? topic : null:
                this._topicevents.get(topic).dispatchAsync(this, new CloudMechanikClientErrorEvent(event.topic, event.data, event.meta, event.note, event.timestamp));
                break;
            case (topic.startsWith(TOPIC_STATS_MONITORING)) ? topic : null:
                this._topicevents.get(topic).dispatchAsync(this, new CloudMechanikClientErrorEvent(event.topic, event.data, event.meta, event.note, event.timestamp));
                break;
            case (topic.startsWith(TOPIC_DELEGATE_MONITORING)) ? topic : null:
                this._topicevents.get(topic).dispatchAsync(this, new CloudMechanikClientErrorEvent(event.topic, event.data, event.meta, event.note, event.timestamp));
                break;
            default:
                console.debug("Event for topic:" + topic);
                break;
        }
    };
    /**
     * Dispatches topic specific event with topic specific data
     * @param event
     */
    CloudMechanikApiClient.prototype._dispatchTopicOrientedDataEvent = function (event) {
        var topic = event.topic;
        switch (topic) {
            case (topic.startsWith(TOPIC_LOG_MONITORING)) ? topic : null:
                this._topicevents.get(topic).dispatchAsync(this, new CloudMechanikClientLogDataEvent(event.topic, event.data, event.meta, event.note, event.timestamp));
                break;
            case (topic.startsWith(TOPIC_SCRIPT_MONITORING)) ? topic : null:
                this._topicevents.get(topic).dispatchAsync(this, new CloudMechanikClientStatsDataEvent(event.topic, event.data, event.meta, event.note, event.timestamp));
                break;
            case (topic.startsWith(TOPIC_STATS_MONITORING)) ? topic : null:
                this._topicevents.get(topic).dispatchAsync(this, new CloudMechanikClientStatsDataEvent(event.topic, event.data, event.meta, event.note, event.timestamp));
                break;
            case (topic.startsWith(TOPIC_DELEGATE_MONITORING)) ? topic : null:
                // Delegate data object to be engineered
                console.debug("Event for delegate monitoring:" + topic);
                break;
            default:
                console.debug("Event for topic:" + topic);
                break;
        }
    };
    CloudMechanikApiClient.prototype.getBaseAPIendPoint = function () {
        return this._restEndPoint;
    };
    /**
     * Authenticates a user based on username and password
     *
     * @param username
     * @param password
     * @returns
     */
    CloudMechanikApiClient.prototype.authenticate = function (username, password) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = _this.getBaseAPIendPoint() + "/" + "authorize";
            var params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            var promise = axios.post(url, params, config);
            promise.then(function (result) {
                console.debug(result);
                resolve(result);
            })
                .catch(function (err) {
                console.error(err.toString());
                reject(err);
            });
        });
    };
    CloudMechanikApiClient.prototype.dispose = function () {
        // TO DO cleanup
    };
    CloudMechanikApiClient.MAX_ERROR_TOLERANCE = 5;
    return CloudMechanikApiClient;
}(ClientEventProvider));
export { CloudMechanikApiClient };
//# sourceMappingURL=client.js.map