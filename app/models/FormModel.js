const formModel = [
    {id: 'fishingEvents', defaultValue: []},
    {id: 'sailingTime', type: 'datetime', resource: 'trip'},
    {id: 'permitHolderName', type: 'number', resource: 'user'},
    {id: 'vesselName', type: 'string', resource: 'vessel', key: 'name'},
    {id: 'vesseNumber', type: 'number', resource: 'vessel', key: 'number'},
    {id: 'permitHolderNumber', type: 'number', resource: 'user'},
    {id: 'firstName', type: 'string', resource: 'user'},
    {id: 'lastName', type: 'string', resource: 'user'},
];

export default formModel;
