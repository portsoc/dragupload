var registerDragListeners = function (target) {
	// this makes a drop possible - remove it and drop events cannot occur.
	target.addEventListener("dragover",
		function(e) { e.preventDefault(); }
	);

	target.addEventListener("drop",
		function(e) {
			e.preventDefault();
			upload(e.dataTransfer.files);
		}
	);
};


var xhrSend = function(method, uri, payload, callback) {

	var xhr = new XMLHttpRequest();
	xhr.open(method, uri, true);

	xhr.setRequestHeader("Accept", "application/json");

	if (!payload) {
		// no payload? don't use the form's multipart mime type.
		xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	}

	for (var evt in callback) {
		xhr.addEventListener(evt, callback[evt].bind(xhr));
	}

	xhr.send(payload);
};


var upload = function (files) {

	var
		fd,
		xhr,
		callback = {},
		file = files[0];

	callback.load = function() {
		console.log("Loaded", this.responseText );
		console.log("Loaded", JSON.parse(this.responseText) );
	};

	callback.progress = function uploadProgress(e) {
		if (e.lengthComputable) {
			var done = Math.round(e.loaded * 100 / e.total);
			document.getElementById('upprogbar').value = done;
		} else {
			document.getElementById('upprogbar').value = 0;
		}
	};

	callback.error = function uploadError(e) {
		document.getElementById("startuploadbutton").value="Start upload againâ€¦";
		document.getElementById("startuploadbutton").disabled=false;
		document.getElementById("fileInput").disabled=false;
		document.getElementById("upprog").innerHTML = "Previous upload failed.  No upload in progress." ;
	};

	uploadform = document.forms.uploadform;

	fd = new FormData();
	fd.append("file", file);
	fd.append("ua", navigator.userAgent);

	console.log("Aiming to upload file: ", file);

	xhrSend(
		"POST",
		"receiver.php",
		fd,
		callback
	);

	return false;

};

window.addEventListener("load", function() {
	registerDragListeners(
		document.getElementById("dragtarget")
	);
	// or use the more generic...
	// registerDragListeners(window);
});
