export function generatePaymentReference() {
  const timestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
  const randomString = Math.random().toString(36).substr(2, 12); // Generate random alphanumeric string of length 12
  return `${timestamp}-${randomString}`;
  // Sample output -> 1629787553-1v3z5x7v9b11
}

export function generatePasswordResetToken() {
    const timestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
    const randomString = Math.random().toString(36).substr(2, 12); // Generate random alphanumeric string of length 12

    // Split the timestamp into two parts
    // const timestampString = timestamp.toString();
    
    // const firstPart = timestampString.substr(0, 5);
    // const secondPart = timestampString.substr(5);
    // const firstPartOfRandomString = randomString.substr(0, 6);
    // const secondPartOfRandomString = randomString.substr(6);

    // Return the formatted string
    // return `prt-${firstPart}-${firstPartOfRandomString}-${secondPart}-${secondPartOfRandomString}`;
    return `prt-${randomString}${timestamp}`;
}