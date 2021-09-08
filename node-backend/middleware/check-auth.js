const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch (error) {
        res.status(500).json({ message: "You are not Authenciated !!" });
    }

}