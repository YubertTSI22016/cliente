angular.module('app')

  .controller('CalificarCtrl', function ($scope, $state, $ionicLoading, $stateParams, $ionicAuth, $ionicUser, CONFIG, ServicioService) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    var usuario = $ionicUser.get('info');
    $scope.reviewData = {
      calificacion  : 0,
      comentario    : ''
      
    }
    $ionicLoading.show();

    $scope.configMapa = {};

    ServicioService.getById($stateParams.id).then(function(data){
      $scope.servicio   = data;
      if(data.rating){
        $scope.reviewData = {
          calificacion  : data.rating
        }
      }

      if (CONFIG.TIPO === 'transporte') {
        var puntosPath = '';
        if(data.puntosRecorrido){
          puntosPath = '&path=color:0xff0000ff|weight:2|';
          for(var i in data.puntosRecorrido){
            var punto = data.puntosRecorrido[i];

            puntosPath += punto;

            if(i < (data.puntosRecorrido.length - 1)){
              puntosPath += '|';
            }
          }
        }
        $scope.configMapa['zoom']       = '14';
        $scope.configMapa['puntosPath'] = puntosPath;
      } else {
        $scope.configMapa['zoom']       = '12';
        $scope.configMapa['puntosPath'] = '&markers=color:green|label:O|' + $scope.servicio.coordenadasOrigen + '&markers=color:green|label:D|' + $scope.servicio.coordenadasDestino;
      }
      
      $ionicLoading.hide();
    });

    $scope.doCalificar = function () {
      var review    = this.reviewData;
      var servicio  = this.servicio;

      review['idServicio'] = servicio.id;
      review['calificacion'] += '';

      ServicioService.calificar(review).then(function(data){
        $state.go('locations.usuario');
      }, function(err) {
        alert(err.message);
      });
    }
  });
