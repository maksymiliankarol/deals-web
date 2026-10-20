export const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" })

// D1 stores 'YYYY-MM-DD HH:MM:SS' in UTC with no zone marker. Safari can't
// parse that as-is, so make it a proper ISO string first.
export const parseDbDate = (value: string) => new Date(value.replace(" ", "T") + "Z")

const usd = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" })

export const formatUsd = (cents: number) => usd.format(cents / 100)