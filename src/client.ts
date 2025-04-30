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


import 'reflect-metadata';
import { IServiceClient, IServiceSocket, IClientConfig } from "./interfaces";
import { WSClient} from "./wsclient";
import { sha256, sha224 } from 'js-sha256';
import { EventList, IEventHandler } from "strongly-typed-events";
import { ClientEventProvider } from "./event/eventprovider";
import { Base64 } from 'js-base64';
import { CloudisenseServiceEvent, ClientStateType, ClientState, LogData, LogInfo, Credentials, ScriptData, Stats, SimpleNotificationData, CloudisenseClientStatsDataEvent, CloudisenseClientLogDataEvent, CloudisenseClientSimpleNotificationEvent, CloudisenseClientErrorEvent, AuthData, RuleInfo, CloudisenseClientUIDataEvent, CloudisenseClientScriptDataEvent } from "./models";
import { TOPIC_SCRIPT_MONITORING, TOPIC_LOG_MONITORING, TOPIC_STATS_MONITORING, TOPIC_UI_UPDATES } from "./event/events";
import * as CHANNEL_STATES from './event/channelstates'
import * as EVENTS from './event/events'
import axios from 'axios';
import { plainToInstance } from 'class-transformer';


export class CloudisenseApiClient extends ClientEventProvider implements IServiceClient {

    host: string;
    port: number;
    autoconnect?: boolean;
    reconnectOnFailure?: boolean;
    authdata:AuthData;

    private _socketservice!: IServiceSocket;
    private _restEndPoint:string;
    private _authtime!: number;

    private _lastCredentials!:Credentials;
    private _errorCount:number;
    private static MAX_ERROR_TOLERANCE:number = 5;

    private _topicevents = new EventList<IServiceClient, any>();




    constructor (config:IClientConfig) {      
        
        super()

        this._errorCount = 0;
        
        this.host = config.host
        this.port = config.port
        this.authdata = config.authdata!;
        this.autoconnect = (typeof config.autoconnect === 'undefined' || config.autoconnect === null)?false:config.autoconnect
        this.reconnectOnFailure = (typeof config.reconnectOnFailure === 'undefined' || config.reconnectOnFailure === null)?false:config.reconnectOnFailure


        this._restEndPoint = "http" + "://" + this.host + ":" + this.port // fix this later

        return this
    }
    


    /**
     * Subscribes to a specific DataEvent topic
     * 
     * @param topicname topic name to subscribe to 
     * @param fn subscriber handler function 
     */
    subscribeTopic(topicname: string, fn: IEventHandler<IServiceClient, any>): Function {
        return this._topicevents.get(topicname).subscribe(fn)
    }



    /**
     * Unsubscribes from a specific DataEvent topic. The handler is executed at most once
     * 
     * @param topicname topic name to unsubscribe from
     * @param fn subscriber handler function 
     */
    unsubscribeTopic(topicname: string, fn: IEventHandler<IServiceClient, any>): void {
        this._topicevents.get(topicname).unsubscribe(fn)
    }



    /**
     * Checks to see if a given DataEvent topic has a handler registered against it or not
     * 
     * @param topicname 
     * @param fn 
     */
    hasTopicHandler(topicname: string, fn: IEventHandler<IServiceClient, any>): boolean {
        return this._topicevents.get(topicname).has(fn)
    }





