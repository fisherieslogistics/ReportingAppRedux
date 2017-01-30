import msgpack from 'msgpack-lite';
import moment from 'moment';

const hashCode = function(str) {
  let hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export default function generateSetances(type, input, payloadLength = 80) {

  function generateString(numberOfFragments, fragmentIndex, timestamp, fragment) {
    const data = `$FLL,${type},${parseInt(numberOfFragments)},${parseInt(fragmentIndex)},${fragment}`;
    //const hash = hashCode(data);
    return `${data}*1`;
  }

  const buffer = msgpack.encode(input);
  const data = buffer.toString('base64');
  const fragmentLength = payloadLength - generateString(type, 1, 1, 1).length;
  const numberOfFragments = Math.ceil(data.length/fragmentLength);
  const output = [];
  const timestamp = new moment().unix();

  for(let i = 1; i <= numberOfFragments; i++) {
    const fragment = data.slice((i - 1) * fragmentLength, i * fragmentLength);
    output.push(generateString(numberOfFragments, i, timestamp, fragment));
  }

  return output;
}
