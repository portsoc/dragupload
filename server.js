const express = require('express');
const md5File = require('md5-file/promise');
const app = express();
const multer = require('multer');
const config = require('./config.json');
const upload = multer(config);

app.use('/', express.static('webpages'));
app.use(express.json());

app.post('/upload', upload.single('md5me'), async (req, res) => {
    res.json({
        name: req.file.originalname,
        hash: await md5File(req.file.path)
    });
});

app.listen(8080, (e) => {
    console.log(`server ${e ? 'failed to start' : 'listening'}`);
});
