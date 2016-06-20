import Validator from '../utils/Validator';

const model = [
  {label: 'Bottom Depth',        id: 'bottomDepth',        valid: Validator.valid.greaterThanZero, type: 'number'},
  {label: 'Groundrope Depth',    id: 'groundropeDepth',    valid: Validator.valid.greaterThanZero, type: 'number'},
  {label: 'Average Speed',       id: 'averageSpeed',       valid: Validator.valid.greaterThanZero, type: 'float'},
  {label: 'Wing Spread',         id: 'wingSpread',         valid: Validator.valid.greaterThanZero, type: 'number'},
  {label: 'Headline Height',     id: 'headlineHeight',     valid: Validator.valid.greaterThanZero, type: 'float'},
  {label: 'Non Fish Protected Species',  id: 'nonFishProtected',  valid: Validator.valid.alwaysValid, defaultValue: false, type: 'bool' }
];

export default model;
