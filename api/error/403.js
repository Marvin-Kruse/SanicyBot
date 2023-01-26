module.exports = (req, res) => {
    res.json({
        error: { status: 403, message: 'No Authorization', SupportCode: 1 }
    })
}