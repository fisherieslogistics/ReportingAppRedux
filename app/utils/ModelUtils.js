import moment from 'moment';

export default {
    blankModel: (model) => {
        const blankModel = {};
        model.forEach(value => {
            blankModel[value.id] = value.defaultValue;
        });
        return blankModel;
    }
};
