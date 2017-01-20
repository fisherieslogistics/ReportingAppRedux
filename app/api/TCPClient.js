import net from 'react-native-tcp';
import TCPEndpoint from './TCPEndpoint';
import packMessage from './PackMessage';
import moment from 'moment';
import S from 'string';

const logIt = (toLog) => { console.log(toLog) };

class TCPClient {
  constructor(dispatch, dataCalllback = logIt) {
    this.dispatch = dispatch;
    this.dataCalllback = dataCalllback;
    this.connect = this.connect.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleDrain = this.handleDrain.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.writeAll = this.writeAll.bind(this);
    this.send = this.send.bind(this);
    this.setup = this.setup.bind(this);
    this.isActive = false;
    this.setup();
  }

  setup(err) {
    console.log("setup");
    if(this.client) {
      this.client.removeAllListeners();
    }
    this.client = new net.Socket();
    this.client.on('error', this.handleError);
    this.client.on('data', this.handleData);
    this.client.on('close', this.handleClose);
    this.client.on('drain', this.handleDrain);
    this.connect();
  }

  handleData(data) {
    //console.log(data.toString());
    console.log(data);
    this.dataCalllback(data);
  }

  handleError(error) {
    this.isActive = false;
    console.log("handling an error", error);
    //this.client.close();
  }

  handleDrain(drain) {
    console.log("drain", drain);
  }

  handleClose(close) {
    this.isActive = false;
    console.log("close", close);
    setTimeout(this.setup, 4000);
  }

  handleConnect(connect) {
    this.isActive = true;
    console.log('connected as bro', connect);
    //const sent = this.send('CON', { connected: new moment().toISOString() });
  }

  connect() {
    try {
      this.client.connect(TCPEndpoint.port, TCPEndpoint.ip, this.handleConnect);
    } catch(e) {
      setTimeout(this.setup, 4000);
    }
  }

  send(key, input){
    const messages = packMessage(key, input);
    const results = Promise.all(this.writeAll(messages));
    return results;
  }

  writeAll(messages) {
    return messages.map((msg, index) => new Promise((resolve, reject) => {
        if(!this.isActive){
          resolve(false);
        }
        if(!this.client._state){
          resolve(false);
        }
        if(!this.client.writable){
           resolve(false);
        }
        if(this.client._writableState.needDrain) {
          console.log("needs drain");
        }

        setTimeout(() => {
          try {
            const res = this.client.write(`${msg}\r\n`);
            resolve(true);
          } catch(e) {
            this.isActive = false;
            setTimeout(this.setup, 3000);
            resolve(false);
          }
        }, 100 + (index * 100));
      }));
  }

}

export default TCPClient;
