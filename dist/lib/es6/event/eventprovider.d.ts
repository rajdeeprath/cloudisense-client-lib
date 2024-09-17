import { IClientChannel, IServiceChannel } from "../interfaces";
import { SimpleEventDispatcher, ISimpleEvent } from "strongly-typed-events";
import { CloudMechanikClientDataNotificationEvent, CloudMechanikClientSimpleNotificationEvent } from "../models";
export declare class ChannelEventProvider implements IServiceChannel {
    _onChannelData: SimpleEventDispatcher<number>;
    _onChannelState: SimpleEventDispatcher<unknown>;
    constructor();
    get onChannelData(): ISimpleEvent<number>;
    get onChannelState(): ISimpleEvent<unknown>;
}
export declare class ClientEventProvider implements IClientChannel {
    _onTextNotificationEvent: SimpleEventDispatcher<CloudMechanikClientSimpleNotificationEvent>;
    _onTextDataNotificationEvent: SimpleEventDispatcher<CloudMechanikClientDataNotificationEvent>;
    _onDataEvent: SimpleEventDispatcher<any>;
    _onClientStateUpdate: SimpleEventDispatcher<any>;
    constructor();
    get onTextNotification(): ISimpleEvent<CloudMechanikClientSimpleNotificationEvent>;
    get onTextDataNotification(): ISimpleEvent<CloudMechanikClientDataNotificationEvent>;
    get onServerData(): ISimpleEvent<any>;
    get onClientStateUpdate(): ISimpleEvent<any>;
}
