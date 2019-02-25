// polyfill MessagePort and MessageChannel
export class MessagePortPolyfill implements MessagePort {
    onmessage = null;
    onmessageerror = null;

    otherPort: MessagePortPolyfill = null;
    private onmessageListeners: EventListener[] = [];

    constructor() {
    }

    dispatchEvent(event) {
        if (this.onmessage) {
            this.onmessage(event);
        }
        this.onmessageListeners.forEach(listener => listener(event));
        return true;
    }

    postMessage(message) {
        if (!this.otherPort) {
            return;
        }
        this.otherPort.dispatchEvent({ data: message });
    }

    addEventListener(type, listener) {
        if (type !== 'message') {
            return;
        }
        if (typeof listener !== 'function' ||
            this.onmessageListeners.indexOf(listener) !== -1) {
            return;
        }
        this.onmessageListeners.push(listener);
    }

    removeEventListener(type, listener) {
        if (type !== 'message') {
            return;
        }
        const index = this.onmessageListeners.indexOf(listener);
        if (index === -1) {
            return;
        }

        this.onmessageListeners.splice(index, 1);
    }

    start() {
        // do nothing at this moment
    }

    close() {
        // do nothing at this moment
    }
}

export class MessageChannelPolyfill implements MessageChannel {
    port1: MessagePortPolyfill
    port2: MessagePortPolyfill
    constructor() {
        this.port1 = new MessagePortPolyfill();
        this.port2 = new MessagePortPolyfill();
        this.port1.otherPort = this.port2;
        this.port2.otherPort = this.port1;
    }
}

/**
 * https://github.com/zloirock/core-js/blob/master/packages/core-js/internals/global.js
 */
const globalObj =
    typeof window !== 'undefined' && (<any>window).Math === Math ? window :
    typeof self !== 'undefined' && (<any>self).Math === Math ? self :
    Function('return this')();

export function applyPolyfill() {
    globalObj.MessagePort = MessagePortPolyfill;
    globalObj.MessageChannel = MessageChannelPolyfill;
}

if (!globalObj.MessagePort || !globalObj.MessageChannel) {
    applyPolyfill();
}
