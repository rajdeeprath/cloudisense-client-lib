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

const WebSocketClient = require('websocket').client; // https://www.npmjs.com/package/websocket
const Defer = require('defer-promise')
import { nanoid } from 'nanoid'
import { IServiceSocket, ISocketServiceObject } from "./interfaces";
import { ChannelEventProvider} from "./event/eventprovider"
import * as CHANNEL_STATES from './event/channelstates'



export class RequestRecord{
    defer:typeof Defer
    timestamp:number

    constructor (defer:typeof Defer, timestamp:number) {
        this.defer = defer
        this.timestamp = timestamp
    }
}




export class WSClient extends ChannelEventProvider implements IServiceSocket {

    host: string;
    port: number;  
    authtoken: string;
    queryparams?: string | undefined;

    private _connected:boolean;
    private _wsEndPoint!: string;

    private _client:typeof WebSocketClient;
    private _connection:any
    private _disconnectFlag:boolean

    private _requests:Map<string,RequestRecord>
    private _cleanupId:any

    

    constructor (config:ISocketServiceObject) {

        super()

        this._connected = false
        this._disconnectFlag = false
        this._client = undefined
        this._requests = new Map<string,RequestRecord>()
        
        this.host = config.host
        this.port = config.port
        this.authtoken = config.authtoken
        this._wsEndPoint = "ws" + "://" + this.host + ":" + this.port + "/" + "ws?" + "token=" + this.authtoken;

        /* Auto cleanup */
        this._cleanupId = setInterval(() => this.cleanup_requests(), 30000);
    }
    

    private getSocketEndPoint():string { 
        return this._wsEndPoint;
     } 


    public getHost():string{
        return this.host;
    }


    public getPort():number{
        return this.port;
    }


    public connect():Promise<any>{

        return new Promise((resolve,reject) => {

            if(this._client == undefined)
            {

                this._connection = undefined
                this._client = new WebSocketClient();

                
                this._client.on('connectFailed', (error:any) => {
                    this._connected = false
                    console.log('Connect Error: ' + error.toString()); 
                    this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_ERROR);                   
                    reject(error)
                });
                

                this._client.on('connect', (connection:any) => {

                    console.info('WebSocket Client Connected');
                    this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_CONNECTED);

                    this._connected = true
                    this._connection = connection

                    connection.on('error', (error:any) => {
                        this._connected = false
                        console.error("Connection Error: " + error.toString());
                        this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_ERROR);
                    });

                    connection.on('close', () => {
                        this._connected = false
                        console.debug('protocol Connection Closed');
                        if(this._disconnectFlag){
                            this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_DISCONNECTED);
                        }else{
                            this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_CONNECTION_LOST);
                        }
                    });                    

                    connection.on('message', (message:any) => {
                        if (message.type === 'utf8') {
                            console.debug("Received: '" + message.utf8Data + "'");

                            try 
                            {
                                let data = JSON.parse(message.utf8Data);
                                if(data.hasOwnProperty('type') && data["type"] == "rpc")
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
                                console.error("Unexpected message type (not JSON) : " + String(e))
                            }                            
                        }
                        
                    });

                    resolve(this)
                });
            }


            if (!this._connected || this._client.Closed){
                this._onChannelState.dispatch(CHANNEL_STATES.STATE_CHANNEL_CONNECTIING);
                this._client.connect(this._wsEndPoint);
            }else{
                console.error("socket is already connected");
            }
        });        
    }


    public disconnect():void{
        if (this._connected){
            // use flag to see if disconnect was requested or automatic
            this._disconnectFlag = true
            setTimeout(() => {
                this._disconnectFlag = false
            }, 5000);

            this._client.close()
        }else{
            console.error("socket is not connected");
        }
    }


    public is_connected():boolean{
        if(this._connection == undefined){
            return false;
        }else{
            return this._connection.connected;
        }
    }


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
     * Makes RPC request to server
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
        let deferred = new Defer()

        if (this._connection != undefined && this._connection.connected) {                                
                
            try{
                setTimeout(() => {
                    this._connection.sendUTF(JSON.stringify(request));    
                }, 10);                    
            }catch(err){
                console.error("Unable to send request")
            }
        }else{
            console.log("Socket is not connected")
        };

        this._requests.set(requestid, new RequestRecord(deferred, new Date().getUTCMilliseconds()))        
        return deferred.promise;
    }




    private cleanup_requests():void
    {
        const now = new Date().getUTCMilliseconds()
        this._requests.forEach((value,requestid,map)=>{
            const record:RequestRecord  =  (value as RequestRecord)
            const request_timestamp = record.timestamp
            if(now - request_timestamp > 10000)
            {
                try
                {
                    const defer:typeof Defer =  record.defer
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



    private resolve_request(response:any):void
    {
        let requestid = response["requestid"]

        try{            
            let response_timestamp =  response["timestamp"]
            let def:typeof Defer = this._requests.get(requestid)?.defer

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