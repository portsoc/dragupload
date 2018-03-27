const express = require('express');
const multer = require('multer');
const md5File = require('md5-file/promise');

const config = require('./config.json');

const app = express();
const configuredMulter = multer(config);
const single = configuredMulter.single('md5me');

function upload(req, res) {
    single(req, res, async (error) => {
        if (error) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                res.status(413).send('Request Entity Too Large');
            } else {
                res.status(500).send('Server Error');
            }
            return;
        }
        res.json({
            name: req.file.originalname,
            hash: await md5File(req.file.path)
        });
    });
}

app.use(express.json());
app.use('/', express.static('webpages'));
app.post('/upload', upload);

app.listen(8080, (e) => {
    console.log(`server ${e ? 'failed to start' : 'listening'}`);
});
