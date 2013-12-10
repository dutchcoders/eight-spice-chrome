'use strict';

var app = angular.module('App', []);

app.config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);

app.controller('OptionsController', ['$rootScope', '$scope', '$location', '$log', function($rootScope, $scope, $location, $log) {
    $scope.extensions = [];
    
    /*
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
	    "/* console.debug(document.readyState); $(document).ready(function() {$( window ).trigger('resize'); console.debug('remco'); }); *"
	]
    }
    */
    
    $scope.toggle = function(extension) {
	extension.enabled = !extension.enabled;
	save();
    }

    $scope.uninstall = function(extension) {
	var index = $scope.extensions.indexOf(extension);
	$scope.extensions.splice( index, 1 );
	save();
    }
    
    var load = function() {
	chrome.storage.sync.get('extensions', function(data) {
	    $scope.$apply(function() {
	      $scope.extensions = data.extensions;
	    });
	});
    }();
    
    var save = function() {
	chrome.storage.sync.set({'extensions': $scope.extensions}, function() {
	  alert('Settings saved');
	});
    }
    
    var reset = function() {
	chrome.storage.sync.set({'extensions': null}, function() {
	  $log.info("reset");
	});
    }
    
    $scope.install = function() {
	if (!this.form.$valid)
		return;
    
	// download manifest
	var data = {
		guid: '013e2b34-58ed-4f64-acee-458c000cfacd',
		url: 'http://github.com/nl5887/remco/remco', // also unique identifier
		title: 'Bitcoinwisdom remove ads',
		category: 'ads',
		tags: [''],
		description: '',
		regex: 'http://bitcoinwisdom.com/.*',
		author: '',
		version: "0.0.1",
		website: 'http:///',
		css: [
		    "a.link_premium { display: none; } .gg160x600 { display: none; }"
		],
		script: [
		    "/* console.debug(document.readyState); $(document).ready(function() {$( window ).trigger('resize'); console.debug('remco'); }); *"
		]
	}
	
	// how to update / overwrite? unique identifier?
	$scope.extensions.push({ enabled: true, extension: data});
	
	save();
    }
}]);
