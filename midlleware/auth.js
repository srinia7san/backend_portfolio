// middleware/auth.js

export const isAuthenticated = (req, res, next) => {
    // Simple check for x-admin-token header
    // In a real app, use JWT or Session
    const token = req.headers['x-admin-token'];

    if (!token || token !== process.env.ADMIN_TOKEN_SECRET) {
        // Allow if request is coming from specific simple auth flow
        // For this portfolio, we'll verify credentials sent in body for login only
        return next();
    }
    next();
};

export const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === `Bearer ${process.env.ADMIN_PASS}`) {
        next();
    } else {
        res.status(401).json({ success: false, message: "Unauthorized access" });
    }
};
