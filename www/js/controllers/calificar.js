angular.module('app')

  .controller('CalificarCtrl', function ($scope, $state, $ionicLoading, $stateParams, PusherService, ProveedorService) {
    $ionicLoading.show();

    ProveedorService.getById($stateParams.id).then(function(proveedor){

      $scope.proveedor = proveedor;

      $ionicLoading.hide();

    });

    $scope.calificar = function (){
      var review = this.review;

      console.log(review)
    }

  });
