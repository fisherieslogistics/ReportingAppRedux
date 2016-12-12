const example = {
id: 'FDFD443232fdfdvfv',
trip_id: 'ffdf34fd4sfds4vf4332defef',
numberOfInTrip: 3,
nonFishProtected: true,
averageSpeed: 13,
bottomDepth: 1200,
endDate: '2016-11-16T07:28:57+00:00',
startDate: '2016-11-16T07:28:57+00:00',
finished: true,
groundropeDepth: 3443,
targetSpecies: 'GUR',
committed: true,
custom: {},
locationStart: {"type": "Point", "coordinates": [102.0, 0.5]},
locationEnd: {"type": "Point", "coordinates": [102.0, 0.5]},
catches: [{
  weight: 10,
  numberOfContainers: 30,
  containerType: 'Awesome',
  state: 'purple',
  treatment:"iced",
  grade: "Large As",
  code: 'GUR',
},
{
  weight: 10,
  numberOfContainers: 30,
  containerType: 'Awesome',
  state: 'purple',
  treatment:"iced",
  grade: "Large As",
  code: 'GUR'
},
{
  weight: 10,
  numberOfContainers: 30,
  containerType: 'Awesome',
  state: 'purple',
  treatment:"iced",
  grade: "Large As",
  code: 'GUR'
},
{
  weight: 10,
  numberOfContainers: 30,
  containerType: 'Awesome',
  state: 'purple',
  treatment:"iced",
  grade: "Large As",
  code: 'GUR'
}
],
discards: [{
  weight: 10,
  code: 'GUR'
},
{
  weight: 10,
  code: 'GUR'
},
],
protecteds: [
  {
    code: 'SEAL',
    status: 'Alive'
  }
],
incidents: [{
  weight: 10,
  code: 'GUR'
}],
version: '222A',
__legacyId: 'f333323favvfr3',
}


var msgpack = require("msgpack-lite");

function generateSetances(type, input, payloadLength = 250) {

  function generateString(numberOfFragments, fragmentIndex, fragment) {
    return `$FLL,${type},${numberOfFragments},${fragmentIndex},${fragment}*45`;
  }

  var buffer = msgpack.encode(input);
  const data = buffer.toString('base64');

  //const payloadLength = 250; //82;

  const fragmentLength = payloadLength - generateString(99, 99, '').length;

  const numberOfFragments = Math.ceil(data.length/fragmentLength);

  const output = [];
  for(var i = 1; i <= numberOfFragments; i++) {
    const fragment = data.slice((i - 1) * fragmentLength, i * fragmentLength);
    output.push(generateString(numberOfFragments, i,  fragment));
  }
  return output;
}


var net = require('net');

var HOST = '192.168.1.1';
var PORT = 5003;

var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    setInterval(function() {
      generateSetances('FSHEVT', example).map((sentance) => {
        client.write(`${sentance}\r\n`);
      });
    }, 1000);
});

client.on('data', function(data) {

    console.log('DATA: ' + data);
});

client.on('close', function() {
    console.log('Connection closed');
    client.connect(PORT, HOST, function() {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    });
});
