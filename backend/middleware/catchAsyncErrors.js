//module.exports = (theFunc) => (req, res, next) => {
  //Promise.resolve(theFunc(req, res, next)).catch(next);
//};
// catchAsyncErrors.js
module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next))
    .catch((error) => {
      console.error('Async Error:', error); // Add this line for enhanced logging
      next(error);
    });
};
