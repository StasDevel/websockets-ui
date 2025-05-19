export function generateUUID() {
    return Math.random().toString(36).substring(2, 15);
}
export function alphaNumericID() {
    return Math.random().toString(36).substring(2, 8);
}
