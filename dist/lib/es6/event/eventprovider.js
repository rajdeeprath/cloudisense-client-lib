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
import { SimpleEventDispatcher } from "strongly-typed-events";
var ChannelEventProvider = /** @class */ (function () {
    function ChannelEventProvider() {
        /* Events */
        this._onChannelData = new SimpleEventDispatcher();
        this._onChannelState = new SimpleEventDispatcher();
    }
    Object.defineProperty(ChannelEventProvider.prototype, "onChannelData", {
        get: function () {
            return this._onChannelData.asEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChannelEventProvider.prototype, "onChannelState", {
        get: function () {
            return this._onChannelState.asEvent();
        },
        enumerable: false,
        configurable: true
    });
    return ChannelEventProvider;
}());
export { ChannelEventProvider };
var ClientEventProvider = /** @class */ (function () {
    function ClientEventProvider() {
        /* Events */
        this._onTextNotificationEvent = new SimpleEventDispatcher();
        this._onTextDataNotificationEvent = new SimpleEventDispatcher();
        this._onDataEvent = new SimpleEventDispatcher();
        this._onClientStateUpdate = new SimpleEventDispatcher();
    }
    Object.defineProperty(ClientEventProvider.prototype, "onTextNotification", {
        get: function () {
            return this._onTextNotificationEvent.asEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientEventProvider.prototype, "onTextDataNotification", {
        get: function () {
            return this._onTextDataNotificationEvent.asEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientEventProvider.prototype, "onServerData", {
        get: function () {
            return this._onDataEvent.asEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientEventProvider.prototype, "onClientStateUpdate", {
        get: function () {
            return this._onClientStateUpdate.asEvent();
        },
        enumerable: false,
        configurable: true
    });
    return ClientEventProvider;
}());
export { ClientEventProvider };
//# sourceMappingURL=eventprovider.js.map