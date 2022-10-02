export const commas = (x) => {
  return parseFloat(x).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

Number.prototype.toFixedNoRounding = function (n) {
  const reg = new RegExp('^-?\\d+(?:\\.\\d{0,' + n + '})?', 'g')
  const a = this.toString().match(reg)[0]
  const dot = a.indexOf('.')
  if (dot === -1) {
    // integer, insert decimal dot and pad up zeros
    return a + '.' + '0'.repeat(n)
  }
  const b = n - (a.length - dot) + 1
  return b > 0 ? a + '0'.repeat(b) : a
}

export function isNumeric(str) {
  if (typeof str != 'string') return false // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ) // ...and ensure strings of whitespace fail
}
