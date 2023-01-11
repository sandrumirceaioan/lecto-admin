function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

const express = require('express');
const app = express();

app.use(requireHTTPS);
app.use(express.static('./dist/lecto-admin'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/lecto-admin/'}),
);

console.log(`Node Express server listening on http://localhost:${process.env.PORT}`);
app.listen(process.env.PORT || 8080);

