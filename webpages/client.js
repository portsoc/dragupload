(() => {
    'use strict';

    // upload a dropped file to the server
    async function upload(files) {
        const opts = {
            method: 'POST',
            body: new FormData()
        };
        opts.body.append(`md5me`, files[0], files[0].name);

        const response = await fetch('/upload', opts);
        const obj = await response.json();
        addReport(obj);
    }

    function addReport(obj) {
        // write directly onto the template
        const t = document.querySelector('#md5report');
        t.content.querySelector('.name').textContent = obj.name;
        t.content.querySelector('.hash').textContent = obj.hash;
        // clone what's in the template and insert into the doc
        const clone = document.importNode(t.content, true);
        const reports = document.getElementById('reports');
        reports.insertBefore(clone, reports.firstElementChild);
    }

    // set up the page so any fiel drops are uploaded to the server.
    window.addEventListener('load', () => {
        document.addEventListener('dragover', (e) => {
            e.preventDefault(); // this makes a drop possible
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            upload(e.dataTransfer.files);
        });
    });
})();
