import net from 'react-native-tcp';
import { AlertIOS } from 'react-native';

const SOCKET_TIMEOUT = 5000;
const RETRY_TIME = 10000;

class TCPClient {
  constructor(dataCalllback, updateStatusCallback, tcpEndPoint) {
    this.tcpEndPoint = tcpEndPoint;
    console.log(tcpEndPoint);
    this.updateStatusCallback = updateStatusCallback;
    this.dataCalllback = dataCalllback;

    this.connect = this.connect.bind(this);
    this.send = this.send.bind(this);
    this.setupSocket = this.setupSocket.bind(this);
    this.canSend = this.canSend.bind(this);

    this.ready = false;
    this.setupSocket();
  }

  setupSocket() {
    this.client = new net.Socket();
    /*this.client.setTimeout(SOCKET_TIMEOUT, () => {
       console.log("timeout");
       this.client.end();
     });*/
    this.client.on('error', (error) => {
      console.log(error);
    });
    this.client.on('data', (data) => {
      this.dataCalllback(data);
    });
    this.client.on('close', () => {
      console.log('close');
      this.connected = false;
      setTimeout(this.connect, 10000);
    });
    this.client.on('drain', () => {
      console.log('drained');
    });
    this.client.on('end', (end) => {
      console.log('END ON END', end);
    });
    this.connect();
  }

  connect() {
    const self = this;
    this.client.connect(parseInt(this.tcpEndPoint.port), this.tcpEndPoint.ip.replace(/ /g,''), () => {
      self.connected = true;
      console.log("connected");
      const message = { open: true };
      self.send(`1,1,OPEN,OPEN${this.tcpEndPoint.port}${this.tcpEndPoint.ip}`);
    });
  }

  canSend() {
    if(this.client._state &&
      this.client.writable &&
      !this.client._writableState.needDrain &&
      this.connected){
        return true;
    }
    console.log(`
        _state:${this.client._state}
        writable: ${this.client.writable}
        needDrain: ${this.client._writableState.needDrain}
        connected: ${this.connected}
      `);
    return false;
  }

  send(msg) {
    if(this.canSend()){
      return new Promise((resolve) => {
        try {
          this.client.write(`${msg}-\r\n`, 'UTF8', () => {
            resolve(true);
          });
        } catch(e) {
          console.log(e);
          resolve(false);
        }

      });
    }
    console.log('no send');
    return Promise.resolve();
  }

}

export default TCPClient;
