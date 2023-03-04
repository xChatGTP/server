export function strip0x(str: string): string {
  return str.slice(0, 2) === '0x' ? str.slice(2) : str
}
