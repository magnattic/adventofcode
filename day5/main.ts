import { readInputLines } from '../shared/readInput.ts';

type Instruction = {
  before: string;
  after: string;
};

const parseInstructions = (lines: string[]) => {
  const splitLineIndex = lines.findIndex((line) => line.trim() === '');
  const instructions = lines.slice(0, splitLineIndex).map((line) => {
    const split = line.split('|');
    return { before: split[0], after: split[1] };
  });
  const updates = lines
    .slice(splitLineIndex + 1)
    .map((line) => line.split(','));
  return { instructions, updates };
};

const checkPage = (
  page: string,
  beforePages: string[],
  afterPages: string[],
  instructions: Instruction[]
) => {
  const beforeInvalid = instructions.find(
    (instruction) =>
      instruction.before === page && beforePages.includes(instruction.after)
  );
  const afterInvalid = instructions.find(
    (instruction) =>
      instruction.after === page && afterPages.includes(instruction.before)
  );
  const violation = beforeInvalid ?? afterInvalid;
  console.log({ page, beforePages, afterPages, violation });
  return {
    isValid: violation === undefined,
    violation,
  };
};

const checkUpdate = (update: string[], instructions: Instruction[]) => {
  return update.reduce((violation, page, index) => {
    if (violation !== undefined) {
      return violation;
    }
    const before = update.slice(0, index);
    const after = update.slice(index + 1);
    return checkPage(page, before, after, instructions).violation;
  }, undefined as Instruction | undefined);
};

const getMiddlePage = (update: string[]) => update[(update.length - 1) / 2];

const input = await readInputLines();
const { instructions, updates } = parseInstructions(input);

const validUpdates = updates.filter(
  (update) => checkUpdate(update, instructions) === undefined
);
const invalidUpdates = updates.filter(
  (update) => checkUpdate(update, instructions) !== undefined
);

const orderUpdate = (update: string[], instructions: Instruction[]) => {
  const violation = checkUpdate(update, instructions);
  if (violation === undefined) {
    return update;
  }
  const switchedUpdate = swapItems(
    update,
    update.indexOf(violation.before),
    update.indexOf(violation.after)
  );
  return orderUpdate(switchedUpdate, instructions);
};

const swapItems = (update: string[], index1: number, index2: number) => {
  const copy = [...update];
  const temp = copy[index1];
  copy[index1] = copy[index2];
  copy[index2] = temp;
  return copy;
};
const middlePageSum = invalidUpdates.reduce((acc, update) => {
  return acc + Number(getMiddlePage(orderUpdate(update, instructions)));
}, 0);

console.log(updates.length, invalidUpdates.length, middlePageSum);
// console.log(invalidUpdates[0], orderUpdate(invalidUpdates[0], instructions));
