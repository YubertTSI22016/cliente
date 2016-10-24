angular.module('app')

  .controller('PagosCtrl', function ($scope, $state, $ionicLoading, $stateParams) {
    // $ionicLoading.show();

    // ProveedorService.getById($stateParams.id).then(function(proveedor){

    //   $scope.proveedor = proveedor;

    //   $ionicLoading.hide();

    // });

    $scope.finalizar = function(){
      $state.go('locations.proveedor');
    }

  });
