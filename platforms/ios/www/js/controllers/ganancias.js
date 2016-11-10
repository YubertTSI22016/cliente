angular.module('app')

  .controller('GananciasCtrl', function ($scope, $state, $ionicAuth, $ionicUser, $ionicLoading, $ionicPopup, CONFIG, GananciasService) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    var usuario = $ionicUser.get('info');
    
    $scope.total = {
      total         : 0,
      totalComision : 0,
      totalGanancia : 0
    };
    
    var gananciaData = {
      idProveedor : usuario.proveedor.id
    }

    GananciasService.ganancias(gananciaData).then(function(data){
      var gananciaData = [];
      for(var i in data){
        var ganancia = data[i];

        var total     = ganancia.servicio.precio;
        var comision  = ganancia.servicio.precio * (ganancia.porcentageRetencion / 100);
        var ganancia  = total - comision;

        gananciaData.push({
          total     : total,
          comision  : comision,
          ganancia  : ganancia
        });

        $scope.total.total += total;
        $scope.total.totalComision += comision;
        $scope.total.totalGanancia += ganancia;
      }
      $scope.ganancias = gananciaData;
    });

    $scope.doCobrar = function(){
      if(!usuario.proveedor.tokenTarjeta){
        $ionicPopup.alert({
          title: 'Debe ingresar una tarjeta',
          template: 'Dirijase a la seccion de pago en el menu e ingrese una tarjeta.'
        });
        return;
      }

      $ionicLoading.show();
      GananciasService.cobrar(usuario.proveedor.id).then(function(data){
        $scope.ganancias            = [];
        $scope.total.total          = 0;
        $scope.total.totalComision  = 0;
        $scope.total.totalGanancia  = 0;

        $ionicLoading.hide();
      }, function(err) {
        alert(err.message);
        $ionicLoading.hide();
      });
    }

  });