import Validator from '../utils/Validator';

const tripModel = [
    {
     label: 'Sailing From', id: 'startPort', valid: Validator.valid.anyValue, type: 'picker',
     display: { type: 'single'},
    },
    {
     label: 'Expected Unload Port', id: 'endPort', valid: Validator.valid.anyValue, type: 'picker',
     display: { type: 'single'},
    },
    {
     label: 'Sailing Date', id: 'startDate', valid: Validator.valid.anyValue, type: 'datetime',
    },
    {
     label: 'Estimated Days Left In Trip', id: 'endDate', valid: Validator.valid.anyValue, type: 'picker', unit: 'days',
     display: { type: 'single'},
    },
    {
     id: 'started', defaultValue: false, valid: Validator.valid.alwaysValid, type: 'bool',
    },
    {
      id: 'complete', defaultValue: false, valid: Validator.valid.alwaysValid, type: 'bool',
    },
    {
      id: 'vesselId', defaultValue: "", valid: Validator.valid.alwaysValid,
    },
    {
      id: 'contacts', defaultValue: [], valid: Validator.valid.alwaysValid,
    }
];

export default tripModel
