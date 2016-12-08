import Validator from '../utils/Validator';

const tripModel = [
    {
     label: 'Sailing From',
     id: 'startPort', valid: Validator.valid.anyValue, type: 'picker',
     editorDisplay: {editor: 'trip', type: 'single'},
    },
    {
     label: 'Expected Unload Port',
     id: 'endPort', valid: Validator.valid.anyValue, type: 'picker',
     editorDisplay: {editor: 'trip', type: 'single'},
    },
    {
     label: 'Sailing Date',
     id: 'startDate', valid: Validator.valid.anyValue, type: 'datetime',
     editorDisplay: {editor: 'trip', type: 'single'},
    },
    {
     label: 'Estimated Days In Trip',
     id: 'endDate', valid: Validator.valid.anyValue, type: 'picker',
     editorDisplay: {editor: 'trip', type: 'single'},
    },
    {
     id: 'started', defaultValue: false,
     valid: Validator.valid.alwaysValid, type: 'bool', hidden: true,
    },
    {id: 'complete', defaultValue: false,
     valid: Validator.valid.alwaysValid, type: 'bool', hidden: true,
    },
    {id: 'vesselId', defaultValue: "",
     valid: Validator.valid.alwaysValid, hidden: true,
    },
];

export default tripModel
