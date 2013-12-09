'use strict';

var app = angular.module('App', []);

app.config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);

app.controller('OptionsController', ['$rootScope', '$scope', '$location', '$log', function($rootScope, $scope, $location, $log) {
    $scope.extensions = [
		{ title: 'test', regex: 'http://bitcoinwisdom.com/.*', enabled: true },
		{ title: 'tert2', regex: 'https://twitter.com/.*', enabled: false }
	];
    
    $scope.toggle = function(extension) {
	extension.enabled = !extension.enabled;
    }

    $scope.uninstall = function(extension) {
	var index = $scope.extensions.indexOf(extension);
	$scope.extensions.splice( index, 1 );
    }
    
    $scope.install = function() {
	$scope.extensions.push({ title: "", regex: {}, enabled: false });
    }
}]);
