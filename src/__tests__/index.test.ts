import '../index';
import { MessageChannelPolyfill, MessagePortPolyfill } from '../index';

it('polyfills MessagePort and MessageChannel', () => {
    expect(MessagePort).toBeDefined();
    expect(MessageChannel).toBeDefined();
});

it('can post message to another port', done => {
    const channel = new MessageChannelPolyfill();
    const port1 = channel.port1;
    const port2 = channel.port2;

    const message = 'hi';
    port2.onmessage = ({ data }) => {
        expect(data).toEqual(message);
        done();
    };

    port1.postMessage(message);
});
