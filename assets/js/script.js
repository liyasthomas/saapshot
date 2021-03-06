// References to all the element we will need.
const video = document.querySelector('#camera-stream');

const image = document.querySelector('#snap');
const controls = document.querySelector('.controls');
const take_photo_btn = document.querySelector('#take-photo');
const delete_photo_btn = document.querySelector('#delete-photo');
const download_photo_btn = document.querySelector('#download-photo');
const error_message = document.querySelector('#error-message');

// The getUserMedia interface is used for handling camera input.
// Some browsers need a prefix so here we're covering all the options
navigator.getMedia = (navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia);

if (!navigator.getMedia) {
	displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
} else {

	// Request the camera.
	navigator.getMedia({
			video: true
		},
		// Success Callback
		stream => {

			// Create an object URL for the video stream and
			// set it as src of our HTLM video element.
			video.src = window.URL.createObjectURL(stream);

			// Play the video element to start the stream.
			video.play();
			video.onplay = () => {
				showVideo();
			};

		},
		// Error Callback
		err => {
			displayErrorMessage(`There was an error with accessing the camera stream: ${err.name}`, err);
		}
	);

}

take_photo_btn.addEventListener("click", e => {

	e.preventDefault();

	const snap = takeSnapshot();

	// Show image. 
	image.setAttribute('src', snap);
	image.classList.add("visible");

	// Enable delete and save buttons
	delete_photo_btn.classList.remove("disabled");
	download_photo_btn.classList.remove("disabled");

	// Set the href attribute of the download button to the snap url.
	download_photo_btn.href = snap;

	// Pause video playback of stream.
	video.pause();

});

delete_photo_btn.addEventListener("click", e => {

	e.preventDefault();

	// Hide image.
	image.setAttribute('src', "");
	image.classList.remove("visible");

	// Disable delete and save buttons
	delete_photo_btn.classList.add("disabled");
	download_photo_btn.classList.add("disabled");

	// Resume playback of stream.
	video.play();

});

function showVideo() {
	// Display the video stream and the controls.

	hideUI();
	video.classList.add("visible");
	controls.classList.add("visible");
}

function takeSnapshot() {
    // Here we're using a trick that involves a hidden canvas element.  

    const hidden_canvas = document.querySelector('canvas');

    const context = hidden_canvas.getContext('2d');
    const width = video.videoWidth;
    const height = video.videoHeight;

    if (width && height) {

		// Setup a canvas with the same dimensions as the video.
		hidden_canvas.width = width;
		hidden_canvas.height = height;

		// Make a copy of the current frame in the video on the canvas.
		context.drawImage(video, 0, 0, width, height);

		// Turn the canvas image into a dataURL that can be used as a src for our photo.
		return hidden_canvas.toDataURL('image/png');
	}
}

function displayErrorMessage(error_msg, error = "") {
    if (error) {
		console.log(error);
	}

    error_message.innerText = error_msg;

    hideUI();
    error_message.classList.add("visible");
}

function hideUI() {
	// Helper function for clearing the app UI.

	controls.classList.remove("visible");
	video.classList.remove("visible");
	snap.classList.remove("visible");
	error_message.classList.remove("visible");
}

//Generate and Download Screenshot of webpage without lossing the styles https://stackoverflow.com/a/44495166
(exports => {
	function urlsToAbsolute(nodeList) {
		if (!nodeList.length) {
			return [];
		}
		let attrName = "href";
		if (nodeList[0].__proto__ === HTMLImageElement.prototype || nodeList[0].__proto__ === HTMLScriptElement.prototype) {
			attrName = "src";
		}
		nodeList = [].map.call(nodeList, (el, i) => {
			const attr = el.getAttribute(attrName);
			if (!attr) {
				return;
			}
			const absURL = /^(https?|data):/i.test(attr);
			if (absURL) {
				return el;
			} else {
				return el;
			}
		});
		return nodeList;
	}

	function screenshotPage() {
		const wrapper = document.getElementById("capture");
		html2canvas(wrapper, {
			onrendered(canvas) {
				canvas.toBlob(blob => {
					saveAs(blob, "Saap.png");
				});
			}
		});
	}

	function addOnPageLoad_() {
		window.addEventListener("DOMContentLoaded", e => {
			const scrollX = document.documentElement.dataset.scrollX || 0;
			const scrollY = document.documentElement.dataset.scrollY || 0;
			window.scrollTo(scrollX, scrollY);
		});
	}

	function saap() {
		screenshotPage();
	}
	exports.screenshotPage = screenshotPage;
	exports.saap = saap;
})(window);

