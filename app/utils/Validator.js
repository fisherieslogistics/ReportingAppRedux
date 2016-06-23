import speciesCodes from '../constants/speciesCodes.json';
import Strings from '../constants/Strings';

const strings = Strings.english.errors;

export default {
  valid: {
    greaterThanZero: {
      func: (value) => {
          return (isNaN(value) === false) && value > 0;
      },
      errorMessage: strings.generic.moreThanZero
    },
    targetProduct: {
      func: (value) => {
          return speciesCodes.indexOf(value) === -1 ? false : true;
      },
      errorMessage: strings.generic.invalidSpeciesCode
    },
    productCode: {
      func: (value) => {
        if(value.length === 0){
          return true;
        }
        return speciesCodes.indexOf(value) !== -1 ? true : false;
      },
      errorMessage: strings.generic.invalidSpeciesCode
    },
    anyValue: {
        func: (value) => {
            return value != '' && value != undefined && value != null;
        },
        errorMessage: strings.generic.mustBeAValue,
    },
    alwaysValid: {
        func: () => {
            return true;
        }
    }
  },
  combined:{
    orderedLessThan: {
      func: (orderedAttributes, obj) => {
        var valid = orderedValid(orderedAttributes, obj, (current, next) => (current < next));
      },
      errorMessage: (labels) => combinedError(labels, " must be less than ")
    },
    orderedLessThanOrEqual: {
      func: (orderedAttributes, obj) => {
        var valid = orderedValid(orderedAttributes, obj, (current, next) => (current <= next));
      },
      errorMessage: (labels) => combinedError(labels, " must be less than or equal to ")
    },
    orderedGreaterThan: {
      func: (orderedAttributes, obj) => {
        var valid = orderedValid(orderedAttributes, obj, (current, next) => (current > next));
      },
      errorMessage: (labels) => combinedError(labels, " must be greater than ")
    },
    orderedGreaterThanOrEqual: {
      func: (orderedAttributes, obj) => {
        var valid = orderedValid(orderedAttributes, obj, (current, next) => (current >= next));
      },
      errorMessage: (labels) => combinedError(labels, " must be greater than or equal to ")
    }
  }
};

const combinedError = (labels, messageBody) => {
  message = labels[0];
  for(var i = 1; i < labels.length; i++){
    message += (messageBody + labels[i]);
  }
  return message;
}

const orderedValid = (orderedAttributes, obj, func) => {
  var valid = true;
  for(var i = 0; i < orderedAttributes.length -1; i++){
    var current = obj[orderedAttributes[i]];
    var next = obj[orderedAttributes[i+1]];
    if(! func(current, next)){
      valid = false;
    }
  }
  return valid;
}
