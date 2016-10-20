angular.module('app.map')

  .controller('MapDetailCtrl', function ($scope, ProveedorService, $stateParams, $ionicLoading) {

    $ionicLoading.show();

    ProveedorService.getById($stateParams.id).then(function(proveedor){

      $scope.proveedor = proveedor;

      $ionicLoading.hide();

    });

    $scope.addMedia = function(){
      alert("add media");
    };

    $scope.downloadReport = function(){
      alert("generate and download report");
    };

  });
