const checklogin = function(req, res, next){
    if(!req.session.phone){
        res.redirect('/login')
    }
    next();
}
export default checklogin