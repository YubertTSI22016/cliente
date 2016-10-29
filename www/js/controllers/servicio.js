angular.module('app')

  .controller('ServicioCtrl', function ($scope, $state, $ionicLoading, $stateParams, $ionicAuth, $ionicUser, ServicioService) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    var usuario   = $ionicUser.get('info');
    var proveedor = usuario.proveedor;

    $scope.usuarioServicios   = null;
    $scope.proveedorServicios = null;

    var id = $stateParams && $stateParams['id'] ? $stateParams['id'] : null;

    if(id){
      ServicioService.getById(id).then(function(data){
        $scope.servicio = data;
        $ionicLoading.hide();
      });
    }else{
      ServicioService.getServicios(usuario.id).then(function(data){
        $scope.usuarioServicios = data;
      });

      if(proveedor){
        ServicioService.getServicios(proveedor.id).then(function(data){
          $scope.proveedorServicios = data;
        });  
      }
    }

    $scope.finalizar = function(){
      var servicio = this.servicio;

      var servicioData = {
        idServicio : servicio.id,
        precio : '23'
      }

      ServicioService.finalizar(servicioData).then(function (response) {
        $state.go('locations.proveedor');
      }, function(err) {
        alert(err.message);
      });
    }

  });