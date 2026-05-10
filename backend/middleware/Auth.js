const jwt = require("jsonwebtoken");

// Verify the token
const authenticate = async (req, res, next) => {
    try {
        // get the token from cookie
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ success: false, message: "Invalid Token" });
    }
};

// Check the roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden - insufficient permissions",
            });
        }
        next();
    };
};

module.exports = {authenticate, authorize};
