import 'reflect-metadata';
import { IServiceClient, IClientConfig } from "./interfaces";
import { IEventHandler } from "strongly-typed-events";
import { ClientEventProvider } from "./event/eventprovider";
import { LogInfo } from "./models";
export declare class CloudMechanikApiClient extends ClientEventProvider implements IServiceClient {
    host: string;
    port: number;
    autoconnect?: boolean;
    reconnectOnFailure?: boolean;
    private _socketservice;
    private _restEndPoint;
    private _authtoken;
    private _authtime;
    private _lastCredentials;
    private _errorCount;
    private static MAX_ERROR_TOLERANCE;
    private _topicevents;
    constructor(config: IClientConfig);
    /**
     * Subscribes to a specific DataEvent topic
     *
     * @param topicname topic name to subscribe to
     * @param fn subscriber handler function
     */
    subscribeTopic(topicname: string, fn: IEventHandler<IServiceClient, any>): void;
    /**
     * Unsubscribes from a specific DataEvent topic. The handler is executed at most once
     *
     * @param topicname topic name to unsubscribe from
     * @param fn subscriber handler function
     */
    unsubscribeTopic(topicname: string, fn: IEventHandler<IServiceClient, any>): void;
    /**
     * Checks to see if a given DataEvent topic has a handler registered against it or not
     *
     * @param topicname
     * @param fn
     */
    hasTopicHandler(topicname: string, fn: IEventHandler<IServiceClient, any>): boolean;
    /**
     * Fetched the content of a simple text file from server
     *
     * @returns
     */
    read_file(path: string): Promise<string>;
    /**
     * Saves the content of a simple text file on server
     *
     * @returns
     */
    write_file(path: string, content: string): Promise<void>;
    /**
     * Gets list of accessible logs
     *
     * @returns Promise that resolved to List of logs
     */
    get_logs(): Promise<Array<LogInfo>>;
    /**
     * Subscribes to stats channel (topic path) to get realtime data
     *
     * @returns Promise that resolved to subscribable topic path for the data channel for stats
     */
    subscribe_stats(): Promise<any>;
    /**
     * Subscribes to log channel (topic path) to get realtime data
     *
     * @param logkey
     * @returns Promise that resolved to subscribable topic path for the data channel of thsi log
     */
    subscribe_log(logkey: string): Promise<any>;
    /**
     *
     * Unsubscribes from a log channel
     *
     * @param logkey
     * @returns
     */
    unsubscribe_log(logkey: string): Promise<void>;
    /**
     * Requests to download a log file from server
     *
     * @param logkey
     * @returns
     */
    download_log(logkey: string): Promise<string>;
    /**
     * Gets list of system services that can be started/stopped through the service
     *
     * @returns
     */
    get_system_services(): Promise<string[]>;
    /**
     * Starts a system service using its name
     *
     * @param name
     * @returns
     */
    start_service(name: string): Promise<void>;
    /**
     * Stops a system service using its name
     *
     * @param name
     * @returns
     */
    stop_service(name: string): Promise<void>;
    /**
     * Restarts a system service using its name
     *
     * @param name
     * @returns
     */
    restart_service(name: string): Promise<void>;
    /**
     * Connects to backend service using a set of valid credentials
     *
     * @param username
     * @param password
     * @returns
     */
    connect(username: string, password: string): Promise<any>;
    /**
     * Attempts to reconenct back to service using last successful credentials
     */
    private attemptReconnect;
    /**
     * Process push data from server and dispatch events for client
     *
     * @param data
     */
    private processChannelData;
    /**
     * Dispatches topic specific error event with topic specific data
     * @param event
     */
    private _dispatchTopicOrientedErrorEvent;
    /**
     * Dispatches topic specific event with topic specific data
     * @param event
     */
    private _dispatchTopicOrientedDataEvent;
    private getBaseAPIendPoint;
    /**
     * Authenticates a user based on username and password
     *
     * @param username
     * @param password
     * @returns
     */
    private authenticate;
    dispose(): void;
}
