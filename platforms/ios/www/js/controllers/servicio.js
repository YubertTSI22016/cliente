angular.module('app')

  .controller('ServicioCtrl', function ($scope, $state, $ionicLoading, $stateParams, $ionicAuth, $ionicUser, ServicioService) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    var usuario = $ionicUser.get('info');

    $ionicLoading.show();

    var id = $stateParams && $stateParams['id'] ? $stateParams['id'] : null;

    if(id){
      ServicioService.getById(id).then(function(data){
        $scope.servicio = data;
        $ionicLoading.hide();
      });
    }else{
      ServicioService.getActivos().then(function(data){
        $scope.servicios = data;
        $ionicLoading.hide();
      });
    }

    $scope.finalizar = function(){
      $servicio = this.servicio;

      ServicioService.finalizar(servicio).then(function (response) {
        $state.go('locations.proveedor');
      }, function(err) {
        alert(err.message);
      });
    }

  });