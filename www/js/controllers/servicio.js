angular.module('app')

  .controller('ServicioCtrl', function ($scope, $state, $ionicLoading, $stateParams, $ionicAuth, $ionicUser, ServicioService) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    var usuario   = $ionicUser.get('info');
    var proveedor = usuario.proveedor;

    $scope.usuarioServicios   = null;
    $scope.proveedorServicios = null;

    $scope.reviewData = {
      calificacion : 0
    }

    var id = $stateParams && $stateParams['id'] ? $stateParams['id'] : null;

    if(id){
      ServicioService.getById(id).then(function(data){
        $scope.servicio = data;
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

    $scope.iniciar = function(){
      $ionicLoading.show();
      var servicio = this.servicio;

      var servicioData = {
        idServicio : servicio.id,
      }

      ServicioService.iniciar(servicioData).then(function (response) {
        $scope.servicio = response;
        $ionicLoading.hide();
      }, function(err) {
        alert(err.message);
        $ionicLoading.hide();
      });
    }

    $scope.finalizar = function(){
      $ionicLoading.show();
      var servicio  = this.servicio;
      var review    = this.reviewData;

      var servicioData = {
        idServicio : servicio.id,
        precio : '20',
        calificacionUsuario: review.calificacion + ''
      }

      ServicioService.finalizar(servicioData).then(function (response) {
        $state.go('locations.proveedor');
        $ionicLoading.hide();
      }, function(err) {
        alert(err.message);
        $ionicLoading.hide();
      });
    }

  });