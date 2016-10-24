angular.module('app')

  .controller('ServicioCtrl', function ($scope, $state, $ionicLoading, $stateParams, ServicioService) {
    $ionicLoading.show();

    var id = $stateParams && $stateParams['id'] ? $stateParams['id'] : null;

    console.log(id);

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

  });