# cloudisense API Library

## ABOUT
---

This library provides convenient access to the cloudisense backend service. It encapsulates communication mechanism for cloudisense's REST API as well as Real-time communication API.

This library is for use with the cloudisense frontend React project.


## Usage
---

The following code snippet from the react-redux project demonstrates how connection is established to service from client.

### Main Authentication Function

```javascript
    var password_hash = sha256.create();
    password_hash.update(password);
    password_hash.hex();

    var bodyFormData = new FormData();
    bodyFormData.append('username', username);
    bodyFormData.append('password', password_hash.hex());

    axios({
        method: "post",
        url: "http://localhost:8000/authorize",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {

        if (response.data) {
            if (response.data.status == "success" && response.data.code == 200) {
                if (rememberUser) {
                    localStorage.setItem(LAST_USER_KEY, username)
                } else {
                    localStorage.removeItem(LAST_USER_KEY)
                }

                const authData = response.data.data;
                localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(authData))
                initializeSocketClient(dispatch, authData).then((client) => {
                    client.connectWithAuthData(authData).then(() => {
                        connection_ready_timeout = setTimeout(() => {
                            on_connection_state_complete(client, dispatch)
                        }, 2000);

                    }).catch((err) => {
                        console.log(err)
                        dispatch(authFail(err))
                    })
                })
                    .catch((error) => {
                        console.log("error initializing socket client")
                        dispatch(authFail("error initializing socket client"))
                    });
            }
            else {
                dispatch(authFail(response.data.data));
            }
        }
        else {
            dispatch(authFail("Unknown Error"));
        }
    })
    .catch((error) => {
        dispatch(authFail(error.message));
    });
```

### The `initializeSocketClient` Function



```javascript
const initializeSocketClient = (dispatch, data) => {

    return new Promise(function (resolve, reject) {

        const client = new cloudisenseApiClient({
            host: "localhost",
            port: 8000,
            reconnectOnFailure: false,
            authdata: plainToInstance(AuthData, data)
        });


        client.onTextNotification.subscribe((evt) => {
            switch (evt.type) {
                case EventType.DATANOTIFICATION:
                case EventType.NOTIFICATION:
                    dispatch(notificationReceived(evt))
                    break;
            }
        });


        client.onUIEvent.subscribe((evt) => {
            switch (evt.topic) {
                case TOPIC_UI_INITIALIZATION:
                    subscribe_to_ui_updates(client, dispatch)
                        .then((result) => {
                            dispatch(uiUpdatesSubscribeSuccess(result))
                            on_connection_state_complete(client, dispatch, evt.data);
                        })
                        .catch((err) => {
                            dispatch(uiUpdatesSubscribeFailed(err))
                        });
                    break;
            }
        });



        client.onClientStateUpdate.subscribe((stateObj) => {
            switch (stateObj.state) {
                case ClientStateType.CONNECTING:
                    console.debug("Connecting")
                    break;

                case ClientStateType.CONNECTED:
                    console.debug("Connected")
                    dispatch(connectSuccess())
                    break;

                case ClientStateType.CONNECTION_LOST:
                    dispatch(connectLoss("Connection lost"))
                    break;

                case ClientStateType.CONNECTION_TERMINATED:
                    console.debug("Disconnected")
                    dispatch(authLogout())
                    break;

                case ClientStateType.EVENT_RECEIVED:
                    console.debug("Event received")
                    break;

                case ClientStateType.CONNECTION_ERROR:
                    console.error("Connection error")
                    break;
            }

        });

        resolve(client);
    });
}
```


# Build
---

1. Simple compile - Generate output files

```shell
    tsc
```



2. Compile (Platform specific)

**Linux**


```shell
    rm -rf ./dist && tsc && tsc --build tsconfig.es5.json
```


**Windows**

```shell
    rmdir /q /S .\\dist && tsc && tsc --build tsconfig.es5.json
```


3. Distribute compiled files for linux to react client project

**Linux**


```shell
    rm -rf ../cloudisense-client-react/src/dist  && cp -R ./dist ../cloudisense-client-react/src/dist
```

**Windows**


```shell
    xcopy .\\dist\\ ..\\cloudisense-client-react\\src\\dist\\ /E /Y
```
    