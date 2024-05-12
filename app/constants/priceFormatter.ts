export const NairaPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    // Remove the extra decimal places
    minimumFractionDigits: 0,
    // Remove the comma separator
    // useGrouping: false
})