const cookieParser = require('cookie-parser');
const session = require('express-session');



const auth = (req, res, next) => {
    const token = req.session.user;
    if (token) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.status(401).redirect('/login');
    }
}

module.exports = auth;