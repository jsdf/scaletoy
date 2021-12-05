export function wrap(value, max) {
  return ((value % max) + max) % max;
}
export function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}
