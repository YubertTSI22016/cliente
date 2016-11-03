angular.module('app')

  .controller('GananciasCtrl', function ($scope, $state, $ionicAuth, $ionicUser, CONFIG, GananciasService) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    var usuario = $ionicUser.get('info');

    // $scope.ganancias = [{
    //   total     : 100,
    //   comision  : 20,
    //   ganancia  : 80
    // }, {
    //   total     : 110,
    //   comision  : 21,
    //   ganancia  : 89
    // }, {
    //   total     : 100,
    //   comision  : 20,
    //   ganancia  : 80
    // }, {
    //   total     : 110,
    //   comision  : 21,
    //   ganancia  : 89
    // }, {
    //   total     : 100,
    //   comision  : 20,
    //   ganancia  : 80
    // }];
    
    $scope.total = {
      total         : 0,
      totalComision : 0,
      totalGanancia : 0
    };
    
    var gananciaData = {
      idProveedor : usuario.proveedor.id
    }

    GananciasService.ganancias(gananciaData).then(function(data){
      $scope.ganancias = data;
    });

    $scope.doCobrar = function(){
      alert('hacer el cobrar')
      
    }

  });