//Is it possible to control the camera light on a phone via a website? https://https://stackoverflow.com/a/47153547
//const SUPPORTS_MEDIA_DEVICES = "mediaDevices" in navigator;
//
//if (SUPPORTS_MEDIA_DEVICES) {
//	navigator.mediaDevices.enumerateDevices().then(devices => {
//
//		const cameras = devices.filter((device) => device.kind === "videoinput");
//
//		if (cameras.length === 0) {
//			throw "No camera found on this device.";
//		}
//		const camera = cameras[cameras.length - 1];
//
//		navigator.mediaDevices.getUserMedia({
//			video: {
//				deviceId: camera.deviceId,
//				facingMode: ["user", "environment"],
//				height: {
//					ideal: 1080
//				},
//				width: {
//					ideal: 1920
//				}
//			}
//		}).then(stream => {
//			const track = stream.getVideoTracks()[0];
//
//			const imageCapture = new ImageCapture(track)
//			const photoCapabilities = imageCapture.getPhotoCapabilities().then(() => {
//
//				const btn = document.querySelector(".flash");
//				btn.addEventListener("click", function () {
//					var flag = !flag || true;
//					track.applyConstraints({
//						advanced: [{
//							torch: flag
//						}]
//					});
//				});
//			});
//		});
//	});
//}

//Toggle more
function toggleMore() {
	const e = document.getElementById("more");
	e.classList.toggle("closed");
}

//Toggle brightness
function toggleBrightness() {
	const e = document.getElementById("bslider");
	e.classList.toggle("closed");
}

//Toggle saturate
function toggleSaturate() {
	const e = document.getElementById("sslider");
	e.classList.toggle("closed");
}

//Toggle contrast
function toggleContrast() {
	const e = document.getElementById("cslider");
	e.classList.toggle("closed");
}

//Toggle opacity
function toggleOpacity() {
	const e = document.getElementById("oslider");
	e.classList.toggle("closed");
}

//Toggle scale
function toggleScale() {
	const e = document.getElementById("zslider");
	e.classList.toggle("closed");
}

const p = document.getElementById("capture");
const bRange = document.getElementById("b");
const sRange = document.getElementById("s");
const cRange = document.getElementById("c");
const oRange = document.getElementById("o");
const zRange = document.getElementById("z");

bRange.addEventListener("input", function () {
    const sat = sRange.value;
    const con = cRange.value;
    const opa = oRange.value;
    p.style.filter = `brightness(${this.value}%) saturate(${sat}%) contrast(${con}%) opacity(${opa}%)`;
    document.getElementById("bPointSize").value = `${this.value}٪`;
}, false);

sRange.addEventListener("input", function () {
    const bri = bRange.value;
    const con = cRange.value;
    const opa = oRange.value;
    p.style.filter = `brightness(${bri}%) saturate(${this.value}%) contrast(${con}%) opacity(${opa}%)`;
    document.getElementById("sPointSize").value = `${this.value}٪`;
}, false);

cRange.addEventListener("input", function () {
    const bri = bRange.value;
    const sat = sRange.value;
    const opa = oRange.value;
    p.style.filter = `brightness(${bri}%) saturate(${sat}%) contrast(${this.value}%) opacity(${opa}%)`;
    document.getElementById("cPointSize").value = `${this.value}٪`;
}, false);

oRange.addEventListener("input", function () {
    const bri = bRange.value;
    const sat = sRange.value;
    const con = cRange.value;
    p.style.filter = `brightness(${bri}%) saturate(${sat}%) contrast(${con}%) opacity(${this.value}%)`;
    document.getElementById("oPointSize").value = `${this.value}٪`;
}, false);

zRange.addEventListener("input", function () {
	p.style.transform = `scale3d(${this.value},${this.value},${this.value})`;
	document.getElementById("zPointSize").value = `${this.value}×`;
}, false);

//Reset

function resetB() {
    const sat = sRange.value;
    const con = cRange.value;
    const opa = oRange.value;
    p.style.filter = `brightness(100%) saturate(${sat}%) contrast(${con}%) opacity(${opa}%)`;
    document.getElementById("b").value = 100;
    document.getElementById("bPointSize").value = `${100}٪`;
}

function resetS() {
    const bri = bRange.value;
    const con = cRange.value;
    const opa = oRange.value;
    p.style.filter = `brightness(${bri}%) saturate(100%) contrast(${con}%) opacity(${opa}%)`;
    document.getElementById("s").value = 100;
    document.getElementById("sPointSize").value = `${100}٪`;
}

function resetC() {
    const bri = bRange.value;
    const sat = sRange.value;
    const opa = oRange.value;
    p.style.filter = `brightness(${bri}%) saturate(${sat}%) contrast(100%) opacity(${opa}%)`;
    document.getElementById("c").value = 100;
    document.getElementById("cPointSize").value = `${100}٪`;
}

function resetO() {
    const bri = bRange.value;
    const sat = sRange.value;
    const con = cRange.value;
    p.style.filter = `brightness(${bri}%) saturate(${sat}%) contrast(${con}%) opacity(100%)`;
    document.getElementById("o").value = 100;
    document.getElementById("oPointSize").value = `${100}٪`;
}

function resetZ() {
	p.style.transform = "scale3d(1,1,1)";
	document.getElementById("z").value = 1;
	document.getElementById("zPointSize").value = `${1}×`;
}

//Toggle grid
function toggleGrid() {
	const e = document.getElementById("grid");
	e.classList.toggle("hidden");
}
