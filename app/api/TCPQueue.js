/* eslint-disable */
import AsyncStorage from 'AsyncStorage';
/* eslint-enable */
import Helper from '../utils/Helper';
import TCPClient from './TCPClient';

const helper = new Helper();


class TCPQueue {

  constructor() {
    this.tcpClient = {};
    this.loadQueue = this.loadQueue.bind(this);
    this.startSending = this.startSending.bind(this);
    this.loadQueue = this.loadQueue.bind(this);
    this.shiftQueue = this.shiftQueue.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.saveQueue = this.saveQueue.bind(this);
    this.send = this.send.bind(this);
    this.setup = this.setup.bind(this);
    this.queue = [];
    this.sending = false;
    this.setup();
  }

  setup() {
    this.loadQueue().then((tcpQueue) => {
      const saved = tcpQueue || [];
      this.queue = [...saved, ...this.queue];
      this.tcpClient = new TCPClient();
      this.startSending();
    });
  }

  startSending() {
    if(!this.tcpClient) {
      return setTimeout(this.startSending, 2000);
    }
    if(this.tcpClient.isActive !== true){
      return setTimeout(this.startSending, 2000);
    }
    if(!this.queue.length) {
      return setTimeout(this.startSending, 2000);
    }
    if(this.sending) {
      return setTimeout(this.startSending, 2000);
    }
    this.sending = true;
    const toSend = this.queue[0];
    this.send(toSend).then(
      () => {
        console.log("did send");
        this.sending = false;
        setTimeout(this.startSending, 2000);
      }).catch(
        (e) => {
            console.log("didint", e);
            this.sending = false;
            setTimeout(this.startSending, 2000);
        });
  }

  send(toSend) {
    this.sending = true;
    return new Promise((resolve, reject) => {
      this.tcpClient.send(toSend.key, toSend.input).then((results) => {
        console.log(results);
        if(results.every(d => !!d)){
          this.shiftQueue().then(resolve);
        } else {
          reject();
        }
      });
    });
  }

  addToQueue(key, input) {
    const toAdd = { key, input };
    this.queue.push(toAdd);
    return this.saveQueue().then(this.startSending);
  }

  shiftQueue() {
    this.queue.shift();
    return this.saveQueue();
  }

  async loadQueue() {
    const queue = await AsyncStorage.getItem('TCPQueue');
    return helper.deserialize(queue);
  }

  async saveQueue() {
    const queue = helper.serialize(this.queue);
    return await AsyncStorage.setItem('TCPQueue', queue);
  }

}
export default TCPQueue;
