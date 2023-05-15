export const getDateString = (date: Date) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  let suffix = ''
  switch (date.getDate()) {
    case 1:
    case 21:
    case 31:
      suffix = 'st'
    case 2:
    case 22:
      suffix = 'nd'
    case 3:
    case 23:
      suffix = 'rd'
    default:
      suffix = 'th'
  }
  return `${monthNames[date.getMonth()]} ${date.getDay()}${suffix}, ${date.getFullYear()}`
}
