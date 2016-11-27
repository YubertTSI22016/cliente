angular.module('app')

  .controller('ProveedorCtrl', function ($scope, $ionicAuth, $ionicUser, $ionicLoading, $state, $ionicSideMenuDelegate, uiGmapGoogleMapApi, uiGmapIsReady, $ionicPopup, PusherService, ProveedorService, ServicioService) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    PusherService.unbindAll();

    var usuario     = $ionicUser.get('info');
    var proveedor   = usuario.proveedor;
    $scope.markers  = [];

    $scope.mapProveedorConfig = {
      zoom    : 16,
      center  : {
        latitude  : -34.9075945,
        longitude : -56.1457051
      },
      options : {
        mapTypeControl    : false,
        streetViewControl : false,
        styles            : [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#6195a0"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#e6f3d6"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#f4d2c5"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#f4f4f4"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#eaf6f8"}]}]
      }
    };

    ProveedorService.getById(proveedor.id).then(function (proveedor) {
      usuario['proveedor'] = proveedor;
      $ionicUser.set('info', usuario);
      $ionicUser.save();

      var jornadaActual = proveedor.jornadaActual;
      if(jornadaActual && jornadaActual.inicio && !jornadaActual.fin){
        $scope.activo = true;

        PusherService.proveedoresChannel.bind('solicitud-recibida',
          function(data) {
            mostrarServicio(data.message);
          }
        );
      }
    }, function(err) {
      alert(err.message);
    });

    var setCurrentLocation = function(pos){
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

      var image = {
        url         : 'img/1476577792_map-marker.png',
        size        : new google.maps.Size(71, 71),
        origin      : new google.maps.Point(0, 0),
        anchor      : new google.maps.Point(17, 34),
        scaledSize  : new google.maps.Size(35, 35)
      };

      var marker = _.find($scope.markers, ['id', 'proveedor']);

      if (marker) {
        marker['coords'] = {
          latitude  : pos.coords.latitude,
          longitude : pos.coords.longitude
        };
      } else {
        $scope.markers.push({
          id          : 'proveedor',
          title       : 'yo mismo',
          options     : { icon : image, animation : google.maps.Animation.DROP },
          coords      : {
            latitude  : pos.coords.latitude,
            longitude : pos.coords.longitude
          },
          events      : {
            dragend : function (marker, eventName, args) {
              var lat = marker.getPosition().lat();
              var lon = marker.getPosition().lng();

              $scope.map.setCenter(new google.maps.LatLng(lat, lon));
            }
          }
        });
      }
    };

    var mostrarServicio = function(servicio){
      var cords = servicio.coordenadasOrigen.split(',');

      $scope.map.setCenter(new google.maps.LatLng(cords[0], cords[1]));
      $scope.map.setZoom(12);

      var image = {
        url         : 'img/1478241457_location-24.png',
        size        : new google.maps.Size(71, 71),
        origin      : new google.maps.Point(0, 0),
        anchor      : new google.maps.Point(17, 34),
        scaledSize  : new google.maps.Size(35, 35)
      };

      var marker = _.find($scope.markers, ['id', 'servicio']);

      if (marker) {
        marker['coords'] = {
          latitude  : cords[0],
          longitude : cords[1]
        };
      } else {
        $scope.markers.push({
          id          : 'servicio',
          title       : 'servicio',
          options     : { icon : image, animation : google.maps.Animation.DROP },
          coords      : {
            latitude  : cords[0],
            longitude : cords[1]
          }
        });
      }

      var alertPopup = $ionicPopup.show({
        title     : 'Usuario solicitando un servicio',
        subTitle  : 'Si desea tomar el servicio acepte el pedido',
        template  : servicio.descripcion,
        cssClass  : 'proveedor-popup',
        buttons   : [{
          text  : 'Cancelar',
          type  : 'button-light',
          onTap : function(e) {
            var marker = _.find($scope.markers, ['id', 'servicio']);
            var index = $scope.markers.indexOf(marker);

            $scope.markers.splice(index, 1);
          }
        }, {
          text  : '<b>Aceptar</b>',
          type  : 'button-energized',
          onTap : function(e) {
            $ionicLoading.show();

            var servicioData = {
              idServicio  : servicio.id,
              idProveedor : proveedor.id 
            }

            ServicioService.ofrecer(servicioData).then(function (response) {
              $ionicLoading.hide();
              $state.go('locations.serviciodetalle', { id : response.id });
            }, function(err) {
              alert(err.message);
              $ionicLoading.hide();
            });
          }
        }]
      });

      PusherService.proveedoresChannel.bind('solicitud-cancelada', 
        function(data) {
          if(data.message.id == servicio.id){
            var marker = _.find($scope.markers, ['id', 'servicio']);
            var index = $scope.markers.indexOf(marker);

            $scope.markers.splice(index, 1);
            alertPopup.close();
          }
        }
      );
    }

    $scope.centerOnMe = function () {
      if (!$scope.map) {
        return;
      }

      $ionicLoading.show({ template : 'Buscando posicion...' });

      navigator.geolocation.getCurrentPosition(function (pos) {
        setCurrentLocation(pos);
        $ionicLoading.hide();
      }, function (error) {
        alert('centerOnMe Unable to get location: ' + error.message);
      });
    };

    $scope.comenzar = function(){
      ProveedorService.inicioJornada({ idProveedor : proveedor.id }).then(function (response) {
        $scope.activo = true;
        PusherService.proveedoresChannel.bind('solicitud-recibida',
          function(data) {
            mostrarServicio(data.message);
          }
        );
      }, function(err) {
        alert(err.message);
      });
    }

    $scope.finalizar = function(){
      ProveedorService.finJornada({ idProveedor : proveedor.id }).then(function (response) {
        $scope.activo = false;
        PusherService.unbindAll();
      }, function(err) {
        alert(err.message);
      });
    }

    uiGmapIsReady.promise(1).then(function(instances) {
      if($scope.map){
        return
      }

      var map = instances[0].map;
      $scope.map = map;

      navigator.geolocation.getCurrentPosition(function (pos) {
        setCurrentLocation(pos);
      }, function (error) {
        alert('getCurrentPosition Unable to get location: ' + error);
      });
    });

    uiGmapIsReady.promise(2).then(function(instances) {
      if($scope.map){
        return
      }

      var map = instances[1].map;
      $scope.map = map;

      navigator.geolocation.getCurrentPosition(function (pos) {
        setCurrentLocation(pos);
      }, function (error) {
        alert('getCurrentPosition Unable to get location: ' + error);
      });
    });

  });
