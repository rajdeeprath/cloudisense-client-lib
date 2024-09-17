export declare enum ClientStateType {
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
    CONNECTION_LOST = "CONNECTION_LOST",
    CONNECTION_TERMINATED = "CONNECTION_TERMINATED",
    CONNECTION_ERROR = "ERROR",
    EVENT_RECEIVED = "EVENT_RECEIVED"
}
export declare class OSStats {
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
export declare class CPUStats {
    frequency: string;
    count: number;
    vendor: string;
    model: string;
    percent: string;
}
export declare class MemoryStats {
    total: number;
    used: number;
    free: number;
    swap_total: number;
    swap_used: number;
    swap_free: number;
    percent: string;
}
export declare class DiskStats {
    mountpoint: string;
    fstype: String;
    total: string;
    used: string;
    free: string;
    percent: string;
}
export declare class NetworkStats {
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
export declare class SystemStats {
    os: OSStats;
    cpu: CPUStats;
    memory: MemoryStats;
    disk: DiskStats;
    network: NetworkStats;
}
export declare class Stats {
    system: SystemStats;
    target: any;
}
export declare class LogInfo {
    name?: string;
    topic?: string;
    constructor(name: string, topic: string);
}
export declare class ErrorData {
    message: string;
    data: object;
}
export declare class LogData {
    name: string;
    data: string;
}
export declare class ScriptData {
    name: string;
    data: string;
    state: string;
}
export declare class SimpleNotificationData {
    message: string;
    code: number;
}
export declare class DatatNotificationData {
    message: string;
    code: number;
    data: object;
}
export declare class ClientState {
    state: ClientStateType;
    timestamp?: number;
    constructor(state: ClientStateType, timestamp?: number);
}
export declare class Credentials {
    username: string;
    password: string;
    constructor(username: string, password: string);
}
export declare class TopicData {
    topic: string;
    data: any;
    timestamp: number;
    constructor(topic: string, data?: object);
}
export declare class CloudMechanikServiceEvent {
    name: string;
    topic: string;
    state: string;
    data: any;
    meta: any;
    note: string;
    timestamp: number;
    constructor(name: string);
}
export declare enum EventType {
    NOTIFICATION = "NOTIFICATION",
    DATA = "DATA",
    ERROR = "ERROR"
}
export declare abstract class CloudMechanikClientEvent {
    topic: string;
    data: any;
    meta: any;
    note: string;
    timestamp: number;
    constructor(topic: string, data: any, meta: any, note: string, timestamp: number);
}
export declare abstract class CloudMechanikClientDataEvent extends CloudMechanikClientEvent {
    type: EventType;
    constructor(topic: string, data: any, meta: any, note: string, timestamp: number);
}
export declare abstract class CloudMechanikClientNotificationEvent extends CloudMechanikClientEvent {
    type: EventType;
    constructor(topic: string, data: any, meta: any, note: string, timestamp: number);
}
export declare class CloudMechanikClientErrorEvent extends CloudMechanikClientEvent {
    type: EventType;
    constructor(topic: string, data: any, meta: any, note: string, timestamp: number);
}
export declare class CloudMechanikClientSimpleNotificationEvent extends CloudMechanikClientNotificationEvent {
    constructor(topic: string, data: any, meta: any, note: string, timestamp: number);
}
export declare class CloudMechanikClientDataNotificationEvent extends CloudMechanikClientNotificationEvent {
    constructor(topic: string, data: any, meta: any, note: string, timestamp: number);
}
export declare class CloudMechanikClientLogDataEvent extends CloudMechanikClientDataEvent {
    constructor(topic: string, data: any, meta: any, note: string, timestamp: number);
}
export declare class CloudMechanikClientScriptDataEvent extends CloudMechanikClientDataEvent {
    constructor(topic: string, data: any, meta: any, note: string, timestamp: number);
}
export declare class CloudMechanikClientStatsDataEvent extends CloudMechanikClientDataEvent {
    constructor(topic: string, data: any, meta: any, note: string, timestamp: number);
}
