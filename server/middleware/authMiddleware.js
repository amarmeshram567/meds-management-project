import jwt from "jsonwebtoken"

const protecteRoute = (req, res, next) => {
    try {
        const auth = req.headers["authorization"];
        const jwtToken = auth && auth.split(" ")[1];

        if (!jwtToken) {
            return res.json({success: false, message: "No token provided"});
        }

        jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
            if (err){
                return res.json({success: false, message: "Invalid token"});
            }

            req.username = payload.username;
            req.userId = payload.userId;
            next();
        })
        
    } catch (error) {
        console.error(error.message)
        res.json({success: false, message: "Server error"})
    }
}

export default protecteRoute;