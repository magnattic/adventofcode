const readInput = () => Deno.readTextFile('input.txt');

const input = await readInput();
const cleaned = input.replaceAll(/don't\(\).+?(?=(do\(\)|$))/g, '');
console.log({ cleaned, inc: cleaned.includes("don't()") });
const mul = cleaned.matchAll(/mul\(([0-9]+),([0-9]+)\)/gs);
const result = mul.reduce((agg, m) => {
  const multi = Number(m[1]) * Number(m[2]);
  //   console.log(agg, m[1], m[2], multi);
  return agg + multi;
}, 0);
console.log({ result });
