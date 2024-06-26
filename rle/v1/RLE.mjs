export function rleEncode(input) {
  let result = [];
  let count = 1;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === input[i + 1]) {
      count++;
    } else {
      result.push(count);
      result.push(input[i]);
      count = 1;
    }
  }

  return result;
}

export function rleDecode(input) {
  let result = [];

  for (let i = 0; i < input.length; i += 2) {
    let count = input[i];
    result = result.concat(new Array(count).fill(input[i + 1]));
  }

  return result;
}
