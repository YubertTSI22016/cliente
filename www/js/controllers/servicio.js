angular.module('app')

  .controller('ServicioCtrl', function ($scope, $state, $ionicLoading, $stateParams, $ionicAuth, $ionicUser, $timeout, $ionicPopup, CONFIG, ServicioService) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    var usuario   = $ionicUser.get('info');
    var proveedor = usuario.proveedor;

    $scope.usuarioServicios   = null;
    $scope.proveedorServicios = null;
    $scope.enviar             = true;

    $scope.configMapa = {};

    $scope.reviewData = {
      calificacion : 0
    }

    var id = $stateParams && $stateParams['id'] ? $stateParams['id'] : null;

    if(id){
      ServicioService.getById(id).then(function(data){
        $scope.servicio = data;

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

        var alertPopup = $ionicPopup.alert({
          title     : 'Servicio en curso',
          template  : 'El servicio esta en marcha, cuando termine presione el boton.',
          okText    : 'Terminar y Calificar',
          okType    : 'button-assertive'
        });

        if (CONFIG.TIPO === 'transporte') {
          var enviarPosicion = function() {
            navigator.geolocation.getCurrentPosition(function (pos) {
              var puntoData = {
                idServicio  : response.id,
                punto       : pos.coords.latitude + ',' + pos.coords.longitude
              }
              ServicioService.enviarPosicion(puntoData);

              if($scope.enviar){
                $timeout(enviarPosicion, 5000);
              }
            });
          };
          $timeout(enviarPosicion, 5000);
        }

        alertPopup.then(function(res) {
          $scope.enviar = false;
        });

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
        idServicio          : servicio.id,
        calificacionUsuario : review.calificacion + ''
      }

      if (CONFIG.TIPO === 'transporte') {
        ServicioService.getPuntosServicio(servicio.id).then(function (response) {
          var route = [];
          for(var i in response){
            var item = response[i].split(',');
            route.push(new google.maps.LatLng(item[0], item[1]))
          }
          var distance = google.maps.geometry.spherical.computeLength(route);

          servicioData['distanciaTotal'] = parseFloat(distance / 1000) + '';

          ServicioService.finalizar(servicioData).then(function (response) {
            $ionicLoading.hide();
            $state.go('locations.servicios');
          }, function(err) {
            alert(err.message);
            $ionicLoading.hide();
          });
        }, function(err) {
          alert(err.message);
          $ionicLoading.hide();
        });
      } else {
        ServicioService.finalizar(servicioData).then(function (response) {
          $ionicLoading.hide();
          $state.go('locations.servicios');
        }, function(err) {
          alert(err.message);
          $ionicLoading.hide();
        });
      }
    }

  });