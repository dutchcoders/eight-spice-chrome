'use strict';

var app = angular.module('App', []);

app.config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);

app.controller('OptionsController', ['$rootScope', '$scope', '$http', '$location', '$log', function($rootScope, $scope, $http, $location, $log) {
    $scope.config = { extensions: {} };
    $scope.repository = [];
    
    var config = {
	headers: {
            'Accept': 'application/vnd.github.v3.raw'
        }
    };

    $http.get('https://api.github.com/repos/nl5887/animated-octo-spice-repository/contents/index.json?ref=master', config).
      success(function(data, status) {
	// cache repos?
	$scope.repository = data;
      }).
      error(function(data, status) {
        $scope.data = data || "Request failed";
        $scope.status = status;
    });
    
    $scope.toggle = function(extension) {
	$scope.config.extensions[extension.url].enabled = !$scope.config.extensions[extension.url].enabled;
	save();
    }

    $scope.uninstall = function(extension) {
	delete ($scope.config.extensions[extension.url]);
	save();
    }
    
    var load = function() {
	chrome.storage.sync.get('config', function(data) {
	    $scope.$apply(function() {
	      $scope.config = data.config || { extensions: {} };
	    });
	});
    }();
    
    var save = function() {
	chrome.storage.sync.set({'config': $scope.config}, function() {
	  alert('Settings saved');
	});
    }
    
    var reset = function() {
	chrome.storage.sync.set({'config': {extensions:{}}}, function() {
	  $log.info("reset");
	});
    }
    
    $scope.isInstalled = function(extension)
    {
	$log.info($scope.config.extensions[extension.url]);
	return ($scope.config.extensions[extension.url]!==undefined);	
    }
    
    $scope.isEnabled = function(extension)
    {
	if ($scope.config.extensions[extension.url]===undefined) {
		return (false);
	}
	return ($scope.config.extensions[extension.url].enabled);	
    }
    
    $scope.install = function(extension) {
	// config extension + status?
	// extension.url -> unique id
	$log.info($scope.config);
	$scope.config.extensions[extension.url] = {'enabled': true, 'matches': extension.matches };
	
	$http.get(extension.url, config).
		success(function(data, status) {
		  localStorage.setItem(extension.url, angular.toJson({
			title: extension.title,
			description: extension.description,
			matches: extension.matches,
			resources: []
		  }));
		  
		  $(data).each(function(index, item) {
			var item = angular.fromJson(localStorage.getItem(extension.url));
			item.resources.push({sha: item.sha, url: item.url, name: item.name, content: ''})
			localStorage.setItem(extension.url, angular.toJson(item));
		  });
		}).
		error(function(data, status) {
		  $scope.data = data || "Request failed";
		  $scope.status = status;
	      });
		
	save();

	/*
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
	*/
    }
}]);
