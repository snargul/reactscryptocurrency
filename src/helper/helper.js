export function renderTwoDigit (value, unit, exchangeRate=1) {
  value = parseFloat(value) / exchangeRate
  if (value.toString().includes(".")) {
    let parts = value.toString().split(".");
    value = parts[0] + "." + parts[1].substring(0, 2)
  }
  return value.toString() + " " + unit;
}