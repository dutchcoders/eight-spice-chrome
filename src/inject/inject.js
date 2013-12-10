function loadScript(url, callback) {
	var script = document.createElement("script")
	script.type = "text/javascript";

	if (script.readyState) { //IE
		script.onreadystatechange = function () {
			if (script.readyState == "loaded" || script.readyState == "complete") {
				script.onreadystatechange = null;
				var j = jQuery.noConflict();
				callback(j);
			}
		};
	} else { //Others
		script.onload = function () {
			var j = jQuery.noConflict();
			callback(j);
		};
	}

	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

chrome.extension.sendMessage({}, function(response) {
	console.debug('received;');
	console.debug(response);
	
	for (var index = 0; index < response.css.length; index++) {
		var style = document.createElement("style")
		console.debug(response.css[index]);
		style.appendChild(document.createTextNode(response.css[index]));
		document.head.appendChild(style);
		console.debug('injected css;');
	}
	
	for (var index = 0; index < response.scripts.length; index++) {
		var script = document.createElement("script")
		script.type = "text/javascript";
		script.text = response.scripts[index];
		document.body.appendChild(script);
		console.debug('injected script;');
	}
	
	
	/*
	loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function ($) {
		console.debug('test');
	});
	*/
	
	/*
	var readyStateCheckInterval = setInterval(function() {
		try {
			for (index = 0; index < response.scripts.length; ++index) {
				var script = response.scripts[index];
				eval(script);
			}
		} catch (err) {
			console.log(err);
		}
		
		if (document.readyState === "interactive") {
		} else if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
		}
		
	}, 10);*/
});