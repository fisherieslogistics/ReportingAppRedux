import Validator from '../utils/Validator';
const valid = Validator.valid;

const model = [
  /*{label: 'Lengthener Orientation', id: 'lengthenerOrientation', valid: valid.alwaysValid, defaultValue: "T90",
    editorDisplay: {editor: 'gear', type: 'combined', siblings: ['lengthenerMeshSize']}
  },
  {label: 'Lengther Mesh Size', id: 'lengthenerMeshSize', valid: valid.alwaysValid,  type: 'number', unit: 'mm'},

  {label: 'Codend Mesh Orientation', id: 'codendMeshOrientation', valid: valid.alwaysValid, defaultValue: "Diamond",
    editorDisplay: {editor: 'gear', type: 'combined', siblings: ['codendMeshSize']}
  },
  {label: 'Codend Mesh Size', id: 'codendMeshSize', valid: valid.alwaysValid, type: 'number', defaultValue: "", unit: 'mm'},

  {label: 'Codend Attachment', id: 'codendMeshAttachment', valid: valid.alwaysValid,
    editorDisplay: {editor: 'gear', type: 'single'}},

  {label: 'Chaffing Mat', id: 'chaffingMat', valid: valid.alwaysValid, type: 'bool', defaultValue: true,
    editorDisplay: {editor: 'gear', type: 'single'}},

  {label: 'Warps', id: 'warps', valid: valid.alwaysValid,
      editorDisplay: {editor: 'gear', type: 'single'}},

  {label: 'Sweeps', id: 'sweeps', valid: valid.alwaysValid,
      editorDisplay: {editor: 'gear', type: 'single'},
  },

  {label: 'Top Bridles', id: 'topBridles', valid: valid.alwaysValid,
    editorDisplay: {editor: 'gear', type: 'combined', siblings: ["bottomBridles"]}
  },
  {label: 'Bottom Bridles', id: 'bottomBridles', valid: valid.alwaysValid},*/

  {label: 'Wing Spread', id: 'wingSpread', type: 'number', valid: valid.greaterThanZero,
    editorDisplay: {editor: 'gear', type: 'single'},
  },
  {label: 'Headline Height', id: 'headlineHeight', type: 'number', valid: valid.greaterThanZero,
    editorDisplay: {editor: 'gear', type: 'single'},
  }
];

export default model;
