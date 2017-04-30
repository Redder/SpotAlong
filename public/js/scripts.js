var spotAlong = angular.module('spotAlong', ['ngSanitize']);

spotAlong.controller('mainController', ['$log', '$http', '$scope', '$sce', function($log, $http, $scope, $sce){
  var mC = this;
  var socket = io();
  mC.text = "Whats up";

  socket.on('update', function(msg){
    console.log(msg);
    $scope.$apply(function () {
      mC.lyrics = $sce.trustAsHtml(msg.lyrics);
      mC.songTitle = msg.track.track_resource.name;
      mC.songArtist = msg.track.artist_resource.name;
      getAlbumPicture(msg.track.track_resource.uri.split(':')[2]);
    });

  });
  // Gets album pic from spotify api, cant use this in the future because token is visible, make this in the backened later
  var getAlbumPicture = (id) => {
    console.log(id);
    var token = "BQA9NRyT_uvOVhZvnewg5GfnMeQgcgoVBvVWdQkfSgHMCtvtHSJih4YIMwzF_LXEz-hmFPSSlJ0EuHxX1sP3VWKkSo1Nw-6T_wX3kVVdaqiQvwjZwrZI3z-J7-qpE7NTBKfgNw_a8ZMLPuQ";
    $http({
    method: 'GET',
    url: 'https://api.spotify.com/v1/tracks/' + id,
    headers: {
        'Authorization': 'Bearer ' + token
    }
    }).then(function successCallback(response) {
        console.log(response.data.album.images[1].url);
        mC.albumURL = response.data.album.images[1].url;
        mC.albumName = response.data.album.name;
    }, function errorCallback(response) {
        if(response.status = 401){ // If you have set 401
            $log.log("ohohoh")
        }
    });

  }

}]);
