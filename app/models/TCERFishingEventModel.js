import Validator from '../utils/Validator';
import Helper from '../utils/Helper';
const combined = Validator.combined;
const valid = Validator.valid;
const helper = new Helper();

const model = [
  {label: 'Groundrope Depth', id: 'groundropeDepth', valid: valid.greaterThanZero, type: 'number',
    combinedValid: {attributes: ["groundropeDepth", "bottomDepth"], func: combined.orderedGreaterThanOrEqual}, unit: 'm', optionalRender: true,
    editorDisplay: {editor: 'event', type: 'single'},
  },
  {label: 'Average Speed', id: 'averageSpeed', valid: valid.greaterThanZero, type: 'float',
    editorDisplay: {editor: 'event', type: 'single'}, unit: 'kt', optionalRender: false,
  },
  {label: 'Wing Spread', id: 'wingSpread', valid: valid.greaterThanZero, type: 'number', repeating: true,
    editorDisplay: { editor: 'event', type: 'combined', siblings: ['headlineHeight']}, unit: 'm', order: 1, optionalRender: true,
  },
  {label: 'Headline Height', id: 'headlineHeight', valid: valid.greaterThanZero, type: 'float', unit: 'm', repeating: true, defaultValue: 0.8, optionalRender: true,
  },
  {label: 'Non Fish Protected Species',  type: 'bool', id: 'nonFishProtected', valid: valid.alwaysValid, type: 'bool',
    editorDisplay: {editor: 'event', type: 'single' }, optionalRender: true,
  },
];

export default model;
