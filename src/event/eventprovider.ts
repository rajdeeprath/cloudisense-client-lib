/*
* Copyright (C) 2019-2025 Rajdeep Rath (Cloudisense-core - cdscore)
 * This library (.py files) is intended for use solely within the Cloudisense program and its supporting codebases.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.   
*/

import { IClientChannel, IServiceChannel,IServiceClient} from "../interfaces";
import { SignalDispatcher, SimpleEventDispatcher, EventDispatcher, ISimpleEvent } from "strongly-typed-events";
import { CloudisenseClientDataNotificationEvent, CloudisenseClientSimpleNotificationEvent, CloudisenseClientUIDataEvent, SimpleNotificationData } from "../models";


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
    _onUIEvent = new SimpleEventDispatcher<CloudisenseClientUIDataEvent>();
    _onTextNotificationEvent = new SimpleEventDispatcher<CloudisenseClientSimpleNotificationEvent>();
    _onTextDataNotificationEvent = new SimpleEventDispatcher<CloudisenseClientDataNotificationEvent>();
    _onDataEvent = new SimpleEventDispatcher<any>();
    _onClientStateUpdate = new SimpleEventDispatcher<any>();


    constructor () {

    }


    public get onTextNotification() {
        return this._onTextNotificationEvent.asEvent();
    }

    public get onUIEvent() {
        return this._onUIEvent.asEvent();
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