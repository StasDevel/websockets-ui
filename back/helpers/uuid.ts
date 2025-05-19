export function generateUUID(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function alphaNumericID(): string {
  return Math.random().toString(36).substring(2, 8)
}
