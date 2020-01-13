export function createFormattedDate(d: Date = new Date): string {
  return d.toISOString()
    .replace('T', ' ')
}

export default createFormattedDate