# Development Workflow


# How to Use `cdsclient-lib`

`cdsclient-lib` is a **core dependency** of the Cloudisense client. This library enables critical operations for the Cloudisense React client, including:

- **Authentication**
- **Remote Procedure Calls (RPC)**
- **File upload and download**
- **Other essential operations**

It supports both WebSocket and HTTP(s) protocols, ensuring seamless and efficient communication with the Cloudisense backend.


---

### Committing to NPM

To properly use `cdsclient-lib` in Cloudisense client, it must be published to the `npm` repository. Follow the steps mentioned below to publish a new version of the library to `npm`:

#### 1. Bump the Version
Update the version number mentioned in `package.json` under `"version":<version-number>`. You cannot upload an older version or same version again.


#### 2. Run the `npm login` Command

In the root directory of your repository, run the following command:

```bash
npm login
```
It will prompt you for your username, password, and email associated with your npm account.

After running the `npm login` command, you will be prompted to enter the following:

- **Username**: Enter your npm username.
- **Password**: Enter your npm password.
- **Email**: Enter the email address associated with your npm account.

Once you've successfully entered your credentials, npm will store your login information. You should see a confirmation message like this:

```bash
Logged in as <username> on https://registry.npmjs.org/.
```

#### 3. Compile & Build

Run the TypeScript compiler to generate the JavaScript output that will be published to npm.

```sh
npm run build
```

By default, this will create JavaScript files in the dist/ folder, but you can configure it to use a different output directory by modifying the tsconfig.json file (e.g., "outDir": "./dist").


#### 3. Publish to npm

```sh
npm publish

```

If you want to publish a specific version or a pre-release version (e.g., alpha, beta), you can use the `--tag` flag:

```bash
npm publish --tag beta
```

You can verify that your package was successfully published by visiting the npm package page:

`https://www.npmjs.com/package/cdsclient-lib`

---

### Adding `cdsclient-lib` to Cloudisense Client

Once `cdsclient-lib` is successfully published on npm, you can add it as a dependency in the `package.json` file of your Cloudisense Client project.

To install the latest version:

```bash
npm install cdsclient-lib
```

If you need to install a specific version, you can specify the version number as follows:


```sh
npm install cdsclient-lib@<version>

```

Replace `<version>` with the version number you committed.
---

### Installing Locally

Install and test your library locally to ensure it works as expected. Execute the following command to create a tarball file.

```sh
npm pack
```

This will create a tarball file (.tgz) that you can install and test in a separate project:

```sh
npm install /path-to/cdsclient-lib.tgz
```

Make sure you are in the root directory of your repository, where your `package.json` file is located. Open terminal and type the following commands to build the payload and upload it to npm:
