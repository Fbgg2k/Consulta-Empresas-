function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function calculateDigit(digits, weights) {
  const sum = digits
    .split('')
    .reduce((total, digit, index) => total + Number(digit) * weights[index], 0)

  const remainder = sum % 11

  return remainder < 2 ? 0 : 11 - remainder
}

function isValidCnpj(value) {
  const cnpj = onlyDigits(value)

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false
  }

  const firstDigit = calculateDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const secondDigit = calculateDigit(
    `${cnpj.slice(0, 12)}${firstDigit}`,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  )

  return firstDigit === Number(cnpj[12]) && secondDigit === Number(cnpj[13])
}

module.exports = {
  onlyDigits,
  isValidCnpj,
}
