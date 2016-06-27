import Validator from '../utils/Validator';
const valid = Validator.valid;

const model = [
  {label: 'Wing Spread',       id: 'averageSpeed',       valid: valid.greaterThanZero, type: 'float', defaultValue: null,
    editorDisplay: {editor: 'event', type: 'single'}
  },
  {label: 'Bottom Depth', id: 'bottomDepth', valid: valid.greaterThanZero, type: 'number', defaultValue: null,
    combinedValid: {attributes: ["bottomDepth", "groundropeDepth"], func: combined.orderedLessThanOrEqual},
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['groundropeDepth']}
  },
  {label: 'Groundrope Depth',    id: 'groundropeDepth',    valid: valid.greaterThanZero, type: 'number', defaultValue: null,
    combinedValid: {attributes: ["groundropeDepth", "bottomDepth"], func: combined.orderedGreaterThanOrEqual},
  },
  {label: 'Wing Spread',         id: 'wingSpread',         valid: valid.greaterThanZero, type: 'number', defaultValue: null,
    editorDisplay: {editor: 'gear', type: 'single'}
  },
  {label: 'Headline Height',     id: 'headlineHeight',     valid: valid.greaterThanZero, type: 'float', defaultValue: null,
    editorDisplay: {editor: 'gear', type: 'single'}
  },
  {label: 'Non Fish Protected Species',  id: 'nonFishProtected',  valid: valid.alwaysValid, defaultValue: false, type: 'bool',
    editorDisplay: {editor: 'event', type: 'single'}
  },
];

export default model;
