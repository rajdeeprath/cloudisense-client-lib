class CloudisenseClientError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, CloudisenseClientError.prototype);
    }
}