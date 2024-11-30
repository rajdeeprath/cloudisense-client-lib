/*
 * Copyright © 2024 Rajdeep Rath. All Rights Reserved.
 *
 * This codebase is open-source and provided for use exclusively with the Cloudisense platform,
 * as governed by its End-User License Agreement (EULA). Unauthorized use, reproduction,
 * or distribution of this code outside of the Cloudisense ecosystem is strictly prohibited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * You may not use this file except in compliance with the License.
 * A copy of the License is available at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * This code may include third-party open-source libraries subject to their respective licenses.
 * Such licenses are referenced in the source files or accompanying documentation.
 *
 * For questions or permissions beyond the scope of this notice, please contact Rajdeep Rath.
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