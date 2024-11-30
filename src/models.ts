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

import { Expose, plainToClass, Type } from 'class-transformer';



export enum ClientStateType {
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
    CONNECTION_LOST = "CONNECTION_LOST",
    CONNECTION_TERMINATED = "CONNECTION_TERMINATED",
    CONNECTION_ERROR = "ERROR",
    EVENT_RECEIVED = "EVENT_RECEIVED",
}


export class TokenInfo {
    token!:string;
    issued!: number;
    expires!: number;
}


export class AuthData {
    refresh!:TokenInfo;
    access!: TokenInfo;
}


export class OSStats {

    arch!: string;

    name!: string;

    type!: string;

    flavor!: string;

    version!: string;

    boot_time!: number;

    uptime!: number;

    system_datetime!: string;

    timezone!: string;

    average_load!: string;
}


export class CPUStats {

    max_frequency!: number;

    count!: number;

    percent!: number;
}


export class MemoryStats {

    total!: number;

    used!: number;

    free!: number;

    swap_total!: number;

    swap_used!: number;

    swap_free!: number;

    percent!: string;    
}



export class DiskStats {

    mountpoint!: string;

    fstype!:String;

    total!: string;

    used!: string;

    free!: string;

    percent!: string;
}




export class NetworkStats {

    id!: string;

    bytes_sent!: number;

    bytes_recv!: number;

    packets_sent!: number;

    packets_recv!: number;

    errin!: number;

    errout!: number;

    dropin!: number;

    dropout!: number;

    bytes_recv_rate!: number;
    
    bytes_sent_rate!: number;
}


export class SystemStats {

    @Type(() => OSStats)
    os!: OSStats;

    @Type(() => CPUStats)
    cpu!: CPUStats;

    @Type(() => MemoryStats)
    memory!: MemoryStats;

    @Type(() => DiskStats)
    disk!: DiskStats;

    @Type(() => NetworkStats)
    network!: NetworkStats;
}



export class Stats {

    @Type(() => SystemStats)
    system!: SystemStats;

    target!: any;
}



export class LogInfo {
    name?: string;

    topic?: string;

    constructor(name: string, topic: string) {
        this.name = name
        this.topic = topic
    }
}



export class RuleInfo {
    id?: string;
    description?: string;
    enabled?: boolean;
    subject?:string;
    trigger?:string;

    constructor(id: string, description: string, subject:string, enabled: boolean, trigger:string) {
        this.id = id
        this.description = description
        this.subject = subject
        this.trigger = trigger
        this.enabled = enabled
    }
}


export class ErrorData {
    message!: string;
    data!: object;
}


export class LogData {
    name!: string;    
    data!: string;
}


export class ScriptData {
    name!: string;    
    data!: string;
    state!:string;
}


export class SimpleNotificationData {
    message!: string;
    code!: number;
}


export class DatatNotificationData {
    message!: string;
    code!: number;
    data!:object
}



export class ClientState {
    state: ClientStateType;
    timestamp?: number;

    constructor(state: ClientStateType, timestamp?: number) {
        this.state = state
        this.timestamp = timestamp
    }
}


export class Credentials {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username
        this.password = password
    }
}


export class TopicData {
    topic: string
    data!: any
    timestamp!: number

    constructor(topic: string, data?: object) {
        this.topic = topic
        this.data = (data == undefined || data == null) ? undefined : data
    }

}


export class CloudisenseServiceEvent{
    name:string    
    topic!:string    
    state!:string
    data!:any
    meta!: any
    timestamp!:number

    constructor(name:string){
        this.name = name
    }

}

export enum EventType {
    UI = "UI",
    SCRIPT_EXECUTION = "SCRIPT_EXECUTION",
    NOTIFICATION = "NOTIFICATION",
    DATANOTIFICATION = "DATANOTIFICATION",
    DATA = "DATA",
    ERROR = "ERROR"
}

export abstract class CloudisenseClientEvent{
    topic!:string
    data:any
    meta!: any
    timestamp!:number

    public constructor(topic:string, data:any, meta:any,  timestamp:number){

        if (topic!==undefined){
            this.topic = topic
        }

        if (data!==undefined){
            this.data = data
        }

        if (meta!==undefined){
            this.meta = meta
        }
        
        if (timestamp!==undefined || !isNaN(timestamp)){
            this.timestamp = timestamp
        }
    }
}


export abstract class CloudisenseClientDataEvent extends CloudisenseClientEvent{
    type:EventType = EventType.DATA
    constructor(topic:string, data:any, meta:any,  timestamp:number){
        super(topic, data, meta,  timestamp)
    }
}

export abstract class CloudisenseClientNotificationEvent extends CloudisenseClientEvent{
    type:EventType = EventType.NOTIFICATION
    constructor(topic:string, data:any, meta:any,  timestamp:number){
        super(topic, data, meta,  timestamp)
    }
}


export class CloudisenseClientErrorEvent extends CloudisenseClientEvent{
    type:EventType = EventType.ERROR
    constructor(topic:string, data:any, meta:any,  timestamp:number){
        super(topic, plainToClass(ErrorData, data), meta,  timestamp)        
    }
}


export class CloudisenseClientSimpleNotificationEvent extends CloudisenseClientNotificationEvent{
    constructor(topic:string, data:any, meta:any,  timestamp:number){
        super(topic, plainToClass(SimpleNotificationData, data), meta,  timestamp)        
    }    
}

export class CloudisenseClientDataNotificationEvent extends CloudisenseClientNotificationEvent{
    constructor(topic:string, data:any, meta:any,  timestamp:number){
        super(topic, plainToClass(DatatNotificationData, data), meta,  timestamp)        
    }    
}

export class CloudisenseClientLogDataEvent extends CloudisenseClientDataEvent{
    constructor(topic:string, data:any, meta:any,  timestamp:number){
        super(topic, plainToClass(ScriptData, data), meta,  timestamp)
    }  
}


export class CloudisenseClientScriptDataEvent extends CloudisenseClientDataEvent{
    constructor(topic:string, data:any, meta:any,  timestamp:number){
        super(topic, plainToClass(ScriptData, data), meta,  timestamp)
    } 
}


export class CloudisenseClientStatsDataEvent extends CloudisenseClientDataEvent{
    constructor(topic:string, data:any, meta:any,  timestamp:number){
        super(topic, plainToClass(Stats, data), meta,  timestamp)
    } 
    
}




export class CloudisenseClientUIDataEvent extends CloudisenseClientDataEvent{
    type:EventType = EventType.UI
    constructor(topic:string, data:any, meta:any,  timestamp:number){
        super(topic, data, meta,  timestamp)
    } 
    
}