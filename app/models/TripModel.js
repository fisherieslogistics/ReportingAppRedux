import Validator from '../utils/Validator';

const tripModel = [
    {id: 'startPort', valid: Validator.valid.anyValue, type: 'picker'},
    {id: 'endPort', valid: Validator.valid.anyValue, type: 'picker'},
    {id: 'startDate', valid: Validator.valid.anyValue, type: 'datetime'},
    {id: 'endDate', valid: Validator.valid.anyValue, type: 'datetime'},
    {id: 'started', defaultValue: false, valid: Validator.valid.alwaysValid, type: 'bool', hidden: true},
    {id: 'complete', defaultValue: false, valid: Validator.valid.alwaysValid, type: 'bool', hidden: true},
    {id: 'vesselId', defaultValue: "", valid: Validator.valid.alwaysValid, hidden: true},
];

export default tripModel
