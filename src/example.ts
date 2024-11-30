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

import {CloudisenseApiClient} from './client'
import { ClientState, ClientStateType } from './models'

const client = new CloudisenseApiClient({        
    host: "localhost",
    port: 8000,
    reconnectOnFailure: false    
});

client.onClientStateUpdate.subscribe((stateObj:ClientState) => {
    
    switch(stateObj.state)
    {
        case ClientStateType.CONNECTING:
            console.log("Connecting")   
            break;

        case ClientStateType.CONNECTED:
            console.log("Connected")   
            break;
        
        case ClientStateType.CONNECTION_LOST:
            console.log("Connection lost")   
            break;

        case ClientStateType.CONNECTION_TERMINATED:
            console.log("Connection terminated")   
            break;
        
        case ClientStateType.EVENT_RECEIVED:
            console.log("Event received")   
            break;
        
        case ClientStateType.CONNECTION_ERROR:
            console.log("Connection error")   
            break;
    }


});

client.connectWithCredentials("administrator", "xyz123").then(()=>{
     
    setTimeout(() => {
        client.subscribe_stats().then((data)=>{
            console.log("Call success: " + data)
        }).catch((err)=>{
            console.error(err);        
        });
    }, 5000);
    
}).catch((err)=>{
    console.error("Could not connect")
})
