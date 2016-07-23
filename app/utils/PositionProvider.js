import {getPosition, watchPositon, clearWatch, pollHttpPosition} from '../providers/Position';

class PositionProvider {
  constructor(){
    this.position = null;
    /*this.startPosition();
    this.startIPPosition.bind(this)();*/
  }

  setUrl(url){
    this.url = url;
  }

  getPosition(){
    return this.position;
  }

  positionUpdated(position){
    this.position = position;
  }

  initialPositionAquired(position){
    this.positionUpdated(position);
    this.watchId = watchPositon(this.positionUpdated.bind(this),
      (err) => {});
  }

  startPosition(){
    if(this.watchId !== null){
      clearWatch(this.watchId);
      this.watchId = null;
    }
    getPosition(this.initialPositionAquired.bind(this),
      (err) => {
        setTimeout(this.startPosition.bind(this), 5000)
      });
  }

  stopNativePosition(){
    clearWatch(this.watchId);
    this.watchId = null;
  }

  IPPostionSuccess(pos){
    this.position = pos;
  }

  IPPostionErr(err){
    clearInterval(this.interval);
    setTimeout(this.startIPPosition.bind(this), 5000);
  }

  startIPPosition(){
    if(this.url){
      this.interval = pollHttpPosition(this.url, this.IPPostionSuccess.bind(this), this.IPPostionErr.bind(this));
    }
  }

  stopIPPosition(){
    clearInterval(this.interval);
  }
}

export default PositionProvider;
