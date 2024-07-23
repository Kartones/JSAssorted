/*
- RLE packet: count of `00`
- data packet: `01`, `10` or `11`
- logic: read 2 bits: if `00`, read another 6 for size (up to 64 repetitions); else, repeat read
*/

// 6 bits for the data packet repetition number (up to 64 repetitions)
// Note that this could be tweaked, but this way we align to a byte for simplicity
const MAX_RLE_PACKET_COUNT = 2 ** 6;

/*
  input: array of numbers from 0 to 3 (`00`, `01`, `10`, `11`)
*/
export function binaryRLEEncode(input) {
  let result = [];
  let rlePacketCount = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === 0) {
      rlePacketCount++;
    } else {
      if (rlePacketCount > 0) {
        // save chunked by MAX_RLE_PACKET_COUNT
        while (rlePacketCount > 0) {
          let chunk = Math.min(rlePacketCount, MAX_RLE_PACKET_COUNT);
          pushRLEPacket(result, chunk);
          rlePacketCount -= chunk;
        }
        rlePacketCount = 0;
      }
      pushDataPacket(result, input[i]);
    }
  }
  // potential trailing RLE packet
  if (rlePacketCount > 0) {
    pushRLEPacket(result, rlePacketCount);
  }

  return result;
}

function pushRLEPacket(result, rlePacketCount) {
  result.push(0);
  result.push(rlePacketCount);
}

function pushDataPacket(result, dataPacket) {
  result.push(dataPacket);
}

/*
  input: array of numbers from 0 to 3 (`00`, `01`, `10`, `11`)
*/
export function binaryRLEDecode(input) {
  let result = [];
  let rlePacketCount = 0;

  let i = 0;
  while (i < input.length) {
    if (input[i] === 0) {
      i++;
      rlePacketCount = input[i];
      result = result.concat(new Array(rlePacketCount).fill(0));
    } else {
      result.push(input[i]);
    }
    i++;
  }

  return result;
}
