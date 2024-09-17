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
var CloudMechanikServiceEvent = /** @class */ (function () {
    function CloudMechanikServiceEvent(name) {
        this.name = name;
    }
    return CloudMechanikServiceEvent;
}());
export { CloudMechanikServiceEvent };
export var EventType;
(function (EventType) {
    EventType["NOTIFICATION"] = "NOTIFICATION";
    EventType["DATA"] = "DATA";
    EventType["ERROR"] = "ERROR";
})(EventType || (EventType = {}));
var CloudMechanikClientEvent = /** @class */ (function () {
    function CloudMechanikClientEvent(topic, data, meta, note, timestamp) {
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
    return CloudMechanikClientEvent;
}());
export { CloudMechanikClientEvent };
var CloudMechanikClientDataEvent = /** @class */ (function (_super) {
    __extends(CloudMechanikClientDataEvent, _super);
    function CloudMechanikClientDataEvent(topic, data, meta, note, timestamp) {
        var _this = _super.call(this, topic, data, meta, note, timestamp) || this;
        _this.type = EventType.DATA;
        return _this;
    }
    return CloudMechanikClientDataEvent;
}(CloudMechanikClientEvent));
export { CloudMechanikClientDataEvent };
var CloudMechanikClientNotificationEvent = /** @class */ (function (_super) {
    __extends(CloudMechanikClientNotificationEvent, _super);
    function CloudMechanikClientNotificationEvent(topic, data, meta, note, timestamp) {
        var _this = _super.call(this, topic, data, meta, note, timestamp) || this;
        _this.type = EventType.NOTIFICATION;
        return _this;
    }
    return CloudMechanikClientNotificationEvent;
}(CloudMechanikClientEvent));
export { CloudMechanikClientNotificationEvent };
var CloudMechanikClientErrorEvent = /** @class */ (function (_super) {
    __extends(CloudMechanikClientErrorEvent, _super);
    function CloudMechanikClientErrorEvent(topic, data, meta, note, timestamp) {
        var _this = _super.call(this, topic, plainToClass(ErrorData, data), meta, note, timestamp) || this;
        _this.type = EventType.ERROR;
        return _this;
    }
    return CloudMechanikClientErrorEvent;
}(CloudMechanikClientEvent));
export { CloudMechanikClientErrorEvent };
var CloudMechanikClientSimpleNotificationEvent = /** @class */ (function (_super) {
    __extends(CloudMechanikClientSimpleNotificationEvent, _super);
    function CloudMechanikClientSimpleNotificationEvent(topic, data, meta, note, timestamp) {
        return _super.call(this, topic, plainToClass(SimpleNotificationData, data), meta, note, timestamp) || this;
    }
    return CloudMechanikClientSimpleNotificationEvent;
}(CloudMechanikClientNotificationEvent));
export { CloudMechanikClientSimpleNotificationEvent };
var CloudMechanikClientDataNotificationEvent = /** @class */ (function (_super) {
    __extends(CloudMechanikClientDataNotificationEvent, _super);
    function CloudMechanikClientDataNotificationEvent(topic, data, meta, note, timestamp) {
        return _super.call(this, topic, plainToClass(DatatNotificationData, data), meta, note, timestamp) || this;
    }
    return CloudMechanikClientDataNotificationEvent;
}(CloudMechanikClientNotificationEvent));
export { CloudMechanikClientDataNotificationEvent };
var CloudMechanikClientLogDataEvent = /** @class */ (function (_super) {
    __extends(CloudMechanikClientLogDataEvent, _super);
    function CloudMechanikClientLogDataEvent(topic, data, meta, note, timestamp) {
        return _super.call(this, topic, plainToClass(ScriptData, data), meta, note, timestamp) || this;
    }
    return CloudMechanikClientLogDataEvent;
}(CloudMechanikClientDataEvent));
export { CloudMechanikClientLogDataEvent };
var CloudMechanikClientScriptDataEvent = /** @class */ (function (_super) {
    __extends(CloudMechanikClientScriptDataEvent, _super);
    function CloudMechanikClientScriptDataEvent(topic, data, meta, note, timestamp) {
        return _super.call(this, topic, plainToClass(ScriptData, data), meta, note, timestamp) || this;
    }
    return CloudMechanikClientScriptDataEvent;
}(CloudMechanikClientDataEvent));
export { CloudMechanikClientScriptDataEvent };
var CloudMechanikClientStatsDataEvent = /** @class */ (function (_super) {
    __extends(CloudMechanikClientStatsDataEvent, _super);
    function CloudMechanikClientStatsDataEvent(topic, data, meta, note, timestamp) {
        return _super.call(this, topic, plainToClass(Stats, data), meta, note, timestamp) || this;
    }
    return CloudMechanikClientStatsDataEvent;
}(CloudMechanikClientDataEvent));
export { CloudMechanikClientStatsDataEvent };
//# sourceMappingURL=models.js.map