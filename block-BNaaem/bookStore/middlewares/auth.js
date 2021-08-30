let jwt = require('jsonwebtoken');

module.exports = {
  isLoggedIn: async function (req, res, next) {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ error: 'user not logged in' });
    } else {
      try {
        let payload = await jwt.verify(token, 'thisissecret');
        req.user = payload;
        next();
      } catch (error) {
        next(error);
      }
    }
  },
};