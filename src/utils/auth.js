require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
    isAuthenticated: (req, res, next) => {
        const authToken = req.headers.authorization;
        let token;
        if (authToken) {
            token = authToken.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                error: "You are not authorized",
            });
        }

        const decoded = verifyToken(token);
        if (Object.keys(decoded).length === 0) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        req.user = decoded;
        next();
    },

    AuthMiddleware: (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }
        try {
            const decoded = JSON.parse(decrypt(token));
            req.headers.id = decoded.user;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
    },
    generateToken: (user, tokenType) => {
        let token;

        if (tokenType === "access") {
            token = jwt.sign(
                { email: user.email, id: user._id },
                process.env.ACCESS_TOKEN,
                {
                    expiresIn: "7d",
                }
            );
        } else {
            token = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN);
        }
        return token;
    },
};

const verifyToken = (token) => {
    let decoded = {};
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, param) => {
        if (err) {
            return;
        }
        decoded = param;
    });
    return decoded;
};
