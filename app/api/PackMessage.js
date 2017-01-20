import msgpack from 'msgpack-lite';

export default function generateSetances(type, input, payloadLength = 250) {

  function generateString(numberOfFragments, fragmentIndex, fragment) {
    return `$FLL,${type},${numberOfFragments},${fragmentIndex},${fragment}*45`;
  }

  const buffer = msgpack.encode(input);
  const data = buffer.toString('base64');
  const fragmentLength = payloadLength - generateString(99, 99, '').length;
  const numberOfFragments = Math.ceil(data.length/fragmentLength);
  const output = [];
  for(let i = 1; i <= numberOfFragments; i++) {
    const fragment = data.slice((i - 1) * fragmentLength, i * fragmentLength);
    output.push(generateString(numberOfFragments, i,  fragment));
  }
  return output;
}
