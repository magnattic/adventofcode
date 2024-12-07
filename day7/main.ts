import { readInputLines } from '../shared/readInput.ts';

const simpleOperands = ['+', '*'] as const;
const complexOperands = ['+', '*', '||'] as const;
type Operand = (typeof complexOperands)[number];

const calculate = (a: number, b: number, operand: Operand) => {
  switch (operand) {
    case '+':
      return a + b;
    case '*':
      return a * b;
    case '||':
      return Number(a.toString().concat(b.toString()));
  }
};

const findOperands = (
  aggregate: number,
  remainingNumbers: number[],
  target: number,
  operands: Operand[],
  allowedOpperands: readonly Operand[]
): Operand[][] | 'nope' => {
  if (remainingNumbers.length === 0) {
    // console.log('no more numbers', { aggregate, target, operands });
    if (aggregate === target) {
      return [operands];
    } else {
      return 'nope';
    }
  }
  if (aggregate > target) {
    return 'nope';
  }
  const results = allowedOpperands
    .map((operand) => {
      const nextAggregate = calculate(aggregate, remainingNumbers[0], operand);
      const nextRemainingNumbers = remainingNumbers.slice(1);
      return findOperands(
        nextAggregate,
        nextRemainingNumbers,
        target,
        operands.concat(operand),
        allowedOpperands
      );
    })
    .filter((result) => result !== 'nope')
    .flat();
  return results;
};

const searchSolutions = async (
  filename: string,
  allowedOpperands: readonly Operand[]
) => {
  const lines = await readInputLines(filename);
  const variables = lines.map((line) => {
    const match = line.match(/(\d+):\s([\d\s]+)/);
    return {
      result: Number(match?.[1]),
      numbers: match?.[2].split(' ').map(Number)!,
    };
  });
  const nonEmptyResults = variables.reduce((agg, { numbers, result }) => {
    const operands = findOperands(0, numbers, result, [], allowedOpperands);
    if (operands.length > 0) {
      console.log({ numbers, result, agg });
      return agg + result;
    }
    return agg;
  }, 0);
  console.log({ nonEmptyResults });
};

const partOne = (filename: string) => searchSolutions(filename, simpleOperands);
const partTwo = (filename: string) =>
  searchSolutions(filename, complexOperands);

partTwo('input.txt');
