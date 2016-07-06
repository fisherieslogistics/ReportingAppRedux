"use strict";
import moment from 'moment';

class ProductActions{
    changeSpecies(id, catchId, value, objectId) {
        return {
            type: 'changeSpecies',
            fishingEventId: id,
            objectId: objectId,
            catchIndex: catchId,
            value: value,
            timestamp: moment()
        };
    }
    changeWeight(id, catchId, value, objectId) {
        return {
            type: 'changeWeight',
            fishingEventId: id,
            objectId: objectId,
            catchIndex: catchId,
            value: value,
            timestamp: moment()
        };
    }
    changeCustom(name, id, catchId, value, objectId) {
        return {
            type: 'changeCustom',
            name: name,
            fishingEventId: id,
            objectId: objectId,
            catchIndex: catchId,
            value: value,
            timestamp: moment()
        };
    }
    addProduct(id, objectId){
      return {
        type: 'addProduct',
        fishingEventId: id
      }
    }
    deleteProduct(productIndex, fishingEventId, objectId){
      return {
        type: 'deleteProduct',
        fishingEventId: fishingEventId,
        productIndex: productIndex,
        objectId: objectId,
      }
    }
    undoDeleteProduct(fishingEventId, objectId){
      return {
        type: 'undoDeleteProduct',
        fishingEventId: fishingEventId,
        objectId: objectId,
      }
    }

}

export default ProductActions;
