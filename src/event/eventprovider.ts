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

import { IClientChannel, IServiceChannel,IServiceClient} from "../interfaces";
import { SignalDispatcher, SimpleEventDispatcher, EventDispatcher, ISimpleEvent } from "strongly-typed-events";
import { CloudMechanikClientDataNotificationEvent, CloudMechanikClientSimpleNotificationEvent, SimpleNotificationData } from "../models";


export class ChannelEventProvider implements IServiceChannel {

        /* Events */
        _onChannelData = new SimpleEventDispatcher<number>();
        _onChannelState = new SimpleEventDispatcher();


        constructor () {

        }


        public get onChannelData() {
            return this._onChannelData.asEvent();
        }
        
        public get onChannelState() {
            return this._onChannelState.asEvent();
        }
    
}



export class ClientEventProvider implements IClientChannel {
    /* Events */
    _onTextNotificationEvent = new SimpleEventDispatcher<CloudMechanikClientSimpleNotificationEvent>();
    _onTextDataNotificationEvent = new SimpleEventDispatcher<CloudMechanikClientDataNotificationEvent>();
    _onDataEvent = new SimpleEventDispatcher<any>();
    _onClientStateUpdate = new SimpleEventDispatcher<any>();


    constructor () {

    }


    public get onTextNotification() {
        return this._onTextNotificationEvent.asEvent();
    }
    
    public get onTextDataNotification() {
        return this._onTextDataNotificationEvent.asEvent();
    }

    public get onServerData() {
        return this._onDataEvent.asEvent();
    }

    public get onClientStateUpdate(){
        return this._onClientStateUpdate.asEvent()
    }

}