module.exports = (client, app) => {
    app.use(function (req, res, next) {
        res.status(404);
        if (req.accepts('json')) {
            res.json({ error: { status: 404, message: 'Not Found', SupportCode: 0, url: req.url } });
            return;
        }
    });
}