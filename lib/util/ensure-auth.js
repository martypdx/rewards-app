const tokenService = require('./token-services');
const { HttpError } = require('./errors');

module.exports = function createEnsureAuth() {
    return (req, res, next) => {
        const token = req.get('Authorization');
        
        tokenService.verify(token)
            .then(payload => {
                req.user = payload;
                req.user.isOwner = req.user.roles.includes('owner');
                req.user.isAdmin = req.user.roles.includes('admin');
                next();
            })
            .catch(() => {
                next(new HttpError({
                    code: 401,
                    message: 'Invalid or missing token'
                }));
            });
    };
};