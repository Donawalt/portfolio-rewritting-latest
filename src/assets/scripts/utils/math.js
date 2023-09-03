export function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

export function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

export function interpolate(start, end, value) {
  return start * (1.0 - value) + end * value;
}

export function clamp(min, max, number) {
  return Math.max(min, Math.min(number, max));
}

export function random(min, max) {
  return Math.random() * (max - min) + min;
}

export function percentToPixel(x, total) {
  return total * x / 100;
}

export function pixelToPercent(x, total) {
  return x * 100 / total;
}

export function crossProduct(a, b, c) {
  return (c * b) / a;
}

export function nullSave(eValue, rValue) {
  if(!rValue){
    return eValue && eValue;
  }
  return eValue ? eValue : rValue;
}

export function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export  function removeDuplicates(arr) {
  return arr.filter((item,
      index) => arr.indexOf(item) === index);
}

export function duplicateArray(arr) {
  return  JSON.parse(JSON.stringify(arr))
}