import Validator from '../utils/Validator';
import Helper from '../utils/Helper';
const combined = Validator.combined;
const valid = Validator.valid;
const helper = new Helper();

const model = [
  {label: 'Average Speed', id: 'averageSpeed', valid: valid.greaterThanZero, type: 'float',
    editorDisplay: {editor: 'event', type: 'single'}, unit: 'kt'
  },
  {label: 'Bottom Depth', id: 'bottomDepth', valid: valid.greaterThanZero, type: 'number',
    combinedValid: {attributes: ["bottomDepth", "groundropeDepth"], func: combined.orderedLessThanOrEqual},
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['groundropeDepth']}, unit: 'm'
  },
  {label: 'Groundrope Depth', id: 'groundropeDepth', valid: valid.greaterThanZero, type: 'number',
    combinedValid: {attributes: ["groundropeDepth", "bottomDepth"], func: combined.orderedGreaterThanOrEqual}, unit: 'm'
  },
  {label: 'Wing Spread', id: 'wingSpread', valid: valid.greaterThanZero, type: 'number',
    editorDisplay: {editor: 'gear', type: 'single'}, unit: 'm'
  },
  {label: 'Headline Height', id: 'headlineHeight', valid: valid.greaterThanZero, type: 'float', 
    editorDisplay: {editor: 'gear', type: 'single'}, unit: 'm'
  },
];

export default model;
