"use strict";
import moment from 'moment';

class ProductActions{
    changeSpecies(id, catchId, value) {
        return {
            type: 'changeSpecies',
            fishingEventId: id,
            catchIndex: catchId,
            value: value,
            timestamp: moment()
        };
    }
    changeWeight(id, catchId, value) {
        return {
            type: 'changeWeight',
            fishingEventId: id,
            catchIndex: catchId,
            value: value,
            timestamp: moment()
        };
    }
    changeCustom(name, id, catchId, value) {
        return {
            type: 'changeCustom',
            name: name,
            fishingEventId: id,
            catchIndex: catchId,
            value: value,
            timestamp: moment()
        };
    }
    addProduct(id){
      return {
        type: 'addProduct',
        fishingEventId: id
      }
    }
    deleteProduct(productIndex, fishingEventId){
      return {
        type: 'deleteProduct',
        fishingEventId: fishingEventId,
        productIndex: productIndex
      }
    }
    undoDeleteProduct(fishingEventId){
      return {
        type: 'undoDeleteProduct',
        fishingEventId: fishingEventId
      }
    }

}

export default ProductActions;
