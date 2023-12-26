export function catchError(error: any) {
  // If we have a response error
  if (error.response) {
    // Log the error
    // console.error("Response Error:", error.response.data);
  }
  // Otherwise, if we could not reach the server...
  else if (error.request) {
    // Log the error
    // console.log("Request Error:", error.request);
  }
  // Otherwise... some error occurred in the build up of the request
  else {
    // Log the error
    // console.error("Request Build Up Error:", error.message);
  }
}
