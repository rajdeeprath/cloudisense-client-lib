/*
This file is part of `Cloudisense`
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
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { plainToClass, Type } from 'class-transformer';
export var ClientStateType;
(function (ClientStateType) {
    ClientStateType["CONNECTING"] = "CONNECTING";
    ClientStateType["CONNECTED"] = "CONNECTED";
    ClientStateType["CONNECTION_LOST"] = "CONNECTION_LOST";
    ClientStateType["CONNECTION_TERMINATED"] = "CONNECTION_TERMINATED";
    ClientStateType["CONNECTION_ERROR"] = "ERROR";
    ClientStateType["EVENT_RECEIVED"] = "EVENT_RECEIVED";
})(ClientStateType || (ClientStateType = {}));
var OSStats = /** @class */ (function () {
    function OSStats() {
    }
    return OSStats;
}());
export { OSStats };
var CPUStats = /** @class */ (function () {
    function CPUStats() {
    }
    return CPUStats;
}());
export { CPUStats };
var MemoryStats = /** @class */ (function () {
    function MemoryStats() {
    }
    return MemoryStats;
}());
export { MemoryStats };
var DiskStats = /** @class */ (function () {
    function DiskStats() {
    }
    return DiskStats;
}());
export { DiskStats };
var NetworkStats = /** @class */ (function () {
    function NetworkStats() {
    }
    return NetworkStats;
}());
export { NetworkStats };
var SystemStats = /** @class */ (function () {
    function SystemStats() {
    }
    __decorate([
        Type(function () { return OSStats; }),
        __metadata("design:type", OSStats)
    ], SystemStats.prototype, "os", void 0);
    __decorate([
        Type(function () { return CPUStats; }),
        __metadata("design:type", CPUStats)
    ], SystemStats.prototype, "cpu", void 0);
    __decorate([
        Type(function () { return MemoryStats; }),
        __metadata("design:type", MemoryStats)
    ], SystemStats.prototype, "memory", void 0);
    __decorate([
        Type(function () { return DiskStats; }),
        __metadata("design:type", DiskStats)
    ], SystemStats.prototype, "disk", void 0);
    __decorate([
        Type(function () { return NetworkStats; }),
        __metadata("design:type", NetworkStats)
    ], SystemStats.prototype, "network", void 0);
    return SystemStats;
}());
export { SystemStats };
var Stats = /** @class */ (function () {
    function Stats() {
    }
    __decorate([
        Type(function () { return SystemStats; }),
        __metadata("design:type", SystemStats)
    ], Stats.prototype, "system", void 0);
    return Stats;
}());
export { Stats };
var LogInfo = /** @class */ (function () {
    function LogInfo(name, topic) {
        this.name = name;
        this.topic = topic;
    }
    return LogInfo;
}());
export { LogInfo };
var ErrorData = /** @class */ (function () {
    function ErrorData() {
    }
    return ErrorData;
}());
export { ErrorData };
var LogData = /** @class */ (function () {
    function LogData() {
    }
    return LogData;
}());
export { LogData };
var ScriptData = /** @class */ (function () {
    function ScriptData() {
    }
    return ScriptData;
}());
export { ScriptData };
var SimpleNotificationData = /** @class */ (function () {
    function SimpleNotificationData() {
    }
    return SimpleNotificationData;
}());
export { SimpleNotificationData };
var DatatNotificationData = /** @class */ (function () {
    function DatatNotificationData() {
    }
    return DatatNotificationData;
}());
export { DatatNotificationData };
var ClientState = /** @class */ (function () {
    function ClientState(state, timestamp) {
        this.state = state;
        this.timestamp = timestamp;
    }
    return ClientState;
}());
export { ClientState };
var Credentials = /** @class */ (function () {
    function Credentials(username, password) {
        this.username = username;
        this.password = password;
    }
    return Credentials;
}());
export { Credentials };
var TopicData = /** @class */ (function () {
    function TopicData(topic, data) {
        this.topic = topic;
        this.data = (data == undefined || data == null) ? undefined : data;
    }
    return TopicData;
}());
export { TopicData };
var CloudisenseServiceEvent = /** @class */ (function () {
    function CloudisenseServiceEvent(name) {
        this.name = name;
    }
    return CloudisenseServiceEvent;
}());
export { CloudisenseServiceEvent };
export var EventType;
(function (EventType) {
    EventType["NOTIFICATION"] = "NOTIFICATION";
    EventType["DATA"] = "DATA";
    EventType["ERROR"] = "ERROR";
})(EventType || (EventType = {}));
var CloudisenseClientEvent = /** @class */ (function () {
    function CloudisenseClientEvent(topic, data, meta, note, timestamp) {
        if (topic !== undefined) {
            this.topic = topic;
        }
        if (data !== undefined) {
            this.data = data;
        }
        if (meta !== undefined) {
            this.meta = meta;
        }
        if (note !== undefined) {
            this.note = note;
        }
        if (timestamp !== undefined || !isNaN(timestamp)) {
            this.timestamp = timestamp;
        }
    }
    return CloudisenseClientEvent;
}());
export { CloudisenseClientEvent };
var CloudisenseClientDataEvent = /** @class */ (function (_super) {
    __extends(CloudisenseClientDataEvent, _super);
    function CloudisenseClientDataEvent(topic, data, meta, note, timestamp) {
        var _this = _super.call(this, topic, data, meta, note, timestamp) || this;
        _this.type = EventType.DATA;
        return _this;
    }
    return CloudisenseClientDataEvent;
}(CloudisenseClientEvent));
export { CloudisenseClientDataEvent };
var CloudisenseClientNotificationEvent = /** @class */ (function (_super) {
    __extends(CloudisenseClientNotificationEvent, _super);
    function CloudisenseClientNotificationEvent(topic, data, meta, note, timestamp) {
        var _this = _super.call(this, topic, data, meta, note, timestamp) || this;
        _this.type = EventType.NOTIFICATION;
        return _this;
    }
    return CloudisenseClientNotificationEvent;
}(CloudisenseClientEvent));
export { CloudisenseClientNotificationEvent };
var CloudisenseClientErrorEvent = /** @class */ (function (_super) {
    __extends(CloudisenseClientErrorEvent, _super);
    function CloudisenseClientErrorEvent(topic, data, meta, note, timestamp) {
        var _this = _super.call(this, topic, plainToClass(ErrorData, data), meta, note, timestamp) || this;
        _this.type = EventType.ERROR;
        return _this;
    }
    return CloudisenseClientErrorEvent;
}(CloudisenseClientEvent));
export { CloudisenseClientErrorEvent };
var CloudisenseClientSimpleNotificationEvent = /** @class */ (function (_super) {
    __extends(CloudisenseClientSimpleNotificationEvent, _super);
    function CloudisenseClientSimpleNotificationEvent(topic, data, meta, note, timestamp) {
        return _super.call(this, topic, plainToClass(SimpleNotificationData, data), meta, note, timestamp) || this;
    }
    return CloudisenseClientSimpleNotificationEvent;
}(CloudisenseClientNotificationEvent));
export { CloudisenseClientSimpleNotificationEvent };
var CloudisenseClientDataNotificationEvent = /** @class */ (function (_super) {
    __extends(CloudisenseClientDataNotificationEvent, _super);
    function CloudisenseClientDataNotificationEvent(topic, data, meta, note, timestamp) {
        return _super.call(this, topic, plainToClass(DatatNotificationData, data), meta, note, timestamp) || this;
    }
    return CloudisenseClientDataNotificationEvent;
}(CloudisenseClientNotificationEvent));
export { CloudisenseClientDataNotificationEvent };
var CloudisenseClientLogDataEvent = /** @class */ (function (_super) {
    __extends(CloudisenseClientLogDataEvent, _super);
    function CloudisenseClientLogDataEvent(topic, data, meta, note, timestamp) {
        return _super.call(this, topic, plainToClass(ScriptData, data), meta, note, timestamp) || this;
    }
    return CloudisenseClientLogDataEvent;
}(CloudisenseClientDataEvent));
export { CloudisenseClientLogDataEvent };
var CloudisenseClientScriptDataEvent = /** @class */ (function (_super) {
    __extends(CloudisenseClientScriptDataEvent, _super);
    function CloudisenseClientScriptDataEvent(topic, data, meta, note, timestamp) {
        return _super.call(this, topic, plainToClass(ScriptData, data), meta, note, timestamp) || this;
    }
    return CloudisenseClientScriptDataEvent;
}(CloudisenseClientDataEvent));
export { CloudisenseClientScriptDataEvent };
var CloudisenseClientStatsDataEvent = /** @class */ (function (_super) {
    __extends(CloudisenseClientStatsDataEvent, _super);
    function CloudisenseClientStatsDataEvent(topic, data, meta, note, timestamp) {
        return _super.call(this, topic, plainToClass(Stats, data), meta, note, timestamp) || this;
    }
    return CloudisenseClientStatsDataEvent;
}(CloudisenseClientDataEvent));
export { CloudisenseClientStatsDataEvent };
//# sourceMappingURL=models.js.map