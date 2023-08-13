module.exports = errorHandler =>{
    return (req, res, next) =>{
        errorHandler(req,res,next).catch(next);
    }
}