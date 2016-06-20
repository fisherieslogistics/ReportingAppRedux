import speciesCodes from '../constants/speciesCodes.json';
import Strings from '../constants/Strings';

const strings = Strings.english;

export default {
    valid: {
        greaterThanZero: {
            func: (value) => {
                return value > 0;
            },
            errorMessage: strings.errors.moreThanZero
        },
        product: {
            func: (value) => {
                return speciesCodes.indexOf(value) != 1;
            },
            errorMessage: strings.errors.invalidSpeciesCode
        },
        anyValue: {
            func: (value) => {
                return value != '';
            },
            errorMessage: strings.errors.mustBeAValue,
        },
        alwaysValid: {
            func: () => {
                return true;
            }
        }
    }
};
