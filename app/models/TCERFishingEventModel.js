import Validator from '../utils/Validator';
import Helper from '../utils/Helper';
const combined = Validator.combined;
const valid = Validator.valid;
const helper = new Helper();

const model = [
  {
    label: 'Groundrope Depth', id: 'groundropeDepth', valid: valid.greaterThanZero, type: 'number',
    combinedValid: { attributes: ["groundropeDepth", "bottomDepth"], func: combined.orderedGreaterThanOrEqual}, unit: 'm', optionalRender: true,
    display: { type: 'single'}, repeating: true,
  },
  {
    label: 'Average Speed', id: 'averageSpeed', valid: valid.greaterThanZero, type: 'float', defaultValue: 0,
    display: { type: 'single'}, unit: 'kt', optionalRender: false,
  },
  {
    label: 'Wing Spread', id: 'wingSpread', valid: valid.greaterThanZero, type: 'number', repeating: true,
    display: { type: 'combined', siblings: ['headlineHeight']}, unit: 'm', order: 1, optionalRender: true,
  },
  {
    label: 'Headline Height', id: 'headlineHeight', valid: valid.greaterThanZero,
    type: 'float', unit: 'm', defaultValue: 0.8, optionalRender: true,
    display: { type: 'child'}, repeating: true,
  },
  {label: 'Non Fish Protected Species',  type: 'bool', id: 'nonFishProtected', valid: valid.alwaysValid, defaultValue: false,
    display: { type: 'single' }, optionalRender: true,
  },
];

export default model;
