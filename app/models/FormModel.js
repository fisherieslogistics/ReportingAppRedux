const formModel = [
    {id: 'fishingEvents', defaultValue: []},
    {id: 'sailingTime', type: 'datetime', resource: 'trip'},
    {id: 'permitHolderName', type: 'number', resource: 'user'},
    {id: 'vesselName', type: 'string', resource: 'vessel', key: 'name'},
    {id: 'vesseNumber', type: 'number', resource: 'vessel', key: 'number'},
    {id: 'permitHolderNumber', type: 'number', resource: 'user'},
    {id: 'firstName', type: 'string', resource: 'user'},
    {id: 'lastName', type: 'string', resource: 'user'},
    {id: 'submitted', type: 'bool', defaultValue: false, hidden: true},
    {id: 'id', type: 'number', defaultValue: 0, hidden: true},
    {id: 'dateSigned', type: 'datetime', defaultValue: null, hidden: true},
    {id: 'signature', defaultValue: null, hidden: true}
];

export default formModel;
