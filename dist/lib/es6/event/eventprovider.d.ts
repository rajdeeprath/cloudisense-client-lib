import { IClientChannel, IServiceChannel } from "../interfaces";
import { SimpleEventDispatcher, ISimpleEvent } from "strongly-typed-events";
import { CloudisenseClientDataNotificationEvent, CloudisenseClientSimpleNotificationEvent } from "../models";
export declare class ChannelEventProvider implements IServiceChannel {
    _onChannelData: SimpleEventDispatcher<number>;
    _onChannelState: SimpleEventDispatcher<unknown>;
    constructor();
    get onChannelData(): ISimpleEvent<number>;
    get onChannelState(): ISimpleEvent<unknown>;
}
export declare class ClientEventProvider implements IClientChannel {
    _onTextNotificationEvent: SimpleEventDispatcher<CloudisenseClientSimpleNotificationEvent>;
    _onTextDataNotificationEvent: SimpleEventDispatcher<CloudisenseClientDataNotificationEvent>;
    _onDataEvent: SimpleEventDispatcher<any>;
    _onClientStateUpdate: SimpleEventDispatcher<any>;
    constructor();
    get onTextNotification(): ISimpleEvent<CloudisenseClientSimpleNotificationEvent>;
    get onTextDataNotification(): ISimpleEvent<CloudisenseClientDataNotificationEvent>;
    get onServerData(): ISimpleEvent<any>;
    get onClientStateUpdate(): ISimpleEvent<any>;
}
