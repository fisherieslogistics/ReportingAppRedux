import {getPosition, watchPositon, clearWatch} from '../providers/Position';

class PositionProvider {
  constructor(){
    this.position = null;
    this.startPosition();
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
}

export default PositionProvider;
