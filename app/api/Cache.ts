// const setCache = function (req: Request, res: Response, next: NextFunction) {
//     // Keep cache for 5 minutes (in seconds)
//     const period = 60 * 5;

//     // You only want to cache for GET requests
//     if(req.method == "GET") {
//         res.set("Cache-control", `public, max-age=${period}`);
//     } else {
//         // for the other requests, set strict no caching parameters
//         res.set("Cache-control", `no-store`);
//     }

//     // call next to pass on the request
//     next();
// }