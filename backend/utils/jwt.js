const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const createJwt = (username) => {
    const token = jwt.sign({username}, SECRET_KEY);
    return token;
}

const verifyToken = (token) => {
    const data = jwt.verify(token, SECRET_KEY);
    return data;
}

module.exports = {
    createJwt,
    verifyToken
}
