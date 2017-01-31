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

const TIME_TO_SEND = 1000;
const RETRY_TIME = 5000;

const NMEAS = [
  '$GPGGA',
  '$GPRMC',
];

const sendNum = 0;
const helper = new Helper();

class TCPQueue {

  constructor(tcpEndPoint) {
    this.tcpClient = null;
    this.loadQueue = this.loadQueue.bind(this);
    this.startSending = this.startSending.bind(this);
    this.loadQueue = this.loadQueue.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.saveQueue = this.saveQueue.bind(this);
    this.send = this.send.bind(this);
    this.setup = this.setup.bind(this);
    this.onDataRecieved = this.onDataRecieved.bind(this);
    this.startContinousMessages = this.startContinousMessages.bind(this);
    this.updateDataToSend = this.updateDataToSend.bind(this);
    this.setClientEndpoint = this.setClientEndpoint.bind(this);
    this.clientEndPoint = tcpEndPoint;
    this.tcpClient = new TCPClient(this.onDataRecieved, this.updateStatus, this.clientEndPoint);
    this.queue = [];
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
    clearTimeout(this.startTimeout);
    this.startTimeout= setTimeout(this.setup, 3000);
  }

  setup() {
    clearTimeout(this.startTimeout);
    if(this.dispatch){
      this.loadQueue().then((tcpQueue) => {
        this.ready = true;
        this.queue = [...tcpQueue];
        this.updateDataToSend();
        this.startContinousMessages();
        this.startSending();
      });
    } else {
      this.startTimeout = setTimeout(this.setup, 3000);
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
    let numberOfSent = 0;
    this.continousInterval = setInterval(() => {
      numberOfSent += 1;
      const message = { index: numberOfSent, timestamp: new moment().toISOString()};
      this.addToQueue(`$CONTINOUS:${numberOfSent}`, message);
    },  60000);
  }

  startSending() {
    const retry = (result) => {
      clearTimeout(this.sendTimeout);
      this.sendTimeout = setTimeout(this.startSending, TIME_TO_SEND);
    }

    if(this.queue.length){
      const toSend = this.queue[0];
      this.send(toSend).then(retry).catch(retry);
    } else {
      console.log('too small');
      retry();
    }

  }

  updateDataToSend(){
    const remainingData = JSON.stringify(this.queue).length;
    if(this.dispatch){
      this.dispatch.dispatch(connectionActions.updateDataToSend(remainingData - 2));
    }
  }

  send(toSend) {
    if(!toSend){
      throw new Error(`trying to send ${toSend}`);
    }
    return new Promise((resolve, reject) => {
      this.tcpClient.send(toSend).then((result) => {
        if(result){
          this.queue.shift();
          this.saveQueue().then(() => resolve(result)).catch(() => resolve(result));
        } else {
          resolve(result);
        }
      });
    });
  }

  addToQueue(key, input) {
    const messages = packMessage(key, helper.serialize(input));
    messages.forEach(msg => this.queue.push(msg));
    this.saveQueue();
    setTimeout(this.updateDataToSend, 100);
  }

  async loadQueue() {
    const queue = await AsyncStorage.getItem('TCPQueue');
    return helper.deserialize(queue || "[]");
  }

  async saveQueue() {
    console.log("SAVING");
    setTimeout(this.updateDataToSend, 100);
    return await AsyncStorage.setItem('TCPQueue', helper.serialize(this.queue));
  }

}
export default TCPQueue;
