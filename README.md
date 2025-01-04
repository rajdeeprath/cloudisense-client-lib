# Cloudisense API Library

## About
This library provides a convenient way to access the Cloudisense backend services. It encapsulates communication mechanisms for Cloudisense's REST API and Real-time Communication API.

This library is intended for use with the Cloudisense frontend React project.

---

## Usage

The following code snippet from a React-Redux project demonstrates how to establish a connection to the service from a client.

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

```bash
    npm run build
```

This will build outputs for es6 & commonjs in the `dist/lib` directory.

2. Create package for installing locally

**Linux**


```bash
    npm run pack:output
```

This will create a `tgz` file in the build folder. This file can be used to install the dependency locally.

```bash
npm install /path-to/build/cdsclient-lib-0.0.2.tgz
```


**Windows**

TO DO


3. Distribute the library on `npm`

> When building alongside `Cloudisense` main project folder

* **Login:**: Type `npm login` at the console to initiate login. This will open a browser window, where you can authenticate on `npm`.

* **Publish:**: Type `npm publish` to publish this library on `npm`. Make sure the version is above the one existing on `npm`

    
4. NPM 

The library is hosted on NPM @ [https://www.npmjs.com/package/cdsclient-lib](https://www.npmjs.com/package/cdsclient-lib)
