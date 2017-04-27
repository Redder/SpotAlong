var spotAlong = angular.module('spotAlong', []);

spotAlong.controller('mainController', ['$log', '$http', function($log, $http){
  var mC = this;
  mC.text = "Whats up";
}]);
