// type SetItemWithExpiry<T> = {
//   key: string;
//   value: T;
//   ttl: number;
// };

// function setItemWithExpiry({ key, value, ttl }: SetItemWithExpiry<T>): T {
//   const now = new Date();

//   // Create an object with the value and the expiration time
//   const item = {
//     value: value,
//     expiry: now.getTime() + ttl,
//   };

//   localStorage.setItem(key, JSON.stringify(item));
// }
