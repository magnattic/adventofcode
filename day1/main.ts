const readInput = async () => {
  const input = await Deno.readTextFile('input.txt');
  const lines = input.split('\n');
  const sums = lines.reduce(
    (acc, line) => {
      const lineValues = line
        .split(' ')
        .filter((word) => word.length > 0)
        .map(Number);
      console.log(lineValues, acc);
      return [acc[0] + lineValues[0], acc[1] + lineValues[1]];
    },
    [0, 0]
  );
  return Math.abs(sums[0] - sums[1]);
};

const getSortedLists = async () => {
  const input = await Deno.readTextFile('input.txt');
  const lines = input.split('\n');
  const lists = lines.reduce(
    (acc, line) => {
      const lineValues = line
        .split(' ')
        .filter((word) => word.length > 0)
        .map(Number);
      return [
        [...acc[0], lineValues[0]],
        [...acc[1], lineValues[1]],
      ] as const;
    },
    [[], []] as readonly [readonly number[], readonly number[]]
  );
  const list1 = lists[0].toSorted();
  const list2 = lists[1].toSorted();
  return [list1, list2] as const;
};

const readInput2 = async () => {
  const [list1, list2] = await getSortedLists();
  const sum = list1.reduce((acc, list1Value, index) => {
    const list2Value = list2[index];
    return acc + Math.abs(list1Value - list2Value);
  }, 0);

  return sum;
};

const similarity = async () => {
  const [list1, list2] = await getSortedLists();
  const sum = list1.reduce((acc, list1Value) => {
    const count = list2.filter(
      (list2Value) => list2Value === list1Value
    ).length;
    console.log(list1Value, count);
    return acc + count * list1Value;
  }, 0);
  return sum;
};

console.log(await similarity());
