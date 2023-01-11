const express = require('express');
const app = express();

app.use(express.static('./dist/lecto-admin'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/lecto-admin/'}),
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
});