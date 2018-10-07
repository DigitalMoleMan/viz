window.onload = function () {


	var file = document.getElementById("thefile");
	var audio = document.getElementById("audio");

	file.onchange = function () {
		document.getElementById("selectedfile").innerHTML = document.getElementById("thefile").files["0"].name;
		var files = this.files;
		audio.src = URL.createObjectURL(files[0]);
		audio.load();
		audio.play();
		var context = new AudioContext();
		var src = context.createMediaElementSource(audio);
		var analyser = context.createAnalyser();

		var canvas = document.getElementById("canvas");
		var ctx = canvas.getContext("2d");
		

		src.connect(analyser);
		analyser.connect(context.destination);

		analyser.fftSize = 128;

		var bufferLength = analyser.frequencyBinCount;
		console.log("analyser: " + analyser);
		console.log("analyser.frequencyBinCount: " + analyser.frequencyBinCount);
		console.log("bufferLength: " + bufferLength);

		var dataArray = new Uint8Array(bufferLength);

		canvas.width = window.innerWidth;

		var canmod = canvas.width / 1920;
			canvas.height *= canmod;

		var WIDTH = canvas.width;
		var HEIGHT = canvas.height - 20;

		var barWidth = (WIDTH / bufferLength);
		var barHeight;
		var x = 0;

		function renderFrame() {
			requestAnimationFrame(renderFrame);

			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			x = 0;

			analyser.getByteFrequencyData(dataArray);

			ctx.fillStyle = "rgba(0, 0, 0, 1)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			for (var i = 0; i < bufferLength; i++) {
				barHeight = dataArray[i];

				var r = 255 - (x / 4);
				var g = 255 - barHeight;
				var b = x / 5;
				var a = barHeight / 128;

				var bridge = barWidth;


				ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
				ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
				ctx.beginPath();
				ctx.moveTo((WIDTH / 3) + ((x + bridge) / 3), (HEIGHT - dataArray[i + 1]) / 1.5);
				ctx.lineTo((WIDTH / 3) + (x / 3), (HEIGHT - barHeight) / 1.5);
				ctx.lineTo(x, HEIGHT - barHeight);
				ctx.lineTo(x + bridge, HEIGHT - dataArray[i + 1]);
				ctx.stroke();

				ctx.moveTo((WIDTH / 3) + ((x - bridge) / 3), (HEIGHT - dataArray[i - 1]) / 1.5);
				ctx.lineTo((WIDTH / 3) + (x / 3), (HEIGHT - barHeight) / 1.5);
				ctx.lineTo(x, HEIGHT - barHeight);
				ctx.lineTo(x - bridge, HEIGHT - dataArray[i - 1]);
				ctx.stroke();

				ctx.strokeStyle = "rgba(" + 128 + "," + 0 + "," + 128 + "," + barHeight / 1024 + ")";
				
				ctx.beginPath();
				ctx.moveTo((WIDTH / 3) + ((x + bridge) / 3), (HEIGHT) / 1.5);
				ctx.lineTo((WIDTH / 3) + (x / 3), (HEIGHT) / 1.5);
				ctx.lineTo(x, HEIGHT);
				ctx.lineTo(x + bridge, HEIGHT);
				ctx.stroke();
				//ctx.fill();
				x += bridge;
			}
		}

		audio.play();
		renderFrame();
	};
};