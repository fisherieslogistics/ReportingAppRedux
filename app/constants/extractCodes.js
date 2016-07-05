var fs = require('fs');

fs.readFile('codes.json', 'utf8', function(err, data) {
  var jase = data.replace(/'/g, '').split(",");
  var species = [];
  jase.forEach((c, i) => {
    c = c.replace(/"/g, '').replace(/ /g, '');
    if(c.length === 3){
      var desc = jase[i+1].replace(/"/g, '').replace(/ /g, '');
      species.push({value: c, description: desc});
    }
  });
  fs.writeFile('speciesDesc.json', JSON.stringify(species), (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  });
});
