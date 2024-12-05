const readData = async () => {
  const data = await Deno.readTextFile('input.txt');
  return data;
};

const getLines = (data: string) =>
  data.split('\n').map((line) => line.split(' ').map(Number));

const getValidLines = (lines: number[][]) =>
  lines.reduce((acc, line) => {
    if (checkLine(line)) {
      //   console.log(line);
      return acc + 1;
    }
    if (checkVariations(line)) {
      console.log('variation!', line);
      return acc + 1;
    }
    return acc;
  }, 0);

const checkLine = (line: number[]) => {
  const goSign = Math.sign(line[1] - line[0]);
  for (let i = 0; i < line.length - 1; i++) {
    const current = line[i];
    const next = line[i + 1];
    const diff = next - current;
    const sign = Math.sign(diff);
    if (goSign !== sign) {
      return false;
    }
    if (Math.abs(diff) == 0 || Math.abs(diff) > 3) {
      return false;
    }
  }
  return true;
};

const checkVariations = (line: number[]) => {
  for (let i = 0; i < line.length; i++) {
    if (checkLine(line.toSpliced(i, 1))) {
      console.log('spliced', line.toSpliced(i, 1));
      return true;
    }
  }
  return false;
};

console.log(getValidLines(getLines(await readData())));
