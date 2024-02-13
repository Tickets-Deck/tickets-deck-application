export function generatePaymentReference() {
  const timestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
  const randomString = Math.random().toString(36).substr(2, 12); // Generate random alphanumeric string of length 12
  return `${timestamp}-${randomString}`;
  // Sample output -> 1629787553-1v3z5x7v9b11
}
