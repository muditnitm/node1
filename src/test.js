const express = require('express');
const app = express();
const fs = require('fs')
const http = require('http')
app.use(express.static('public')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/


app.get('/file', (req, res) => {
    var file = fs.createReadStream('./resume_updated_20_09_2019.pdf');
    var stat = fs.statSync('./resume_updated_20_09_2019.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    file.pipe(res);
    // res.sendFile(__dirname, 'resume_updated_20_09_2019.pdf')
})
app.listen(3000, function () {
    console.log("Listening on port 3000!")
});


app.get('/', async (req, res) => {
    http.get('http://localhost:3000/file', (response) => {
        var chunks = [];

        response.on('data', function (chunk) {

            console.log('downloading');

            chunks.push(chunk);

        });

        response.on("end", function () {
            console.log('downloaded');
            var jsfile = new Buffer.concat(chunks).toString('base64');
            console.log('converted to base64');
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=some_file.pdf',
                'Content-Length': jsfile.length
            });
            res.end(jsfile)
        });

    })
})