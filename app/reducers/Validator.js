import speciesCodes from '../constants/speciesCodes.json';

export default {
    valid: {
        greaterThanZero: {
            func: (value) => {
                return value > 0;
            },
            errorMessage: 'must be greater than zero'
        },
        fish: {
            func: (value) => {
                return speciesCodes.indexOf(value) != 1;
            },
            errorMessage: 'must be a valid fish'
        },
        anyValue: {
            func: (value) => {
                return value != '';
            },
            errorMessage: 'must be a value'
        },
        alwaysValid: {
            func: () => {
                return true;
            }
        }
    }
};
