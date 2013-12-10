// ==========================================================================
// Project:   	animated-octo-spice - Chrome Website Extender
// Copyright: 	Copyright 2011-2013 NL5887, Raz0rwire. and contributors
// License:   	Licensed under MIT license
// Home:	https://github.com/nl5887/animated-octo-spice/
// ==========================================================================

'use strict';

var app = angular.module('App', []);

app.config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);

app.controller('OptionsController', ['$rootScope', '$scope', '$http', '$location', '$log', function($rootScope, $scope, $http, $location, $log) {
	$scope.config = { extensions: {} };
	$scope.extensions = [];
	$scope.repositories = [];
	
	chrome.storage.sync.get('repositories', function(data) {
	    $scope.$apply(function() {
		$log.info(data);
		angular.forEach(data.repositories || [{title: 'Animated Octo Spice', url: 'https://api.github.com/repos/nl5887/animated-octo-spice-repository/contents/index.json'}], function(repository, index) {
			$log.info("loading repository " + repository.url);
			loadRepository(repository.url);
		});
	    });
	});

	var config = {
	    headers: {
		'Accept': 'application/vnd.github.v3.raw'
	    }
	};

    var loadRepository = function(url, callback) {
	$http.get(url, config).
		success(function(data, status) {
			var repository = { title:data.title, url: url};
			$scope.repositories.push(repository);
			angular.forEach(data.extensions || [], function(extension, index) {
				angular.extend(extension, { repository: repository});
				$scope.extensions.push(extension);
			});
			if (callback) {
				callback();
			}
		}).
		error(function(data, status) {
			$scope.data = data || "Request failed";
			$scope.status = status;
	});
    };
    
    var saveRepositories = function() {
	$log.info($scope.repositories);
	chrome.storage.sync.set({'repositories': $scope.repositories}, function() {
		alert('Repositories saved');
	});
    }
    
    $scope.addRepository = function() {
        if (!this.form.$valid)
                return;
	
	loadRepository(this.form.url.$modelValue, function() {
		saveRepositories();
	});
	
	this.form.url.$modelValue = '';
    };

    $scope.removeRepository = function(repository) {
        var index = $scope.repositories.indexOf(repository);
        $scope.repositories.splice( index, 1 );
	saveRepositories();
    }
    
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
		chrome.extension.sendMessage({key:'reload-config'},function(reponse){
			alert('Settings saved');
		});
	});
    }
    
    var reset = function() {
	chrome.storage.sync.set({'config': {extensions:{}}}, function() {
	  $log.info("reset");
	});
    }
    
    $scope.isInstalled = function(extension)
    {
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
			var o = angular.fromJson(localStorage.getItem(extension.url));
			
			var type = 'application/unknown';
			
			if (item.name.match('\.js$')) {
				type = 'application/javascript'
			} else if (item.name.match('\.css$')) {
				type = 'text/css'
			}
			
			var resource = {sha: item.sha, url: item.url, name: item.name, content: '', type: type};
			o.resources.push(resource);
			localStorage.setItem(extension.url, angular.toJson(o));
			$log.info(resource);
			$http.get(resource.url, config).
				success(function(data, status) {
				$log.info('downloaded' + resource.url );
				localStorage.setItem(resource.sha, data);
			});
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
