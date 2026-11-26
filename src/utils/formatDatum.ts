import type { Datum } from '../models/strategy'

const numberFormat = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 3 })

export function formatDatum(datum: Datum<string | number>, unit?: string) {
  if (datum.value === null) return 'No data'
  const value = typeof datum.value === 'number' ? numberFormat.format(datum.value) : datum.value
  if (!unit) return value
  return unit === '%' ? `${value}%` : `${value} ${unit}`
}
