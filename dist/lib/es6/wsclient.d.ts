declare const Defer: any;
import { IServiceSocket, ISocketServiceObject } from "./interfaces";
import { ChannelEventProvider } from "./event/eventprovider";
export declare class RequestRecord {
    defer: typeof Defer;
    timestamp: number;
    constructor(defer: typeof Defer, timestamp: number);
}
export declare class WSClient extends ChannelEventProvider implements IServiceSocket {
    host: string;
    port: number;
    authtoken: string;
    queryparams?: string | undefined;
    private _connected;
    private _wsEndPoint;
    private _client;
    private _connection;
    private _disconnectFlag;
    private _requests;
    private _cleanupId;
    constructor(config: ISocketServiceObject);
    private getSocketEndPoint;
    getHost(): string;
    getPort(): number;
    connect(): Promise<any>;
    disconnect(): void;
    is_connected(): boolean;
    private buildRequest;
    /**
     * Makes RPC request to server
     * `
     * @param methodName
     * @param params
     */
    doRPC(intent: string, params?: object): Promise<any>;
    private cleanup_requests;
    private resolve_request;
}
export {};
