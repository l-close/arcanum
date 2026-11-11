// arcanum: rng

export function hash01(n: number): number {
  let x = (n | 0) + 0x6d2b79f5
  x = Math.imul(x ^ (x >>> 15), x | 1)
  x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
  return ((x ^ (x >>> 14)) >>> 0) / 4294967296
}
