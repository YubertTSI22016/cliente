angular.module('app')

  .controller('CalificarCtrl', function ($scope, $state, $ionicLoading, $stateParams, $ionicAuth, $ionicUser, ServicioService) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    var usuario = $ionicUser.get('info');
    $scope.reviewData = {
      calificacion : '50'
    }
    $ionicLoading.show();

    ServicioService.getById($stateParams.id).then(function(data){
      $scope.servicio = data;
      $ionicLoading.hide();
    });

    $scope.doCalificar = function () {
      var review    = this.reviewData;
      var servicio  = this.servicio;

      review['idServicio'] = servicio.id;

      ServicioService.calificar(review).then(function(data){
        $state.go('locations.usuario');
      }, function(err) {
        alert(err.message);
      });
    }
  });
