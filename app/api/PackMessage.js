import msgpack from 'msgpack-lite';
import moment from 'moment';

const m_hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

export function toHexString(v: number): string {
    const msn = (v >> 4) & 0x0f;
    const lsn = (v >> 0) & 0x0f;
    return m_hex[msn] + m_hex[lsn];
}

function computeNmeaChecksum(sentenceWithoutChecksum) {
    // init to first character value after the $
    let checksum = sentenceWithoutChecksum.charCodeAt(1);
    // process rest of characters, zero delimited
    for (let i = 2; i < sentenceWithoutChecksum.length; i += 1) {
        checksum ^= sentenceWithoutChecksum.charCodeAt(i);
    }
    // checksum is between 0x00 and 0xff
    checksum &= 0xff;
    return checksum;
}


export default function generateSetances(type, input, payloadLength = 80) {

  function generateString(numberOfFragments, fragmentIndex, timestamp, fragment) {
    const nmeaString = `$FLL,${type},${parseInt(numberOfFragments)},${parseInt(fragmentIndex)},${fragment}`;
    const checksum = toHexString(computeNmeaChecksum(nmeaString));
    console.log(checksum);
    return `${nmeaString}*${checksum}`;
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
