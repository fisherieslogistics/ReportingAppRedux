import {firstEventValue} from '../utils/FormUtils';
import TCERFishingEventModel from './TCERFishingEventModel';
import Helper from '../utils/Helper';
const helper = new Helper();

const meta = {
  formCode: 'tcer',
  compatible: (event1, event2) => {
    let daysMatch = (event1.datetimeAtStart.diff(event2.datetimeAtStart, 'days') === 0);
    let wingSpreadsMatch = (event2.wingSpread == event1.wingSpread);
    let headlineHeightsMatch = (event2.headlineHeight == event1.headlineHeight);
    return (daysMatch && wingSpreadsMatch && headlineHeightsMatch);
  },
  eventsPerForm: 4,
  xMultiplier: 210 * 0.80,
  printMapping: {
    form:{
      gearCode: {x: 190, y: 50},
      wingSpread: {x: 370, y: 50, resolve: form => form.fishingEvents[0].wingSpread},
      headlineHeight: {x: 645, y: 50, resolve: form => form.fishingEvents[0].headlineHeight,
                                                        textStyle: {textAlign: 'right'}},
      permitHolderName: {x: 100, y: 625, resolveFrom: 'user', resolve: u => u.permitHolderName},
      vesselName: {x: 420, y: 625, resolveFrom: 'vessel', resolve: v => v.name},
      vesseNumber: {x: 545, y: 660, resolveFrom: 'vessel', resolve: v => v.number},
      permitHolderNumber: {x: 212, y: 660, resolveFrom: 'user', resolve: u => u.permitHolderNumber},
      fisherName: {x: 245, y: 690, resolveFrom: 'user', resolve: u => u.fisrtName[0] + "." + u.lastName.slice(0, 4)},
    },
    fishingEvents: {
      shotNumber: {x: 220, y: 85},
      targetSpecies: {x: 310, y: 85},
      bottomDepth: {x: 215, y: 227},
      groundropeDepth: {x: 275, y: 227, resolve: fe => parseFloat(fe.groundropeDepth).toFixed(1)},
      nonFishProtected: {x: 195, y: 312, resolve: fe => fe.nonFishProtected ? "X" : "           X"},
      averageSpeed: {x: 180, y: 255, align: 'right', resolve: fe => parseFloat(fe.averageSpeed).toFixed(1)},
      targetSpecies: {x: 310, y: 85},
      locationAtStart: {
        multiple: true,
        parts:[
          {id: 'lat', x: 190, y: 175, resolve: (fe) => {
            let lat = helper.getDegreesMinutesFromLocation(fe.locationAtStart);
            return "42 34"//`${lat.latDegrees}${lat.latMinutes}`;
          }},
          {id: 'lon', x: 190, y: 204, resolve: (fe) => {
            let lon = helper.getDegreesMinutesFromLocation(fe.locationAtStart);
            return "172 31"//`${lon.lonDegrees}${lon.lonMinutes}`;
          }},
          {id: 'ew', x: 310, y: 204, resolve: (fe) => {
            let latLon = helper.getDegreesMinutesFromLocation(fe.locationAtStart);
            return "E"//latLon.ew;
          }}
        ]
      },
      datetimeAtStart: {
        multiple: true,
        parts: [
          {x: 185, y: 115, resolve: (fe) => {
            return fe.datetimeAtStart.format("DD   MM    YYYY");
          }},
          {x: 184, y: 140, resolve: (fe) => {
            return fe.datetimeAtStart.format("HH   mm");
          }}
        ]
      },
      datetimeAtEnd: {resolve: (fe) => datetimeAtEnd.format("HH   mm"), x: 180, y: 282},
      products: {
        multiple: true,
        repeating: true,
        prep: (products) => {
          return helper.getTotals([...products]).slice(0, 8);
        },
        parts: [
          {id: 'code', resolve: (fe, i) => fe.products[i].code, x: 168, y: 340, ymultiple: 23},
          {id: 'weight', resolve: (fe, i) => fe.products[i].weight, x: 240, y:340 , ymultiple: 23},
        ]
      },
      otherSpeciesWeight: {id: 'products', resolve: (fe) => {
        return helper.getUncountedWeight(fe.products, 8);
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
