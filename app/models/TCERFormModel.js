import {firstEventValue} from '../utils/FormUtils';
import TCERFishingEventModel from './TCERFishingEventModel';
import Helper from '../utils/Helper';
const helper = new Helper();

const meta = {
  formCode: 'tcer',
  compatible: (event1, event2) => {
    let daysMatch = (event1.datetimeAtStart.diff(event2.datetimeAtStart, 'days') !== 0);
    let wingSpreadsMatch = (event2.wingSpread == event1.wingSpread);
    let headlineHeightsMatch = (event2.headlineHeight == event1.headlineHeight);
    return (daysMatch && wingSpreadsMatch && headlineHeightsMatch);
  },
  eventsPerForm: 4,
  xMultiplier: 210,
  yMultiplier: 30,
  printMapping: {
    form:{
      wingSpread: {x: 370, y: 50, resolve: form => form.fishingEvents[0].wingSpread},
      headlineHeight: {x: 645, y: 50, resolve: form => form.fishingEvents[0].wingSpread,
                       textStyle: {textAlign: 'right'}},
      permitHolderName: {x: 100, y: 625, resolveFrom: 'user'},
      vesselName: {x: 420, y: 625, resolveFrom: 'vessel'},
      vesseNumber: {x: 545, y: 660, resolveFrom: 'vessel'},
      permitHolderNumber: {x: 212, y: 660, resolveFrom: 'user'},
      fisherName: {x: 245, y: 690, resolveFrom: 'user', resolve: u => u.firstName[1] + u.lastName.slice(0, 4)},
    },
    fishingEvents: {
      gearCode: {x: 190, y: 50},
      targetSpecies: {x: 310, y: 85},
      bottomDepth: {x: 215, y: 227},
      groundropeDepth: {x: 275, y: 227, resolve: (fe) => parseFloat(fe.groundropeDepth).toFixed(1)},
      nonFishProtected: {x: 100, y: 625, resolve: (fe) => fe.nonFishProtected ? "YES" : "NO"},
      averageSpeed: {x: 645, y: 50, align: 'right', resolve: (val) => parseFloat(val).toFixed(1)},
      targetSpecies: {x: 310, y: 85},
      locationAtStart: {
        multiple: true,
        parts:[
          {id: 'lat', x: 180, y: 167, resolve: (loc) => {
            let lat = helper.getDegreesMinutesFromLocation(loc);
            return `${lat.latDegrees}${lat.latMinutes}`;
          }},
          {id: 'lon', x: 182, y: 194, resolve: (loc) => {
            let lon = helper.getDegreesMinutesFromLocation(loc);
            return `${lon.lonDegrees}${lon.lonMinutes}`;
          }},
          {id: 'ew', x: 310, y: 194, resolve: (loc) => {
            let latLon = helper.getDegreesMinutesFromLocation(loc);
            return latLon.ew;
          }}
        ]
      },
      datetimeAtStart: {
        multiple: true,
        parts: [
          {x: 185, y: 115, resolve: (datetime) => {
            return datetime.format("DD  MM   YYYY");
          }},
          {x: 184, y: 140, resolve: (datetime) => {
            return datetime.format("HH   mm");
          }}
        ]
      },
      datetimeAtEnd: {resolve: (datetime) => datetime.format("HH   mm"), x: 180, y: 282},
      products: {
        multiple: true,
        prep: (products) => {
          return helper.getTotals(products).slice(0, NUMBER_OF_PRODUCTS);
        },
        parts: [
          {id: 'code', resolve: (p) => p.code, y: 308, x: 168, ymultiple: 20, repeating: true},
          {id: 'weight', resolve: (p) => p.weight, y: 240, x: 168, ymultiple: 20, repeating: true},
        ]
      },
      otherSpeciesWeight: {id: 'products', resolve: (products) => {
        return helper.getUncountedWeight(products, NUMBER_OF_PRODUCTS);
      }, x: 240, y: 568}
    }
  }
}

const TCERFormModel = [
    {id: 'meta', defaultValue: meta},
    {id: 'wingSpread', type: 'number'},
    {id: 'headlineHeight', type: 'number'},
    {id: 'fisherName'},
    {id: 'firstName'},
    {id: 'lastName'},
    {id: 'gearCode', defaultValue: 'BT'},
    {id: 'permitHolderName'},
    {id: 'vesselName'},
    {id: 'vesseNumber'},
    {id: 'permitHolderNumber'},
    {id: 'fisherName'},
];
export {meta}
export default TCERFormModel;
