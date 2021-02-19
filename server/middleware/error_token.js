module.exports = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.ck("无效的token字符串");
    }
}