export const commas = (x) => {
  return parseFloat(x).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
