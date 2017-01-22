/* eslint-disable */
import AsyncStorage from 'AsyncStorage';
/* eslint-enable */
import Helper from '../utils/Helper';
import TCPClient from './TCPClient';
import moment from 'moment';

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
    this.sendInTime = this.sendInTime.bind(this);
    this.send = this.send.bind(this);
    this.setup = this.setup.bind(this);
    this.onDataRecieved = this.onDataRecieved.bind(this);
    this.startContinousMessages = this.startContinousMessages.bind(this);
    this.queue = [];
    this.sending = false;
    this.dispatch = null;
    this.setup();
  }

  setup() {
    this.loadQueue().then((tcpQueue) => {
      const saved = tcpQueue || [];
      this.queue = [...saved, ...this.queue];
      this.tcpClient = new TCPClient(this.onDataRecieved);
      this.tcpClient = new TCPClient(this.dispatch, this.onDataRecieved);
      this.startSending();
      this.startContinousMessages()
    });
  }

  onDataRecieved(data){
  setDispatch(dispatch){
    this.dispatch = dispatch;
  }

  }

  startContinousMessages() {
    let numberOfSent = 1;
    const message = { index: numberOfSent, timestamp: new moment().toISOString()};
    setInterval(() => {
      numberOfSent += 1;
      this.addToQueue(`$CONTINOUS:${numberOfSent}`, message);
    }, 15000);
  }

  sendInTime() {
    this.sending = false;
    setTimeout(this.startSending, 3000);
  }

  startSending() {
    if(this.tcpClient && this.tcpClient.isActive && this.queue.length && !this.sending){
      this.sending = true;
      const toSend = this.queue[0];
      this.send(toSend).then(this.sendInTime).catch(this.sendInTime);
    } else {
      this.sendInTime();
    }
  }

  send(toSend) {
    this.sending = true;
    return new Promise((resolve, reject) => {
      this.tcpClient.send(toSend.key, toSend.input).then((results) => {
        if(results.every(d => !!d)){
          this.shiftQueue().then(resolve);
        } else {
          reject();
        }
      });
    });
  }

  addToQueue(key, input) {
    this.queue.push({ input, key });
    return this.saveQueue();
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
