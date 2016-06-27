import Validator from '../utils/Validator';
import Helper from '../utils/Helper';
const combined = Validator.combined;
const valid = Validator.valid;
const helper = new Helper();
const NUMBER_OF_PRODUCTS = 8;

const model = [
  {label: 'Average Speed', id: 'averageSpeed', valid: valid.greaterThanZero, type: 'float', defaultValue: null,
    editorDisplay: {editor: 'event', type: 'single'}
  },
  {label: 'Bottom Depth', id: 'bottomDepth', valid: valid.greaterThanZero, type: 'number', defaultValue: null,
    combinedValid: {attributes: ["bottomDepth", "groundropeDepth"], func: combined.orderedLessThanOrEqual},
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['groundropeDepth']}
  },
  {label: 'Groundrope Depth', id: 'groundropeDepth', valid: valid.greaterThanZero, type: 'number', defaultValue: null,
    combinedValid: {attributes: ["groundropeDepth", "bottomDepth"], func: combined.orderedGreaterThanOrEqual},
  },
  {label: 'Wing Spread', id: 'wingSpread', valid: valid.greaterThanZero, type: 'number', defaultValue: null,
    editorDisplay: {editor: 'gear', type: 'single'}
  },
  {label: 'Headline Height', id: 'headlineHeight', valid: valid.greaterThanZero, type: 'float', defaultValue: null,
    editorDisplay: {editor: 'gear', type: 'single'}
  },
  {label: 'Non Fish Protected Species',  id: 'nonFishProtected', valid: valid.alwaysValid, defaultValue: false, type: 'bool',
    editorDisplay: {editor: 'event', type: 'single'}
  },
];

export default model;
