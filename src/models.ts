
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

import { Expose, plainToClass, Type } from 'class-transformer';



export enum ClientStateType {
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
    CONNECTION_LOST = "CONNECTION_LOST",
    CONNECTION_TERMINATED = "CONNECTION_TERMINATED",
    CONNECTION_ERROR = "ERROR",
    EVENT_RECEIVED = "EVENT_RECEIVED",
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

}


export class CPUStats {

    frequency!: string;

    count!: number;

    vendor!: string;

    model!: string;

    percent!: string;
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


export class CloudMechanikServiceEvent{
    name:string    
    topic!:string    
    state!:string
    data!:any
    meta!: any
    note!:string
    timestamp!:number

    constructor(name:string){
        this.name = name
    }

}

export enum EventType {
    NOTIFICATION = "NOTIFICATION",
    DATA = "DATA",
    ERROR = "ERROR"
}

export abstract class CloudMechanikClientEvent{
    topic!:string
    data:any
    meta!: any
    note!:string
    timestamp!:number

    public constructor(topic:string, data:any, meta:any, note:string, timestamp:number){

        if (topic!==undefined){
            this.topic = topic
        }

        if (data!==undefined){
            this.data = data
        }

        if (meta!==undefined){
            this.meta = meta
        }

        if (note!==undefined){
            this.note = note
        }
        
        if (timestamp!==undefined || !isNaN(timestamp)){
            this.timestamp = timestamp
        }
    }
}


export abstract class CloudMechanikClientDataEvent extends CloudMechanikClientEvent{
    type:EventType = EventType.DATA
    constructor(topic:string, data:any, meta:any, note:string, timestamp:number){
        super(topic, data, meta, note, timestamp)
    }
}

export abstract class CloudMechanikClientNotificationEvent extends CloudMechanikClientEvent{
    type:EventType = EventType.NOTIFICATION
    constructor(topic:string, data:any, meta:any, note:string, timestamp:number){
        super(topic, data, meta, note, timestamp)
    }
}


export class CloudMechanikClientErrorEvent extends CloudMechanikClientEvent{
    type:EventType = EventType.ERROR
    constructor(topic:string, data:any, meta:any, note:string, timestamp:number){
        super(topic, plainToClass(ErrorData, data), meta, note, timestamp)        
    }
}


export class CloudMechanikClientSimpleNotificationEvent extends CloudMechanikClientNotificationEvent{
    constructor(topic:string, data:any, meta:any, note:string, timestamp:number){
        super(topic, plainToClass(SimpleNotificationData, data), meta, note, timestamp)        
    }    
}

export class CloudMechanikClientDataNotificationEvent extends CloudMechanikClientNotificationEvent{
    constructor(topic:string, data:any, meta:any, note:string, timestamp:number){
        super(topic, plainToClass(DatatNotificationData, data), meta, note, timestamp)        
    }    
}

export class CloudMechanikClientLogDataEvent extends CloudMechanikClientDataEvent{
    constructor(topic:string, data:any, meta:any, note:string, timestamp:number){
        super(topic, plainToClass(ScriptData, data), meta, note, timestamp)
    }  
}


export class CloudMechanikClientScriptDataEvent extends CloudMechanikClientDataEvent{
    constructor(topic:string, data:any, meta:any, note:string, timestamp:number){
        super(topic, plainToClass(ScriptData, data), meta, note, timestamp)
    } 
}


export class CloudMechanikClientStatsDataEvent extends CloudMechanikClientDataEvent{
    constructor(topic:string, data:any, meta:any, note:string, timestamp:number){
        super(topic, plainToClass(Stats, data), meta, note, timestamp)
    } 
    
}