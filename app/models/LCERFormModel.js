import {firstEventValue} from '../utils/FormUtils';
import LCERFishingEventModel from './LCERFishingEventModel';
import Helper from '../utils/Helper';
const helper = new Helper();

const meta = {
  formCode: 'lcer',
  compatible: (event1, event2) => {
    let daysMatch = (event1.datetimeAtStart.diff(event2.datetimeAtStart, 'days') === 0);
    let signaturesMatch =(event2.signature === event1.signature);
    return (daysMatch && signaturesMatch);
  },
  eventsPerForm: 5,
  textStyle: {
    letterSpacing: 2,
    fontSize: 13.5
  },
  xMultiplier: 114,
  printMapping: {
    form:{
      gearCode: {x: 460, y: 62},
      hookSpacing: {x: 640, y: 62, resolve: form => form.fishingEvents[0].hookSpacing || ""},
      permitHolderName: {x: 130, y: 667, resolveFrom: 'user', resolve: u => u.permitHolderName, textStyle: {letterSpacing: 0.6, fontSize: 13}},
      vesselName: {x: 440, y: 667, resolveFrom: 'vessel', resolve: v => v.name, textStyle: {letterSpacing: 0.6, fontSize: 15}},
      vesselNumber: {x: 568, y: 702, resolveFrom: 'vessel', resolve: v => v.registration},
      permitHolderNumber: {x: 243, y: 702, resolveFrom: 'user', resolve: u => u.permitHolderNumber},
      fisherName: {x: 943, y: 62, resolveFrom: 'user', resolve: u => (u.firstName[0] + "." + u.lastName.slice(0, 4))},
      startDate: { x: 240, y :65, resolve: form => form.fishingEvents[0].datetimeAtStart.format("DD MM YY")}
    },
    fishingEvents: {
      shotNumber: {x: 200, y: 100},
      targetSpecies: {x: 285, y: 100},
      numberOfHooks: {x:200, y: 250, resolve: (fe) => isNaN(parseFloat(fe.numberOfHooks)) ? "" : parseFloat(fe.numberOfHooks)},
      bottomDepth: {x: 200, y: 220, resolve: (fe) => isNaN(parseInt(fe.bottomDepth)) ? "" : parseInt(fe.bottomDepth)},
      nonFishProtected: {x: 235, y: 335, resolve: fe => fe.nonFishProtected ? "X" : "      X"},
      locationAtStart: {
        multiple: true,
        parts:[
          {id: 'lat', x: 207, y: 160, resolve: (fe) => {
            let lat = helper.getDegreesMinutesFromLocation(fe.locationAtStart);
            return `${lat.latDegrees} ${lat.latMinutes}`;
          }},
          {id: 'lon', x: 190, y: 190, resolve: (fe) => {
            let lon = helper.getDegreesMinutesFromLocation(fe.locationAtStart);
            return `${lon.lonDegrees} ${lon.lonMinutes}`;
          }},
          {id: 'w', x: 306, y: 177, resolve: (fe) => {
            let latLon = helper.getDegreesMinutesFromLocation(fe.locationAtStart);
            return latLon.ew  == "W" ? "x" : "";
          }},
          {id: 'e', x: 306, y: 184, resolve: (fe) => {
            let latLon = helper.getDegreesMinutesFromLocation(fe.locationAtStart);
            return latLon.ew == "E" ? "x" : "";
          }}
        ]
      },
      datetimeAtStart: {x: 200, y: 130, resolve: (fe) => { return fe.datetimeAtStart.format("HH:mm")}},
      datetimeAtEnd: {
        multiple: true,
        parts: [
          {x: 212, y: 275, resolve: (fe) => {
            return fe.datetimeAtEnd.format("DD MM YY");
          }},
          {x: 212, y: 305, resolve: (fe) => {
            return fe.datetimeAtEnd.format("HH:mm");
          }}
        ]
      },
      products: {
        multiple: true,
        repeating: true,
        prep: (products) => {
          //sort highest to lowest take the highest 8 by weight
          let totals = helper.getTotals([...products]).sort((c1, c2) => c2.weight - c1.weight).slice(0, 8);
          return totals;
        },
        parts: [
          {
            id: 'code',
            resolve: (fe, i, key) => {
              return fe[key][i] ? fe[key][i].code : "";
            },
            x: 185,
            y: 364,
            ymultiple: 20
          },
          {
            id: 'weight',
            resolve: (fe, i, key) => {
              return fe[key][i] ? fe[key][i].weight : "";
            },
            x: 250,
            y: 364 ,
            textStyle: {fontSize: 12, letterSpacing: 1, marginTop: 3},
            ymultiple: 20
          },
        ]
      },
      otherSpeciesWeight: {id: 'products', resolve: (fe) => {
        return helper.getUncountedWeight(fe.products, 8) + "";
      }, x: 252, y: 605}
    }
  }
}

const LCERFormModel = [
    {id: 'meta', defaultValue: meta},
    {id: 'numberOfHooks', type: 'number'},
    {id: 'hookSpacing', type: 'float'},
    {id: 'fisherName'},
    {id: 'firstName'},
    {id: 'lastName'},
    {id: 'gearCode', defaultValue: 'BLL'},
    {id: 'permitHolderName'},
    {id: 'vesselName'},
    {id: 'vesseNumber'},
    {id: 'permitHolderNumber'},
    {id: 'startDate'}
]
export {meta}
export default LCERFormModel;
