export const readInputLines = async (filename: string) => {
  const content = await Deno.readTextFile(filename);
  return content.split('\n');
};

export const readInputMatrix = async (filename: string, separator: string) => {
  return (await readInputLines(filename)).map((line) => line.split(separator));
};
