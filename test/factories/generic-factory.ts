export function generateArray<T>(mapper: (i: number) => T, length = 100) {
  return Array.from(Array(length).fill(0), (_, i) => mapper(i + 1));
}
