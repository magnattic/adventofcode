export const readInputLines = async () => {
  const content = await Deno.readTextFile('input.txt');
  return content.split('\n');
};
