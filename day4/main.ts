const readInputLines = async () => {
  const res = await Deno.readTextFile('input.txt');
  return res.split('\n').map((l) => l.split(''));
};

const isXmas = (input: string[]) => {
  return input.filter((c) => c !== undefined).join('') === 'XMAS';
};

const isXmasBackwards = (input: string[]) => isXmas(input.toReversed());

const countSlice = (slice: string[]) => {
  const add1 = isXmas(slice) ? 1 : 0;
  const add2 = isXmasBackwards(slice) ? 1 : 0;
  return add1 + add2;
};

const getHorizontalSlice = (
  input: string[][],
  lineIndex: number,
  rowIndex: number
) => {
  return input[lineIndex].slice(rowIndex, rowIndex + 4);
};

const getVerticalSlice = (
  input: string[][],
  lineIndex: number,
  rowIndex: number
) => {
  return [
    input[lineIndex][rowIndex],
    input[lineIndex + 1]?.[rowIndex],
    input[lineIndex + 2]?.[rowIndex],
    input[lineIndex + 3]?.[rowIndex],
  ];
};

const getDiagonalSlice = (
  input: string[][],
  lineIndex: number,
  rowIndex: number
) => {
  return [
    input[lineIndex][rowIndex],
    input[lineIndex + 1]?.[rowIndex + 1],
    input[lineIndex + 2]?.[rowIndex + 2],
    input[lineIndex + 3]?.[rowIndex + 3],
  ];
};

const getBackwardsDiagonalSlice = (
  input: string[][],
  lineIndex: number,
  rowIndex: number
) => {
  if (rowIndex < 3) {
    return [];
  }
  return [
    input[lineIndex][rowIndex],
    input[lineIndex + 1]?.[rowIndex - 1],
    input[lineIndex + 2]?.[rowIndex - 2],
    input[lineIndex + 3]?.[rowIndex - 3],
  ];
};

const checkXmasInput = (input: string[][]) => {
  const totalCount = input.reduce((agg, line, lineIndex) => {
    const lineCount = line.reduce((aggLine, _, rowIndex) => {
      const horizontalSlice = getHorizontalSlice(input, lineIndex, rowIndex);
      const verticalSlice = getVerticalSlice(input, lineIndex, rowIndex);
      const diagonalSlice = getDiagonalSlice(input, lineIndex, rowIndex);
      const backwardsDiagonalSlice = getBackwardsDiagonalSlice(
        input,
        lineIndex,
        rowIndex
      );
      return (
        aggLine +
        countSlice(horizontalSlice) +
        countSlice(verticalSlice) +
        countSlice(diagonalSlice) +
        countSlice(backwardsDiagonalSlice)
      );
    }, 0);
    return agg + lineCount;
  }, 0);
  return totalCount;
};

const checkCorners = (corners: string[]) => {
  const cornerString = corners.join('');
  return ['MMSS', 'MSSM', 'SSMM', 'SMMS'].includes(cornerString);
};

const checkCrossMas = (
  input: string[][],
  lineIndex: number,
  rowIndex: number
) => {
  const center = input[lineIndex][rowIndex];
  if (
    lineIndex < 1 ||
    rowIndex < 1 ||
    lineIndex >= input.length - 1 ||
    rowIndex >= input[0].length - 1 ||
    center !== 'A'
  ) {
    return 0;
  }
  const upLeft = input[lineIndex - 1][rowIndex - 1];
  const upRight = input[lineIndex - 1][rowIndex + 1];
  const downLeft = input[lineIndex + 1][rowIndex - 1];
  const downRight = input[lineIndex + 1][rowIndex + 1];
  const corners = [upLeft, upRight, downRight, downLeft];
  console.log({ corners });
  if (checkCorners(corners)) {
    return 1;
  }
  return 0;
};

const checkCrossMasInput = (input: string[][]) => {
  const totalCount = input.reduce((agg, line, lineIndex) => {
    const lineCount = line.reduce((aggLine, _, rowIndex) => {
      return aggLine + checkCrossMas(input, lineIndex, rowIndex);
    }, 0);
    return agg + lineCount;
  }, 0);
  return totalCount;
};

const input = await readInputLines();
const count = checkCrossMasInput(input);

console.log(count);
