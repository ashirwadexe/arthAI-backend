import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if(!token) {
            return res.status(401).json({
                message: "Unauthorized User!",
                success: false
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decode) {
            return res.status(401).json({
                message: "Invalid User!",
                success: false
            });
        }

        req.userId = decode.userId;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Unauthorized",
            success:false
        });
    }
}

export default isAuthenticated;