// reqiure env
require('dotenv').config();
const auth = (req, res, next) => {
    const ken = req.session.user;
    if (ken) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.status(401).redirect('/admin/');
    }
}

module.exports = auth;