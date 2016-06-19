import moment from 'moment';

export default {
    blankModel: (model, store) => {
        const blankModel = {};
        model.forEach(value => {
            blankModel[value.id] = value.defaultValue;
            if(value.defaultValue && value.defaultValue.length === 0) {
                blankModel[value.id] = [];
            }
            if (value.store) {
                blankModel[value.id] = value.store;
                value.store.parent = store;
                value.store.load([]);
            } else if(typeof blankModel[value.id] == 'undefined') {
                blankModel[value.id] = '';
            }
        });
        return blankModel;
    }
};
