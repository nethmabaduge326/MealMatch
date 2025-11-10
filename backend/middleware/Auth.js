const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        // get the token from cookie
        const { token } = req.cookies;
        if (!token) {
            return res
                .status(400)
                .json({ message: "Access denied. No token provided." });
        }

        // verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
