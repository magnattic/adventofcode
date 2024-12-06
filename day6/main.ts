import { readInputMatrix } from '../shared/readInput.ts';

const getFacing = (cell: string) => {
  switch (cell) {
    case '^':
      return 'up';
    case 'v':
      return 'down';
    case '<':
      return 'left';
    case '>':
    default:
      return 'right';
  }
};

type GuardPosition = {
  x: number;
  y: number;
  facing: 'up' | 'down' | 'left' | 'right';
};

const findGuard = (map: string[][]): GuardPosition | undefined => {
  for (const [rowIndex, row] of map.entries()) {
    const colIndex = row.findIndex((cell) =>
      ['^', 'v', '<', '>'].includes(cell)
    );
    if (colIndex > -1) {
      return {
        x: colIndex,
        y: rowIndex,
        facing: getFacing(row[colIndex]),
      } satisfies GuardPosition;
    }
  }
};

type MapCell = {
  content: 'obstacle' | 'empty';
  visited: boolean;
  visitedDirection: ('up' | 'down' | 'left' | 'right')[];
};

type Map = MapCell[][];
const turnGuard = (guard: GuardPosition): GuardPosition => {
  switch (guard.facing) {
    case 'up':
      return { ...guard, facing: 'right' };
    case 'down':
      return { ...guard, facing: 'left' };
    case 'left':
      return { ...guard, facing: 'up' };
    case 'right':
    default:
      return { ...guard, facing: 'down' };
  }
};

const getNextCellPosition = (guard: GuardPosition) => {
  switch (guard.facing) {
    case 'up':
      return { x: guard.x, y: guard.y - 1 };
    case 'down':
      return { x: guard.x, y: guard.y + 1 };
    case 'left':
      return { x: guard.x - 1, y: guard.y };
    case 'right':
    default:
      return { x: guard.x + 1, y: guard.y };
  }
};

const markVisited = (guard: GuardPosition, map: Map) => {
  return map.map((row, rowIndex) =>
    row.map((cell, colIndex) =>
      rowIndex === guard.y && colIndex === guard.x
        ? {
            ...cell,
            visited: true,
            visitedDirection: [...cell.visitedDirection, guard.facing],
          }
        : cell
    )
  );
};

const checkForLoop = (guard: GuardPosition, map: Map) => {
  const cell = map[guard.y]?.[guard.x];
  if (cell === undefined) {
    return false;
  }
  return cell.visitedDirection.includes(guard.facing);
};

const moveGuard = (guard: GuardPosition, map: Map) => {
  const nextCellPos = getNextCellPosition(guard);
  const nextCell = map[nextCellPos.y]?.[nextCellPos.x];
  // console.log({ guard, nextCellPos });
  if (checkForLoop(guard, map)) {
    throw 'loop';
  }
  const updatedMap = markVisited(guard, map);
  if (nextCell === undefined) {
    return updatedMap;
  }
  if (nextCell.content === 'obstacle') {
    return moveGuard(turnGuard(guard), updatedMap);
  }
  const movedGuard = { ...guard, ...nextCellPos };
  return moveGuard(movedGuard, updatedMap);
};

const getCellContent = (cell: string) => {
  switch (cell) {
    case '#':
      return 'obstacle';
    default:
      return 'empty';
  }
};

const buildMap = (inputMatrix: string[][]): Map => {
  return inputMatrix.map((row) =>
    row.map(
      (cell) =>
        ({
          content: getCellContent(cell),
          visited: false,
          visitedDirection: [],
        } satisfies MapCell)
    )
  );
};

const printMap = <T>(map: T[][], selector: (v: T) => boolean) => {
  for (const row of map) {
    console.log(row.map((cell) => (selector(cell) ? 'X' : ' ')).join(''));
  }
};

const partOne = async () => {
  console.log('Day 6: Part 1');
  const inputMatrix = await readInputMatrix('input.txt', '');
  const map = buildMap(inputMatrix);
  const initialGuard = findGuard(inputMatrix)!;
  // console.log({ initialGuard });
  const visitedMap = moveGuard(initialGuard, map);
  const visitCount = visitedMap.flat().filter((cell) => cell.visited).length;
  console.log({ visitCount });
  printMap(visitedMap, (v) => v.visited);
  return { visitedMap, initialGuard, map };
};

const placeObstacle = (map: Map, x: number, y: number) => {
  return map.map((row, rowIndex) =>
    row.map((cell, colIndex) =>
      rowIndex === y && colIndex === x
        ? { ...cell, content: 'obstacle' as const }
        : cell
    )
  );
};

const partTwo = async () => {
  const { visitedMap, initialGuard, map } = await partOne();
  console.log('Day 6: Part 2');
  const possibleObstacles = visitedMap.map((row, rowIndex) =>
    row.map(
      (cell, colIndex) =>
        cell.visited &&
        (initialGuard.y !== rowIndex || initialGuard.x !== colIndex)
    )
  );
  console.log(possibleObstacles);

  const result = possibleObstacles.reduce((acc, row, rowIndex) => {
    return acc.concat(
      row.reduce((acc2, _, colIndex) => {
        const obstacledMap = placeObstacle(map, colIndex, rowIndex);
        try {
          moveGuard(initialGuard, obstacledMap);
          return acc2;
        } catch (_e) {
          console.log(_e, 'Loop found at', { x: colIndex, y: rowIndex });
          return [...acc2, { x: colIndex, y: rowIndex }];
        }
      }, [] as { x: number; y: number }[])
    );
  }, [] as { x: number; y: number }[]);
  console.log(result.length);
};

partTwo();
