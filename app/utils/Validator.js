import speciesCodes from '../constants/speciesCodes.json';
import Strings from '../constants/Strings';

const strings = Strings.english.errors;
const combinedError = (labels, messageBody) => {
  let message = labels[0];
  for(let i = 1; i < labels.length; i++){
    message += (messageBody + labels[i]);
  }
  return message;
}

const orderedValid = (orderedAttributes, obj, func) => {
  let valid = true;
  for(let i = 0; i < orderedAttributes.length -1; i++){
    const current = obj[orderedAttributes[i]];
    const next = obj[orderedAttributes[i+1]];
    if(! func(current, next)){
      valid = false;
    }
  }
  return valid;
}

export default {
  valid: {
    greaterThanZero: {
      func: (value) => (isNaN(value) === false) && value > 0,
      errorMessage: strings.generic.moreThanZero
    },
    targetProduct: {
      func: (value) => {
        if(value === 'OTH' || value === 'Other Species Weight'){
          return true;
        }
        if(!value){
          return false;
        }
        return speciesCodes.indexOf(value.toLowerCase()) !== -1;
      },
      errorMessage: strings.generic.invalidSpeciesCode
    },
    productCode: {
      func: (value = "") => {
        if(value === 'OTH'){
          return true;
        }
        if(value.length === 0){
          return true;
        }
        return speciesCodes.indexOf(value.toLowerCase()) !== -1;
        return speciesCodes.indexOf(value.toUpperCase()) !== -1;
      },
      errorMessage: strings.generic.invalidSpeciesCode
    },
    anyValue: {
        func: (value) => value !== '' && value !== undefined && value !== null,
        errorMessage: strings.generic.mustBeAValue,
    },
    alwaysValid: {
        func: () => true
    }
  },
  combined:{
    orderedLessThan: {
      func: (orderedAttributes, obj) => orderedValid(orderedAttributes, obj, (current, next) => (current < next)),
      errorMessage: (labels) => combinedError(labels, " must be less than ")
    },
    orderedLessThanOrEqual: {
      func: (orderedAttributes, obj) => orderedValid(orderedAttributes, obj, (current, next) => (current <= next)),
      errorMessage: (labels) => combinedError(labels, " must be less than or equal to ")
    },
    orderedGreaterThan: {
      func: (orderedAttributes, obj) => orderedValid(orderedAttributes, obj, (current, next) => (current > next)),
      errorMessage: (labels) => combinedError(labels, " must be greater than ")
    },
    orderedGreaterThanOrEqual: {
      func: (orderedAttributes, obj) => orderedValid(orderedAttributes, obj, (current, next) => (current >= next)),
      errorMessage: (labels) => combinedError(labels, " must be greater than or equal to ")
    }
  }
};
