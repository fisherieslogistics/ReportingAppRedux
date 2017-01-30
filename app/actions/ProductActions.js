"use strict";
import moment from 'moment';

class ProductActions{
  changeSpecies(id, catchId, value, objectId) {
    const val = value && value.toUpperCase ? value.toUpperCase() : value;
    return (dispatch) => {
      dispatch({
        type: 'changeSpecies',
        fishingEventId: id,
        objectId,
        catchIndex: catchId,
        value: val,
        timestamp: moment(),
      });
    }
  }
  changeWeight(id, catchId, value, objectId) {
    return (dispatch, getState) => {
      dispatch({
        type: 'changeWeight',
        fishingEventId: id,
        objectId,
        catchIndex: catchId,
        value,
        timestamp: moment(),
      });
    }
  }
  changeCustom(name, id, catchId, value, objectId) {
    return (dispatch, getState) => {
      dispatch({
        type: 'changeCustom',
        name,
        fishingEventId: id,
        objectId,
        catchIndex: catchId,
        value,
        timestamp: moment(),
      });
    }
  }
  addProduct(id, objectId){
    return (dispatch, getState) => {
      dispatch({
        type: 'addProduct',
        fishingEventId: id,
        objectId,
      });
    }
  }
  deleteProduct(productIndex, fishingEventId, objectId){
    return (dispatch, getState) => {
      dispatch({
        type: 'deleteProduct',
        fishingEventId,
        productIndex,
        objectId,
      });
    }
  }
  undoDeleteProduct(fishingEventId, objectId){
    return (dispatch, getState) => {
      dispatch({
        type: 'undoDeleteProduct',
        fishingEventId,
        objectId,
      });
    }
  }
}

export default ProductActions;
