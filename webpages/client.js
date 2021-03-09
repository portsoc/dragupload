let __report__;
let __error__;

/**
 * @param  {[type]} template CSS Selector for the HTML template to use
 * @param  {[type]} target   CSS Selector for where the template should be injected.
 */
function injectTemplate(template, target) {
    const clone = document.importNode(template.content, true);
    document.getElementById(target).appendChild(clone);
}

/**
 * Given a previously selected template object and a selector for an
 * element within that object, this function modifes the selected
 * element by inserting the provided text.
 *
 * @param  {HTMLElement} template to be modified
 * @param  {String} selector for an element within the template
 * @param  {String} text to be inserted to the selected element
 */
function prepTemplate(template, selector, text) {
    template.content.querySelector(selector).textContent = text;
}

/**
 * Upload a dropped file to the server
 * @param {Array} files object received from the drop event
 */
async function upload(files) {
    for (const file of files) {
        const opts = {
            method: 'POST',
            body: new FormData()
        };

        opts.body.append(`md5me`, file, file.name);

        try {
          const response = await fetch('/upload', opts);
          if (response.ok) {
              const obj = await response.json();
              reportSuccess(obj);
          } else {
              reportError(response);
          }
        } catch (e) {
          reportError(e);
        }
    }
}

function reportSuccess(obj) {
    prepTemplate(__report__, '.name', obj.name);
    prepTemplate(__report__, '.hash', obj.hash);
    injectTemplate(__report__, 'reports');
}

function reportError(response) {
    if (response.status === 413) {
        prepTemplate(__error__, '.message', 'The uploaded file was too large for the server to process.');
    }
    injectTemplate(__error__, 'reports');
}

// set up the page so any fiel drops are uploaded to the server.
window.addEventListener('load', () => {
    __report__ = document.querySelector('#md5report');
    __error__ = document.querySelector('#err');

    document.addEventListener('dragover', (e) => {
        e.preventDefault(); // this makes a drop possible
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
        upload(e.dataTransfer.files);
    });
});
