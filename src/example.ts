/*
* Copyright (C) 2019-2025 Rajdeep Rath (Cloudisense-core - cdscore)
 * This library (.py files) is intended for use solely within the Cloudisense program and its supporting codebases.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.   
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
