module.exports = function(req, res, next) {
    //sails.log.level(req.session.languagePreference);
    req.setLocale('en');
    next();
};