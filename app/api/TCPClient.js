import net from 'react-native-tcp';
import TCPEndpoint from './TCPEndpoint';

const SOCKET_TIMEOUT = 4000;
const RETRY_TIME = SOCKET_TIMEOUT + 1000;

class TCPClient {
  constructor(dispatch, dataCalllback, updateStatusCallback, tcpEndPoint) {
    this.dispatch = dispatch;
    this.tcpEndPoint = tcpEndPoint;
    this.updateStatusCallback = updateStatusCallback;
    this.dataCalllback = dataCalllback;
    this.connect = this.connect.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleDrain = this.handleDrain.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.send = this.send.bind(this);
    this.setup = this.setup.bind(this);
    this.setTcpEndpoint = this.setTcpEndpoint.bind(this);
    this.isActive = false;
    this.setup();
  }

  setup() {
    if(this.client) {
      this.client.removeAllListeners();
    }
    this.client = new net.Socket();
    this.client.setTimeout(SOCKET_TIMEOUT);
    this.client.on('error', this.handleError);
    this.client.on('data', this.handleData);
    this.client.on('close', this.handleClose);
    this.client.on('drain', this.handleDrain);
    this.connect();
  }

  setTcpEndpoint(tcpEndPoint) {
    if(this.client){
      this.client.destroy();
    }
    this.tcpEndPoint = tcpEndPoint;
  }

  updateStatus(status){
    this.statusCallback(status);
  }

  handleData(data) {
    this.dataCalllback(data);
  }

  handleError() {
    this.updateStatusCallback('Error');
    this.isActive = false;
    //this.client.close();
  }

  handleDrain() {
    this.active = true;
  }

  handleClose() {
    this.isActive = false;
    this.updateStatusCallback('Closed');
    setTimeout(this.setup, RETRY_TIME);
  }

  handleConnect() {
    this.isActive = true;
    this.updateStatusCallback('Connected');
    //-=const sent = this.send('CON', { connected: new moment().toISOString() });
  }

  connect() {
    this.updateStatusCallback('Starting');
    try {
      this.client.connect(this.tcpEndPoint.port, this.tcpEndPoint.ip, this.handleConnect);
    } catch(e) {
      setTimeout(this.setup, RETRY_TIME);
    }
  }

  send(msg) {
    return new Promise((resolve) => {
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
        resolve(false);
      }
      try {
        resolve(this.client.write(`${msg}\r\n`));
      } catch(e) {
        this.isActive = false;
        setTimeout(this.setup, RETRY_TIME);
        resolve(false);
      }
    });
  }

}

export default TCPClient;
