chrome.browserAction.setPopup({popup:''});

var config = { extensions: {} }

var loadConfig = function() {
    console.debug('Loading config...');
    
    chrome.storage.sync.get('config', function(data) {
	config = data.config || { extensions: {} };
    });
};

loadConfig();

chrome.browserAction.onClicked.addListener(function(tab) {
    // show active extensions for current page
    console.debug('chrome.browserAction.onClicked');
});

chrome.extension.onMessage.addListener( function(request, sender, sendResponse) {
	if (request.key == 'reload-config') {
	    loadConfig();	    
	    sendResponse({});
	} else {
	    chrome.browserAction.disable(sender.tab.id);
	    chrome.browserAction.setBadgeText({ text:'', tabId: sender.tab.id});
	    chrome.browserAction.setBadgeBackgroundColor({ color:'#fff', tabId: sender.tab.id } );
	    
	    var scripts = [];
	    var css = [];
	    
	    for (var key in config.extensions) {
		if (!config.extensions[key].enabled)
		    continue;
		
		var reg = new RegExp(config.extensions[key].matches[0]);
		if (!sender.url.match(reg)) 
		    continue;
		
		chrome.browserAction.enable(sender.tab.id);
		chrome.browserAction.setBadgeText({ text:'Actv', tabId: sender.tab.id});
		chrome.browserAction.setBadgeBackgroundColor({ color:'#000', tabId: sender.tab.id} )
		
		// get from localstorage and inject
		var extension = JSON.parse(localStorage.getItem(key) || null);
		if (!extension)
		    continue;
    
		for (i = 0; i< extension.resources.length; i++) {
		    console.debug(extension.resources[i].type);
		    if (extension.resources[i].type=='text/css') {
			css.push(localStorage[extension.resources[i].sha] || null);
		    } else if (extension.resources[i].type=='application/javascript') {
			scripts.push(localStorage[extension.resources[i].sha] || null);
		    }
		}
	    }
	    
	    sendResponse({ css: css, scripts: scripts});
	}
	
	return (true);
  });
  
