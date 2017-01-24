/* eslint-disable */
import AsyncStorage from 'AsyncStorage';
/* eslconnectionActions*/
import Helper from '../utils/Helper';
import TCPClient from './TCPClient';
import moment from 'moment';
import LocationActions from '../actions/LocationActions';
import ConnectionActions from '../actions/ConnectionActions';

import nmea from 'nmea-0183';
const locationActions = new LocationActions();
const connectionActions = new ConnectionActions();
import packMessage from './PackMessage';

const NMEAS = [
  '$GPGGA',
  '$GPRMC',
];

const helper = new Helper();

class TCPQueue {

  constructor(tcpEndPoint) {
    this.tcpClient = {};
    this.loadQueue = this.loadQueue.bind(this);
    this.startSending = this.startSending.bind(this);
    this.loadQueue = this.loadQueue.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.saveQueue = this.saveQueue.bind(this);
    this.sendInTime = this.sendInTime.bind(this);
    this.send = this.send.bind(this);
    this.setup = this.setup.bind(this);
    this.onDataRecieved = this.onDataRecieved.bind(this);
    this.startContinousMessages = this.startContinousMessages.bind(this);
    this.updateDataToSend = this.updateDataToSend.bind(this);
    this.setClientEndpoint = this.setClientEndpoint.bind(this);
    this.clientEndPoint = tcpEndPoint;
    this.queue = [];
    this.sending = false;
    this.dispatch = null;
    this.setup();
  }

  updateStatus(status) {
    if(this.dispatch){
      this.dispatch.dispatch(connectionActions.updateConnectionStatus(status));
    }
  }

  setClientEndpoint(tcpEndPoint) {
    this.clientEndPoint = tcpEndPoint;
    this.tcpClient.setTcpEndpoint(tcpEndPoint);
  }

  setup() {
    if(this.dispatch){
      this.updateStatus('waiting');
      this.updateDataToSend();
      this.loadQueue().then((tcpQueue) => {
        const saved = tcpQueue || [];
        this.queue = [...saved, ...this.queue];
        this.updateDataToSend();
        this.tcpClient = new TCPClient(this.dispatch, this.onDataRecieved, this.updateStatus, this.clientEndPoint);
        this.startContinousMessages()
      });
    } else {
      setTimeout(this.setup, 3000);
    }
  }

  setDispatch(dispatch){
    this.dispatch = dispatch;
  }

  onDataRecieved(data){
    if(! this.dispatch ){
      return;
    }
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if( NMEAS.find(str =>  line.indexOf(str) > -1)){
        try {
          const pos = nmea.parse(line);
          if(isNaN(parseFloat(pos.latitude))){
            return;
          }
          pos.time = new moment().toISOString();
          this.dispatch.dispatch(locationActions.NMEAStringRecieved(line, pos));
        } catch(e) {
          console.log(e);
        }
      }
    });

  }

  startContinousMessages() {
    clearInterval(this.continousInterval);
    let numberOfSent = 1;
    this.continousInterval = setInterval(() => {
      numberOfSent += 1;
      const message = { index: numberOfSent, timestamp: new moment().toISOString()};
      this.addToQueue(`$CONTINOUS:${numberOfSent}`, message);
    },  60000);
  }

  sendInTime() {
    this.sending = false;
    setTimeout(this.startSending, 250);
  }

  startSending() {
    if(this.tcpClient && this.tcpClient.isActive && this.queue.length && !this.sending){
      this.sending = true;
      const toSend = this.queue[0];
      this.updateDataToSend();
      this.send(toSend).then(this.sendInTime).catch(this.sendInTime);
    } else {
      this.sendInTime();
    }
  }

  updateDataToSend(){
    const remainingData = JSON.stringify(this.queue).length;
    if(this.dispatch){
      this.dispatch.dispatch(connectionActions.updateDataToSend(remainingData - 2));
    }
  }

  send(toSend) {
    this.sending = true;
    return new Promise((resolve) => {
      this.tcpClient.send(toSend).then((result) => {
        if(result){
          this.queue.shift();
          this.updateDataToSend();
          this.saveQueue().then(resolve);
        } else {
          resolve();
        }
      });
    });
  }

  addToQueue(key, input) {
    const messages = packMessage(key, helper.deflate(input));
    messages.forEach(msg => this.queue.push(msg));
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
