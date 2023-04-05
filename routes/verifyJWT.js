const jwt = require('jsonwebtoken')

global.blacklist = []

// Middleware to check if the JWT token is valid and not blacklisted
const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (blacklist.includes(token)) {
        return res.redirect('/login/log')
      //return res.status(402).send('Token has been blacklisted');
    }
    try {
      const decoded = jwt.verify(token, process.env.ADMIN_TOKEN);
      next();
    } catch (err) {
      const myError = 'Παρακαλώ, συνδεθείτε.'
      res.redirect('/login?myError=' + myError)
    }


}

module.exports = verifyToken;

