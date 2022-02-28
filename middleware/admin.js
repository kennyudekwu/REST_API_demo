
module.exports = function (req, res, next) {
    // 401 - Unauthorized
    // 403 - Forbidden
    console.log('Verifying admin status...');
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');

    next(); // If user is an admin, we pass control to the next middleware
            // function
}

