angular.module('app')

  .controller('ServicioCtrl', function ($scope, $state, $ionicLoading, $stateParams, PusherService, ProveedorService) {
    $ionicLoading.show();

    ProveedorService.getById($stateParams.id).then(function(proveedor){

      $scope.proveedor = proveedor;

      $ionicLoading.hide();

    });

    $scope.finalizar = function(){
      $state.go('locations.proveedor');
    }

  });
