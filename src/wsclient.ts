/**
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


import { nanoid } from 'nanoid'
import { IServiceSocket, ISocketServiceObject } from "./interfaces";
import { ChannelEventProvider} from "./event/eventprovider"
import * as CHANNEL_STATES from './event/channelstates'
const Deferred = require('promise-deferred');
//var deferred = new Deferred();


const REQUEST_DELAYED_TIME_MILLISECONDS = 10000


export class RequestRecord{
    defer:typeof Deferred
    timestamp:number

    constructor (defer:typeof Deferred, timestamp:number) {
        this.defer = defer
        this.timestamp = timestamp
    }
}




export class WSClient extends ChannelEventProvider implements IServiceSocket {

    host: string;
    port: number;  
    authtoken:string;
    queryparams?: string | undefined;

    private _connectTimeout: number = 5000;

    private _connected:boolean;
    private _wsEndPoint!: string;

    private _client!:WebSocket;
    private _disconnectFlag:boolean

    private _requests:Map<string,RequestRecord>
    private _cleanupId:any

    

    constructor (config:ISocketServiceObject) {

        super()

        this._connected = false
        this._disconnectFlag = false
        this._requests = new Map<string,RequestRecord>()
        
        this.host = config.host
        this.port = config.port
        this.authtoken = config.authtoken
        this._wsEndPoint = "ws" + "://" + this.host + ":" + this.port + "/" + "ws" +  "?" + "token=" + this.authtoken;

        /* Auto cleanup */
        this._cleanupId = setInterval(() => this.cleanup_requests(), 30000);
    }
    

    private getSocketEndPoint():string { 
        return this._wsEndPoint;
     } 


    /**
     * Returns host IP/address of the socket endpoint 
     * @returns IP/hostname
     */
    public getHost():string{
        return this.host;
    }


    /**
     * Returns port number for websocket client
     * @returns port number
     */
    public getPort():number{
        return this.port;
    }


    /**
     * Connects websocket service to backend
     * 
     * @returns Promise which is resolved when connection is successful else rejected
     * 
     */
    public connectService():Promise<any>{

        return new Promise((resolve,reject) => {

            let resolved = false
            
            if(!this.is_connected())
            {
                if(this._client === undefined){
                    this._client = new WebSocket(this._wsEndPoint);
                }


                /**
                 * Handle socket error
                 */
                this._client.onerror = (error:any)=>{
                    this._connected = false                    
                    this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_ERROR);                   
                    console.error('Socket Error: ' + error.toString()); 

                    if(!resolved){                
                        reject(error) 
                        resolved = true
                    }                   
                };

                
                /**
                 * Handle socket connect
                 */
                this._client.onopen = (e:any)=>{
                    this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_CONNECTED);
                    this._connected = true

                    if(!resolved){
                        resolve(this)
                        resolved = true
                    } 
                };

                
                /**
                 * Handle socket close
                 */
                this._client.onclose = (event) => {                    
                    this._connected = false
                    if(this._disconnectFlag && event.wasClean){
                        this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_DISCONNECTED);
                    }else{
                        this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_CONNECTION_LOST);
                    }
                };



                /**
                 * Handle socket message
                 */
                this._client.onmessage = (event) => {                    
                    
                    if(typeof event.data === "string")
                    {
                        const message = event.data;
                        console.debug("Received: '" + message + "'");
                        try 
                        {
                            let data = JSON.parse(message);
                            if(data.hasOwnProperty('type') && (data["type"] == "rpc" || data["type"] == "rpc_response"))
                            {
                                this.resolve_request(data)
                            }
                            else
                            {
                                this._onChannelData.dispatch(data)
                                this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_DATA);
                            }
                        }
                        catch (e) 
                        {
                            throw new TypeError("Unexpected message type (not JSON) : " + String(e));
                        }
                    }
                    else if(event.data instanceof Blob)
                    {
                        throw new TypeError("Invalid message type [Blob]");
                    }
                    else if(event.data instanceof ArrayBuffer)
                    {
                        throw new TypeError("Invalid message type [ArrayBuffer]");
                    }                    
                };

                setTimeout(()=>{
                    if(!resolved){                
                        reject("Connect timeout") 
                        resolved = true
                    }

                }, this._connectTimeout);
                               
            }
        });
    }


    
    /**
     * Disconnects websocket on demand and cleans the websocket object + handlers
     */
    public disconnectService():void{
        if (this.is_connected()){
            // use flag to see if disconnect was requested or automatic
            this._disconnectFlag = true
            setTimeout(() => {
                this._disconnectFlag = false
            }, 3000);

            try{
                this._client.close()                
            }catch(error){
                throw error
            }finally{
                this._clear_handlers()                
            }
            
        }else{
            throw new Error("socket is not connected");
        }
    }


    /**
     * Clears up websocket callback handlers
     */
    private _clear_handlers():void{

        if(this._client != null && this._client != undefined){
            
            this._client.onmessage = null
            this._client.onopen = null
            this._client.onerror = null
            this._client.onclose = null
        }
    }
    


    /**
     * Checks to see whether socket is conencted or not.
     * @returns true is socket is conencted, false otherwise
     */
    public is_connected():boolean{
        if(this._connected === undefined){
            return false;
        }else{
            return this._connected;
        }
    }


    /**
     * Builds JSON request format for RPC with Cloudisense backend
     * 
     * @param requestid 
     * @param intent 
     * @param params 
     * @returns 
     */
    private buildRequest(requestid:string, intent:string, params:object)
    {
        return {
            "requestid": requestid,
            "intent": intent,
            "type": "rpc",
            "params": params
        }
    }


    /**
     * Makes RPC request to server with an intent and parameter map
     * `
     * @param methodName 
     * @param params 
     */
    public doRPC(intent:string, params?:object):Promise<any>{

        if(params == undefined || params == null){
            params = {}
        }
        
        let requestid = nanoid();
        let request = this.buildRequest(requestid, intent, params)
        let deferred = new Deferred();
        let record = new RequestRecord(deferred, new Date().getUTCMilliseconds())

        if (this.is_connected()) {                                
                
            try{
                setTimeout(() => {
                    this._client.send(JSON.stringify(request))
                }, 10);                    
            }catch(err){
                console.error("Unable to send request")
            }
        }else{
            console.error("Socket is not connected")
        };

        this._requests.set(requestid, record)        
        return deferred.promise;
    }



    /**
     * Cleans up old/delayed requests from the requests queue
     * by looking up request timestamp. Requests are thereby rejected
     * with a timeout error.
     */
    private cleanup_requests():void
    {
        const now = new Date().getUTCMilliseconds()
        this._requests.forEach((value,requestid,map)=>{
            const record:RequestRecord  =  (value as RequestRecord)
            const request_timestamp = record.timestamp
            if(now - request_timestamp > REQUEST_DELAYED_TIME_MILLISECONDS)
            {
                try
                {
                    const defer:typeof Deferred =  record.defer
                    defer.reject("RPC Timed out")
                }
                catch(e)
                {
                    console.error(e)
                }
                finally
                {
                    map.delete(requestid)
                }
                
            }
        });        
    }


    /**
     * Determined whether a RPC was successful or not and accordingly
     * resolves or rejects the client promise
     * @param response 
     */
    private resolve_request(response:any):void
    {
        let requestid = response["requestid"]

        try{            
            let response_timestamp =  response["timestamp"]
            let def:typeof Deferred = this._requests.get(requestid)?.defer

            if(response["status"] == "success")
            {
                let data = response["data"]
                def.resolve(data)
            }
            else if(response["status"] == "error")
            {
                let error_message = response["message"]
                def.reject(error_message)        
            }
        }
        catch(e){
            console.error("Error processing request");            
        }
        finally{
            this._requests.delete(requestid)
        }
    }
}