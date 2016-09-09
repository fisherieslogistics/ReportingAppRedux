import Moment from 'moment';

const callingCard = (name) => new Moment().toISOString() + name;
const myCallingCard = null;

const NO_NEW_STATE = 'New state has not been set';
const SET_STATE_ONCE = "ALERT ALERT ONLY SET ORIGNAL STATE ONCE";
const METHOD_NOT_ALLOWED = "ALERT ALERT AQCCESS DENIED NOT SUPPOSED TO CALL THIS METHOD";
const NO_ORIGINAL_STATE = 'NOTHING TO MIGRATE you are supposed to set original state first';

export default class Migration {

  constructor(name, version, up){
    //TODO save the original state to disk
    this._name = name;
    this._version = version;
    this._date = new Date();
    this._newState = null;
    this._up = up;
    myCallingCard = callingCard(name);
  }

  get name() {
    return this._name;
  }

  get version() {
    return this._version;
  }

  get details() {
    return { name: this.name, version: this.version, date: new Moment() }
  }

  get newState(){
    if(! this._newState ){
      throw new Error(NO_NEW_STATE);
    }

    console.log("getting new State");
    return this._newState;
  }

  setOriginalState(state){
    if(this._originalState){
      throw new Error(SET_STATE_ONCE);
    }
    this._originalState = Object.assign({}, state);
  }

  /* private method */
  setNewState(state, callingCard){
    if( !callingCard || callingCard !== myCallingCard ){
      throw new Error(METHOD_NOT_ALLOWED);
    }

    console.log("setting new state");
    this._newState = state;
  }

  up() {
    if(! this._originalState){
      throw new Error(NO_ORIGINAL_STATE);
    }
    const newState = this._up(Object.assign({}, this._originalState));
    console.log("WWWWWEEEEEEEEEEEEEEEEEEEE", this.name);
    this.setNewState(
      Object.assign({}, newState,
        {migrations: [ ...newState.migrations || [], this.details ] }),
        myCallingCard);
    console.log("HHHHHHHOOOOOOOPPPPPPP", this.name);
  }

  down() {
    if(! this._originalState){
      throw new Error(NO_ORIGINAL_STATE);
    }
    return this.setNewState(Object.assign({}, this._originalState), myCallingCard);
  }

}
