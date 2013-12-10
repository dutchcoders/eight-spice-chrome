// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
/*
var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
});
*/
chrome.browserAction.setPopup({popup:''});

// get config
var config = {}

// check reload
chrome.storage.sync.get('config', function(data) {
    config = data.config || { extensions: {} };
});

chrome.browserAction.onClicked.addListener(function(tab) {
    console.debug('chrome.browserAction.onClicked');
});

chrome.extension.onMessage.addListener( function(request, sender, sendResponse) {
 	var extensions = {
		'http://bitcoinwisdom.com/.*': {
		    title: 'test',
		    description: '',
		    author: '',
		    version: "0.0.1",
		    website: 'http:///',
  		    css: [
			"a.link_premium { display: none; } .gg160x600 { display: none; }"
		    ],
		    script: [
			"/* console.debug(document.readyState); $(document).ready(function() {$( window ).trigger('resize'); console.debug('remco'); }); */"
		    ]
		},
		'https://www.google.nl/.*': {
		    css: [
			".ads-container { display: none !important; }; "
		    ],
		    script: [
			
		    ]
		},
		'http://kickass.to/.*': {
		    css: [
			".advertising, .slotbox, .tabs { display: none !important; }; "
		    ],
		    script: [
			
		    ]
		},
		'http://www.(zie|nu).nl/.*': {
		    css: [
			"#pageheader { min-height: 30px !important;} .adblock_h, #adblock_v, .adblock_noborder { display: none !important; }"
		    ],
		    script: [
			/* remove ga.js and twitter */
		    ]
		},
		'https://btc-e.com/.*': {
		    css: [
			"#content div:first-child .block:first-child {display: none !important;} p.gray { font-weight: bold; }; "
		    ],
		    script: [
			/* remove ga.js and twitter */
		    ]
		}, 
		'https://twitter.com/.*': {
		    css: [
			"body { background-image: none !important; background-color: #fff !important; }; "
		    ],
		    script: [
			
		    ]
		}
	}
	
	chrome.browserAction.disable(sender.tab.id);
	chrome.browserAction.setBadgeText({ text:'', tabId: sender.tab.id});
	chrome.browserAction.setBadgeBackgroundColor({ color:'#FFF', tabId: sender.tab.id } );
	
	var scripts = [];
	var css = [];
	
	for (var key in config.extensions) {
	    var reg = new RegExp(config.extensions[key].matches[0]);
	    if (!sender.url.match(reg)) 
		    continue;
	    
	    chrome.browserAction.enable(sender.tab.id);
	    chrome.browserAction.setBadgeText({ text:'Actv', tabId: sender.tab.id});
	    chrome.browserAction.setBadgeBackgroundColor({ color:'#000', tabId: sender.tab.id} )
	    
	    // get from localstorage and inject
	    /*
	    if (config.extensions[key]['script']!=='undefined') {
		for (var i=0; i < config.extensions[key]['script'].length; i++)
		    scripts.push(config.extensions[key]['script'][i]);
	    }
	    
	    if (config.extensions[key]['css']!=='undefined') {
		for (var i=0; i < extensions[key]['css'].length; i++)
		    css.push(extensions[key]['css'][i]);
	    }*/
	}
	
	sendResponse({ css: css, scripts: scripts});
	
	return (true);
  });
  
  
  /*
   *chrome.storage.sync.get()
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'value': theValue}, function() {
    // Notify that we saved.
    message('Settings saved');
  });
  */
  /*
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.debug(request.method);
    
    chrome.storage.sync.get(null, function (items) {console.log(items)});

    if (request.method == "getStatus")
      sendResponse({status: localStorage['status']});
    else
      sendResponse({}); // snub them.
});
*/