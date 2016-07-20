"use strict";
import moment from 'moment';

class ProductActions{
  changeSpecies(id, catchId, value, objectId) {
      return (dispatch, getState) => {
        dispatch({
          type: 'changeSpecies',
          fishingEventId: id,
          objectId: objectId,
          catchIndex: catchId,
          value: value,
          timestamp: moment(),
          formType: getState().default.me.formType,
      });
    }
  }
  changeWeight(id, catchId, value, objectId) {
    return (dispatch, getState) => {
      dispatch({
        type: 'changeWeight',
        fishingEventId: id,
        objectId: objectId,
        catchIndex: catchId,
        value: value,
        timestamp: moment(),
        formType: getState().default.me.formType,
      });
    }
  }
  changeCustom(name, id, catchId, value, objectId) {
    return (dispatch, getState) => {
      dispatch({
        type: 'changeCustom',
        name: name,
        fishingEventId: id,
        objectId: objectId,
        catchIndex: catchId,
        value: value,
        timestamp: moment(),
        formType: getState().default.me.formType,
      });
    }
  }
  addProduct(id, objectId){
    return (dispatch, getState) => {
      dispatch({
        type: 'addProduct',
        fishingEventId: id,
        objectId: objectId,
        formType: getState().default.me.formType,
      });
    }
  }
  deleteProduct(productIndex, fishingEventId, objectId){
    return (dispatch, getState) => {
      dispatch({
        type: 'deleteProduct',
        fishingEventId: fishingEventId,
        productIndex: productIndex,
        objectId: objectId,
        formType: getState().default.me.formType,
      });
    }
  }
  undoDeleteProduct(fishingEventId, objectId){
    return (dispatch, getState) => {
      dispatch({
        type: 'undoDeleteProduct',
        fishingEventId: fishingEventId,
        objectId: objectId,
        formType: getState().default.me.formType,
      });
    }
  }
}

export default ProductActions;