    /**
     * Gets the root path of the filesystem (constrained by sandbox)
     * 
     * @returns Promise that resolved to root path data of the filesystem
     */
    public get_accessible_file_system_paths():Promise<any>
    {
        return new Promise((resolve,reject) => {

            let promise: Promise<any> = this._socketservice.doRPC("get_accessible_paths", {})
            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }



    /**
     * Requests deletion of a file from the file system
     * 
     * @param path The path of the file to delete
     * @returns Promise that resolves to nothing if operation is successful and error if unsuccessful
     */
    public delete_file(path:string):Promise<any>
    {
        return new Promise((resolve,reject) => {

            let promise: Promise<any> = this._socketservice.doRPC("delete_file", 
            {
                "path": path
            })

            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }



    /**
     * Requests deletion of a directory from the file system
     * 
     * @param path The path of the directory to delete
     * @returns Promise that resolves to nothing if operation is successful and error if unsuccessful
     */
    public delete_folder(root:string, dirname:string, deleteNonEmpty:boolean = false):Promise<any>
    {
        return new Promise((resolve,reject) => {

            let promise: Promise<any> = this._socketservice.doRPC("delete_folder", 
            {
                "root": root,
                "dirname": dirname,
                "delete_non_empty": deleteNonEmpty
            })

            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }



    /**
     * Requests the download file from the file system (within allowed scope)
     * 
     * @param path The path of the file to download
     * @returns Promise that resolves to a download link if operation is successful and error if unsuccessful
     */
    public download_file(path:string, mode:string = "static"):Promise<any>
    {
        return new Promise((resolve,reject) => {

            let promise: Promise<any> = this._socketservice.doRPC("download_file", 
            {
                "path": path,
                "mode": mode
            })

            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }




    /**
     * Gets content listing of the file system path specified
     * 
     * @returns Promise that resolved to path content (if any)
     */
    public list_path_content(root:string, path:string = ""):Promise<any>
    {
        return new Promise((resolve,reject) => {

            let promise: Promise<any> = this._socketservice.doRPC("list_content", 
            {
                "root": root,
                "path": path
            })

            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }



    /**
     * Fetched the content of a simple text file from server
     * 
     * @returns 
     */
    public read_file(path:string):Promise<string>
    {
        const promise:Promise<any> = new Promise((resolve,reject) => {

            const url = this.getBaseAPIendPoint() + "/file/read"

            const params = new URLSearchParams()
            params.append('path', path)
    
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
    
            const promise = axios.post(url, params, config)
    
            promise.then((result:any) => {

                if(result.status == 200)
                {
                    const content = Base64.decode(result.data.data as string)
                    console.debug(content)
                    resolve(content)
                }
                else
                {
                    throw new Error("Invalid or unexpected response")
                }
            })
            .catch((err:any) => {
                console.error(err.toString())
                reject(err)
            })    

        });

        return promise
    }


    /**
     * Saves the content of a simple text file on server
     * 
     * @returns 
     */
    public write_file(path:string, content:string):Promise<void>
    {
        const promise:Promise<any> = new Promise((resolve,reject) => {

            const url = this.getBaseAPIendPoint() + "/file/write"

            const params = new URLSearchParams()
            params.append('path', path)
            params.append('content', Base64.encode(content))
    
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
    
            const promise = axios.post(url, params, config)
    
            promise.then((result:any) => {
                if(result.status == 200)
                {
                    const content = Base64.decode(result.data.data as string)
                    console.debug(content)
                    resolve(content)
                }
                else
                {
                    throw new Error("Invalid or unexpected response")
                }              
            })
            .catch((err:any) => {
                console.error(err.toString())
                reject(err)
            })    

        });

        return promise
    }



    /**
     * Gets list of accessible logs
     * 
     * @returns Promise that resolved to List of logs
     */
    public get_logs():Promise<Array<LogInfo>>
    {
        return new Promise((resolve,reject) => {

            let promise: Promise<any> = this._socketservice.doRPC("list_logs")
            promise.then((data:Array<LogInfo>)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }



    /**
     * Gets list of reaction engine rules
     * 
     * @returns Promise that resolved to List of ReactionRules
     */
    public list_rules(head:boolean = true):Promise<Array<RuleInfo>>
    {
        return new Promise((resolve,reject) => {

            let promise: Promise<any> = this._socketservice.doRPC("list_rules", {"head": head})
            promise.then((data:Array<RuleInfo>)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }



    /**
     * Attempts to reloads all reaction rules in the system
     * 
     * @returns Promise that resolved to nothing
     */
    public reload_rules():Promise<any>
    {
        return new Promise((resolve,reject) => {

            let promise: Promise<any> = this._socketservice.doRPC("reload_rules", {})
            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }




    /**
     * Attempts to reloads a reaction rules by specified id 
     * in the system
     * 
     * @returns Promise that resolved to id of the reaction rule
     */
    public reload_rule(id:string):Promise<any>
    {
        return new Promise((resolve,reject) => {

            let promise: Promise<any> = this._socketservice.doRPC("reload_rule", {"rule_id": id})
            promise.then((data:any)=>{
                resolve(id)
            }).catch((err)=>{
                reject(err)
            });

        });
    }




     /**
     * Gets rule data of a reaction engine rule by specified id
     * 
     * @returns Promise that resolved to Rule data
     */
     public get_rule(id:string):Promise<any>
     {
         return new Promise((resolve,reject) => {
 
             let promise: Promise<any> = this._socketservice.doRPC("read_rule", {"rule_id": id})
             promise.then((data:any)=>{
                 resolve(data)
             }).catch((err)=>{
                 reject(err)
             });
 
         });
     }



     /**
     * Requests service to initiate restart via systemctl.
     * Server should have sufficient permissions to execute the command
     * 
     * @returns Promise that resolved to nothing (no return value)
     */
     public request_restart(id:string):Promise<any>
     {
         return new Promise((resolve,reject) => {
 
             let promise: Promise<any> = this._socketservice.doRPC("restart_self", {})
             promise.then((data:any = null)=>{
                 resolve(data)
             }).catch((err)=>{
                 reject(err)
             });
 
         });
     }




     /**
     * Requests to load settings / configuration information from the server
     * 
     * @returns Promise that resolved to settings data
     */
     public loadSettings():Promise<any>
     {
         return new Promise((resolve,reject) => {
 
             let promise: Promise<any> = this._socketservice.doRPC("get_configuration", {})
             promise.then((data:any)=>{
                 resolve(data)
             }).catch((err)=>{
                 reject(err)
             });
 
         });
     }

     


    /**
     * Gets sample reaction rule data from server
     * 
     * @returns Promise that resolved to Rule data
     */
     public generate_sample_rule():Promise<any>
     {
         return new Promise((resolve,reject) => {
 
             let promise: Promise<any> = this._socketservice.doRPC("generate_sample", {})
             promise.then((data:any)=>{
                 resolve(data)
             }).catch((err)=>{
                 reject(err)
             });
 
         });
     }






     /**
     * Saves rule data of a reaction engine rule on server
     * 
     * @returns Promise that resolved to Rule Id on successful write
     */
     public write_rule(data:string, update=true):Promise<any>
     {
         return new Promise((resolve,reject) => {
 
             let promise: Promise<any> = this._socketservice.doRPC("write_rule", {"rule_data": data, "update": update})
             promise.then((response:any)=>{
                 resolve(response)
             }).catch((err)=>{
                 reject(err)
             });
 
         });
     }




    /**
     * Deletes a rule by specified id
     * 
     * @returns Promise that resolves to the id of the deleted rule
     */
    public delete_rule(id:string):Promise<string>
    {
        return new Promise((resolve,reject) => {
            let promise: Promise<any> = this._socketservice.doRPC("delete_rule", {"rule_id": id})
            promise.then(()=>{
                resolve(id)
            }).catch((err)=>{
                reject(err)
            });
        });
    }




    /**
     * Subscribes to arbitrary data channel (topic path) to get realtime data
     * 
     * @returns Promise that resolved to subscribable topic path for the data channel for stats
     */
    public subscribe_datachannel(topic:string):Promise<any> 
    {
        return new Promise((resolve,reject) => {

            let payload = {
                "topic": topic
            }
            let promise: Promise<any> = this._socketservice.doRPC("subscribe_channel", payload)
            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }



    /**
     * Subscribes to stats channel (topic path) to get realtime data
     * 
     * @returns Promise that resolved to subscribable topic path for the data channel for stats
     */
    public subscribe_stats():Promise<any>
    {
        return new Promise((resolve,reject) => {

            let payload = {
                "topic": TOPIC_STATS_MONITORING
            }
            let promise: Promise<any> = this._socketservice.doRPC("subscribe_channel", payload)
            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }



    

    /**
     * Subscribes to ui updates channel (topic path) to get data updates for dashboard widgets
     * 
     * @returns Promise that resolved to subscribable topic path for the data channel for stats
     */
    public subscribe_ui_updates():Promise<any>
    {
        return new Promise((resolve,reject) => {

            let payload = {
                "topic": TOPIC_UI_UPDATES
            }
            let promise: Promise<any> = this._socketservice.doRPC("subscribe_channel", payload)
            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }




    /**
     * Unsubscribes from stats channel (topic path) to get realtime data
     * 
     * @returns Promise that resolved to boolean true on unsubscribe success
     */
    public unsubscribe_stats():Promise<any>
    {
        return new Promise((resolve,reject) => {

            let payload = {
                "topic": TOPIC_STATS_MONITORING
            }
            let promise: Promise<any> = this._socketservice.doRPC("unsubscribe_channel", payload)
            promise.then((data:any)=>{
                resolve(true)
            }).catch((err)=>{
                reject(err)
            });

        });
    }
    


    /**
     * Subscribes to log channel (topic path) to get realtime data
     * 
     * @param topic 
     * @returns Promise that resolved to subscribable topic path for the data channel of thsi log
     */
    public subscribe_log(topic: string):Promise<any>
    {
        return new Promise((resolve,reject) => {

            let payload = {
                "topic": topic
            }
            let promise: Promise<any> = this._socketservice.doRPC("subscribe_channel", payload)
            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }


    /**
     * 
     * Unsubscribes from a log channel
     * 
     * @param logkey 
     * @returns 
     */
    public unsubscribe_log(topic: string):Promise<void>
    {
        return new Promise((resolve,reject) => {

            let payload = {
                "topic": topic
            }
            let promise: Promise<any> = this._socketservice.doRPC("unsubscribe_channel", payload)
            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }


    /**
     * Requests to download a log file from server
     * 
     * @param logkey 
     * @returns 
     */
    public download_log(logkey: string, mode:string = "static"):Promise<string>
    {
        const promise:Promise<any> = new Promise((resolve,reject) => {

            const url = this.getBaseAPIendPoint() + "/log/download/" + mode
            const params = new URLSearchParams()
            params.append('logname', logkey)
    
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
    
            const promise = axios.post(url, params, config)
    
            promise.then((result:any) => {

                if(result.data.status == "success")
                {
                    const download_url = this.getBaseAPIendPoint() + "/" + result.data.data
                    resolve(download_url) 
                }
                else
                {
                    throw new Error('Exception response received ' + JSON.stringify(result));
                }
                               
            })
            .catch((err:any) => {
                reject(err)
            })    

        });

        return promise
    }



    /**
     * Gets list of system services that can be started/stopped through the service
     * 
     * @returns 
     */
    public get_system_services():Promise<string[]>
    {
        return new Promise((resolve,reject) => {
            let promise: Promise<any> = this._socketservice.doRPC("list_targets")
            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }



    /**
     * Starts a system service using its name
     * 
     * @param name 
     * @returns 
     */
    public start_service(name: string):Promise<void>
    {
        return new Promise((resolve,reject) => {
            let payload = {
                "module": name
            }
            let promise: Promise<any> = this._socketservice.doRPC("start_target", payload)
            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }


    
    /**
     * Stops a system service using its name
     * 
     * @param name 
     * @returns 
     */
    public stop_service(name: string):Promise<void>
    {
        return new Promise((resolve,reject) => {
            let payload = {
                "module": name
            }
            let promise: Promise<any> = this._socketservice.doRPC("stop_target", payload)
            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }


    /**
     * Restarts a system service using its name
     * 
     * @param name 
     * @returns
     */
    public restart_service(name: string):Promise<void>
    {
        return new Promise((resolve,reject) => {
            let payload = {
                "module": name
            }
            let promise: Promise<any> = this._socketservice.doRPC("restart_target", payload)
            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }





    /**
     * 
     * Execute arbitrary intent request
     * 
     * @param intent
     * @param params 
     * @returns 
     */
    public execute_arbitrary_action(intent:string, params:any):Promise<void>
    {
        return new Promise((resolve,reject) => {
            let promise: Promise<any> = this._socketservice.doRPC(intent, params)
            promise.then((data:any)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            });

        });
    }





    /**
     * Sends a query string to the smart assist system via RPC.
     * 
     * @param query - The input query to be processed by smart assist.
     * @returns Promise that resolves with the response data from the smart assist system.
     */
    public query_smart_assist(query: string): Promise<any>
    {
        return new Promise((resolve, reject) => {

            let promise: Promise<any> = this._socketservice.doRPC("query_assist", { "query": query });
            promise.then((data: any) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });

        });
    }





    /**
     * Resets or clears the current smart assist session on the server.
     * 
     * @param query - (Unused) Reserved for future input parameters.
     * @returns Promise that resolves with the result of the session reset operation.
     */
    public reset_smart_assist_session(query: string): Promise<any>
    {
        return new Promise((resolve, reject) => {

            let promise: Promise<any> = this._socketservice.doRPC("clear_assist_session", {});
            promise.then((data: any) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });

        });
    }




    /**
     * Sends an introduction request to the smart assist service.
     * 
     * This function triggers the assistant to introduce itself or provide 
     * an initial greeting via RPC. Typically used at the start of a session.
     * 
     * @returns Promise that resolves with the assistant's introductory message.
     */
    public smart_assist_introduce(): Promise<any>
    {
        return new Promise((resolve, reject) => {

            let promise: Promise<any> = this._socketservice.doRPC("assist_introduction", {});
            promise.then((data: any) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });

        });
    }




    /**
     * Connects to backend service using auth data from previous authentication
     * 
     * @param authData 
     * @returns Promise
     */
    public connectWithAuthData(authData:AuthData):Promise<any>{   

        return new Promise((resolve,reject) => {

            this.__wsconnect(authData).then((wsclient) => {
                resolve(wsclient);
            })
            .catch((err) => {
                reject(err);
            });

        });
    }




    /**
     * Connects to backend service using a set of valid credentials
     * 
     * @param username 
     * @param password 
     * @returns 
     */
    public connectWithCredentials(username:string, password:string):Promise<any>{        

        return new Promise((resolve,reject) => {

            var hashed_password = sha256.create().update(password).hex();
            this.authenticate(username, hashed_password).then((res) => {
                if(res.status == 200){
                    const authData = plainToInstance(AuthData, res.data.data);
                    this._authtime = new Date().getUTCMilliseconds()                    
                    this.__wsconnect(authData).then((wsclient) => {
                        resolve(wsclient);
                    })
                    .catch((err) => {
                        reject(err);
                    });
                }else{
                    reject("Authentication failed with code " + res.status);
                }
            }).catch((err) => {
                this._errorCount++;              
                const message:string = err.toString()
                if(message.indexOf("ECONNREFUSED")>0){
                    if(this.reconnectOnFailure){
                        this.attemptReconnect()
                    }
                }else{
                    reject(err);
                }
            })
        });        
    }



    private __wsconnect(tokenData:object):Promise<any> {
        return new Promise((resolve,reject) => {


            const socket_client = new WSClient({
                host: this.host,
                port: this.port,
                authtoken:this.authdata.access.token
            })
            .connectService()
            .then((client)=> {
                this._errorCount = 0;
                this._socketservice = client
                this._onClientStateUpdate.dispatch(new ClientState(ClientStateType.CONNECTED))
                this._socketservice.onChannelData.subscribe((data:any) => {
                    this.processChannelData(data)
                });
                this._socketservice.onChannelState.subscribe((state:string) => {
                    switch(state)
                    {
                        case CHANNEL_STATES.STATE_CHANNEL_ERROR:                                
                        this._onClientStateUpdate.dispatch(new ClientState(ClientStateType.CONNECTION_ERROR)) 
                        this._errorCount++;
                        if(this.reconnectOnFailure){
                            // try to connect again
                            this.attemptReconnect();
                        }
                        break;

                        case CHANNEL_STATES.STATE_CHANNEL_DISCONNECTED:
                        this._onClientStateUpdate.dispatch(new ClientState(ClientStateType.CONNECTION_TERMINATED)) 
                        break;

                        case CHANNEL_STATES.STATE_CHANNEL_CONNECTION_LOST:
                        this._onClientStateUpdate.dispatch(new ClientState(ClientStateType.CONNECTION_LOST)) 
                        if(this.reconnectOnFailure){
                            // try to connect again                                    
                                this.attemptReconnect()
                        }
                        break;

                        case CHANNEL_STATES.STATE_CHANNEL_CONNECTIING:
                        this._onClientStateUpdate.dispatch(new ClientState(ClientStateType.CONNECTING)) 
                        break;
                    }
                });

                resolve(socket_client);
            })
            .catch((err)=> {
                reject(err);
            })
        });
    }


    /**
     * Returns a boolean promise to help determine if socket si conencted or not
     * @returns 
     */
    public connected():Promise<boolean>{   
        return new Promise((resolve,reject) => {
            if(this._socketservice && this._socketservice.is_connected()){
                resolve(true);
            }else{
                reject(false)
            }
        });
    }



    /**
     * Disconnects the client if connected to the server, otherwise
     * throws error.
     */
    public disconnect():Promise<any>{   
        return new Promise((resolve,reject) => {
            if(this._socketservice && this._socketservice.is_connected()){                
                this._socketservice.disconnectService();
                resolve(this._socketservice);            
            }else{
                reject("Unable to disconnect service");
            }
        });
    }



    /**
     * Attempts to reconenct back to service using last successful credentials
     */
    private attemptReconnect():void
    {
        console.log("Attempting to reconnect")

        if(this.authdata != undefined && this.authdata != null){

            if(this._errorCount<CloudisenseApiClient.MAX_ERROR_TOLERANCE){
                
                setTimeout(() => {
                    this.connectWithAuthData(this.authdata);    
                }, 5000);               
            }
            else
            {
                throw new Error("too many connection failures")                                        
            }
        }
    }



    /**
     * Process push data from server and dispatch events for client
     * 
     * @param data 
     */
    private processChannelData(data:any):void{

        if(data["type"] == "event")
        {
            let notificationData = undefined;
            let event:CloudisenseServiceEvent = data as CloudisenseServiceEvent                  
            this._onClientStateUpdate.dispatch(new ClientState(ClientStateType.EVENT_RECEIVED))

            
            switch(event.name)
            {
                case EVENTS.SERVER_PING_EVENT:
                    console.debug("Server ping message")
                    break;
                
                case EVENTS.TEXT_NOTIFICATION_EVENT:
                    this._onTextNotificationEvent.dispatchAsync(new CloudisenseClientSimpleNotificationEvent(event.topic, event.data, event.meta, event.timestamp))
                    break;  

                    
                case EVENTS.EVENT_UI_UPDATE:
                    this._onUIEvent.dispatchAsync(new CloudisenseClientUIDataEvent(event.topic, event.data, event.meta, event.timestamp))
                    this._dispatchTopicOrientedDataEvent(event) 
                    break; 


                case EVENTS.TEXT_DATA_NOTIFICATION_EVENT:
                    this._onTextNotificationEvent.dispatchAsync(new CloudisenseClientSimpleNotificationEvent(event.topic, event.data, event.meta, event.timestamp))
                    this._dispatchTopicOrientedDataEvent(event)                    
                    break

                
                case EVENTS.ERROR_EVENT:
                    this._dispatchTopicOrientedErrorEvent(event)
                    break;
                
                case EVENTS.DATA_EVENT:
                    this._dispatchTopicOrientedDataEvent(event)
                    break;

                default:
                    console.error("Unrecognized event type")
                    break
            }
        }

    }


    /**
     * Dispatches topic specific error event with topic specific data 
     * @param event 
     */
    private _dispatchTopicOrientedErrorEvent(event:CloudisenseServiceEvent):void
    {
        const topic:string = event.topic

        switch(topic)
        {
            case (topic.startsWith(TOPIC_LOG_MONITORING))?topic:null:
            case (topic.startsWith(TOPIC_SCRIPT_MONITORING))?topic:null:
            case (topic.startsWith(TOPIC_STATS_MONITORING))?topic:null:
            case (topic.startsWith(TOPIC_UI_UPDATES))?topic:null:
            case (topic.startsWith(EVENTS.TOPIC_UI_INITIALIZATION))?topic:null:
                this._topicevents.get(topic).dispatchAsync(this, new CloudisenseClientErrorEvent(event.topic, event.data, event.meta, event.timestamp))
                break;

            default:
                console.error("Error for unexpected topic:"+topic)
                break;
        }

    }



    /**
     * Dispatches topic specific event with topic specific data - (generic)
     * 
     * @param event 
     */
    private _dispatchTopicOrientedDataEvent(event:CloudisenseServiceEvent):void
    {        
        const topic:string = event.topic

        switch(topic)
        {

            case (topic.startsWith(TOPIC_LOG_MONITORING))?topic:null:
                this._topicevents.get(topic).dispatchAsync(this, new CloudisenseClientLogDataEvent(event.topic, event.data, event.meta, event.timestamp))
                break;

            case (topic.startsWith(TOPIC_SCRIPT_MONITORING))?topic:null:
                this._topicevents.get(topic).dispatchAsync(this, new CloudisenseClientScriptDataEvent(event.topic, event.data, event.meta, event.timestamp))
                break;

            case (topic.startsWith(TOPIC_STATS_MONITORING))?topic:null:
                this._topicevents.get(topic).dispatchAsync(this, new CloudisenseClientStatsDataEvent(event.topic, event.data, event.meta, event.timestamp))
                break;

            case (topic.startsWith(TOPIC_UI_UPDATES))?topic:null:
                this._topicevents.get(topic).dispatchAsync(this, new CloudisenseClientUIDataEvent(event.topic, event.data, event.meta, event.timestamp))
                break;    

            default:
                console.debug("Event for topic:"+topic)
                break;
        }
    }



    private getBaseAPIendPoint():string{
        return this._restEndPoint;
    }

    

    /**
     * Authenticates a user based on username and password
     * 
     * @param username 
     * @param password 
     * @returns 
     */
    private authenticate(username:string, password:string):Promise<any>{

        return new Promise((resolve,reject) => {

            const url = this.getBaseAPIendPoint() + "/" + "authorize"

            const params = new URLSearchParams()
            params.append('username', username)
            params.append('password', password)
    
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
    
            const promise = axios.post(url, params, config)
    
            promise.then((result:any) => {
                console.debug(result)
                resolve(result)                
            })
            .catch((err:any) => {
                console.error(err.toString())
                reject(err)
            })    
        });
    }    



    public dispose():void
    {
        // TO DO cleanup
    }

}