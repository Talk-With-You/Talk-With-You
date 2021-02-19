module.exports = (req, res, next) => {
    res.ck = (err, status = 1) => {
        res.send({
            status: status,
            msg: (err instanceof Error)? err.message : err
        });
    };
    next();
}