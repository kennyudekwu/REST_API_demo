module.exports = function asyncMiddleWare(handler) {
    // If my request handler was an asynchronous function and not some
    // asynchronous function that returns a promise being called within
    // it
    // return async (req, res, next) => {
    // try {
    //   await handler();
    // }
    // catch(ex) {
    //   next(ex);
    // }
    // };

    // return a route handler function so that express can call it.
    // If we don't and we just call this function as an argument in our
    // "get" router below, Express won't be able to call the function
    // and as thus will never process the event within the funciton, which
    // is handling requests, responses and errors.

    return (req, res, next) => {
      handler(req, res).catch(err => { next(err) });

  }
  }