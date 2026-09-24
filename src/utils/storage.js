import { isValidCnpj, onlyDigits } from './cnpj'

const STORAGE_KEY = 'historicoCnpj'
const MAX_HISTORY_ITEMS = 5

export function getHistory() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedHistory = JSON.parse(window.localStorage.getItem(STORAGE_KEY))

    if (!Array.isArray(storedHistory)) {
      return []
    }

    return storedHistory
      .map(onlyDigits)
      .filter(isValidCnpj)
      .slice(0, MAX_HISTORY_ITEMS)
  } catch {
    return []
  }
}

export function addCnpjToHistory(cnpj) {
  const normalizedCnpj = onlyDigits(cnpj)
  const currentHistory = getHistory()

  if (!isValidCnpj(normalizedCnpj)) {
    return currentHistory
  }

  const nextHistory = [
    normalizedCnpj,
    ...currentHistory.filter((item) => item !== normalizedCnpj),
  ].slice(0, MAX_HISTORY_ITEMS)

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory))
  } catch {
    // O histórico continua funcionando em memória quando o navegador bloqueia o storage.
  }

  return nextHistory
}
