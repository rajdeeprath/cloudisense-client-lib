import { ISimpleEvent } from "strongly-typed-events";
import { ClientState, LogInfo } from "./models";
export interface OSStats {
    arch: string;
    name: string;
    type: string;
    flavor: string;
    version: string;
    boot_time: number;
    uptime: number;
    system_datetime: string;
    timezone: string;
}
export interface CPUStats {
    frequency: string;
    count: number;
    vendor: string;
    model: string;
    percent: string;
}
export interface MemoryStats {
    total: number;
    used: number;
    free: number;
    swap_total: number;
    swap_used: number;
    swap_free: number;
    percent: string;
}
export interface DiskStats {
    mountpoint: string;
    fstype: string;
    total: string;
    used: string;
    free: string;
    percent: string;
}
export interface NetworkStats {
    id: string;
    bytes_sent: number;
    bytes_recv: number;
    packets_sent: number;
    packets_recv: number;
    errin: number;
    errout: number;
    dropin: number;
    dropout: number;
}
export interface SystemStats {
    os: OSStats;
    cpu: CPUStats;
    memory: MemoryStats;
    disk: DiskStats;
    network: NetworkStats;
}
export interface SimpleNotificationObject {
    message: string;
    type: number;
    timestamp: number;
}
export interface SimpleDataNotificationObject {
    data: object;
    timestamp: number;
}
export interface DataNotificationObject {
    message: string;
    type: number;
    data: object;
    timestamp: number;
}
export interface IRPC {
    requestid: string;
    type: string;
    intent: string;
    params?: any;
    timestamp?: number;
}
export interface ISocketServiceObject {
    host: string;
    port: number;
    authtoken: string;
    queryparams?: string;
}
export interface IClientChannel {
    onTextNotification: ISimpleEvent<any>;
    onTextDataNotification: ISimpleEvent<any>;
    onServerData: ISimpleEvent<any>;
    onClientStateUpdate: ISimpleEvent<ClientState>;
}
export interface IServiceClient extends IClientChannel {
    connect: (username: string, password: string) => Promise<any>;
    get_logs: () => Promise<Array<LogInfo>>;
    read_file: (path: string) => Promise<string>;
    write_file: (path: string, content: any) => Promise<void>;
    subscribe_log: (logkey: string) => Promise<string>;
    unsubscribe_log: (logkey: string) => Promise<any>;
    download_log: (logkey: string) => Promise<string>;
    get_system_services: () => Promise<Array<string>>;
    start_service: (name: string) => Promise<any>;
    stop_service: (name: string) => Promise<any>;
    restart_service: (name: string) => Promise<any>;
}
export interface IServiceChannel {
    onChannelData: ISimpleEvent<any>;
    onChannelState: ISimpleEvent<any>;
}
export interface IServiceSocket extends IServiceChannel {
    host: string;
    port: number;
    authtoken: string;
    autoconnect?: boolean;
    queryparams?: string;
    getHost: () => string;
    getPort: () => number;
    connect: () => Promise<any>;
    disconnect: () => void;
    is_connected: () => boolean;
    doRPC: (methodName: string, params?: object) => Promise<any>;
}
export interface IClientConfig {
    host: string;
    port: number;
    username?: string;
    password?: string;
    autoconnect?: boolean;
    reconnectOnFailure?: boolean;
}
