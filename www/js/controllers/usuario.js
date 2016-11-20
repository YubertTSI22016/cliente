angular.module('app')

  .controller('UsuarioCtrl', function ($scope, CONFIG, $ionicAuth, $ionicUser, $ionicLoading, $state, $ionicSideMenuDelegate, $ionicPopup, uiGmapGoogleMapApi, uiGmapIsReady, PusherService, ServicioService, ProveedorService) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    PusherService.unbindAll();

    var usuario     = $ionicUser.get('info');
    $scope.markers  = [];
    $scope.data     = {
      comentario : ''
    };

    $scope.mapUsuarioConfig = {
      zoom        : 16,
      center : {
        latitude  : -34.9075945,
        longitude : -56.1457051
      },
      options     : {
        mapTypeControl    : false,
        streetViewControl : false,
        styles            : [{"featureType":"all","elementType":"labels","stylers":[{"lightness":63},{"hue":"#ff0000"}]},{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#000bff"},{"visibility":"on"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"color":"#4a4a4a"},{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"weight":"0.01"},{"color":"#727272"},{"visibility":"on"}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.province","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"administrative.province","elementType":"labels.text","stylers":[{"color":"#545454"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text","stylers":[{"color":"#7c7c7c"},{"weight":"0.01"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text","stylers":[{"color":"#404040"}]},{"featureType":"landscape","elementType":"all","stylers":[{"lightness":16},{"hue":"#ff001a"},{"saturation":-61}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"color":"#828282"},{"weight":"0.01"}]},{"featureType":"poi.government","elementType":"labels.text","stylers":[{"color":"#4c4c4c"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"hue":"#00ff91"}]},{"featureType":"poi.park","elementType":"labels.text","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"color":"#999999"},{"visibility":"on"},{"weight":"0.01"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"hue":"#ff0011"},{"lightness":53}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#626262"}]},{"featureType":"transit","elementType":"labels.text","stylers":[{"color":"#676767"},{"weight":"0.01"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#0055ff"}]}]
      }
    };

    var setCurrentLocation = function(pos){
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

      var image = {
        url         : 'img/1476577792_map-marker.png',
        size        : new google.maps.Size(71, 71),
        origin      : new google.maps.Point(0, 0),
        anchor      : new google.maps.Point(17, 34),
        scaledSize  : new google.maps.Size(35, 35)
      };

      var marker = _.find($scope.markers, ['id', 'usuario']);

      if (marker) {
        marker['coords'] = {
          latitude  : pos.coords.latitude,
          longitude : pos.coords.longitude
        };
      } else {
        $scope.markers.push({
          id          : 'usuario',
          title       : 'yo mismo',
          options     : { icon : image, draggable: true, animation: google.maps.Animation.DROP },
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

    $scope.cargarProveedores = function(){
      // ProveedorService.getActivos().then(function(collection) {
      //   $scope.proveedores = collection;
      //   var image = {
      //     url         : 'img/1476577917_Shop.png',
      //     size        : new google.maps.Size(71, 71),
      //     origin      : new google.maps.Point(0, 0),
      //     anchor      : new google.maps.Point(17, 34),
      //     scaledSize  : new google.maps.Size(35, 35)
      //   };

      //   angular.forEach(collection, function(proveedor) {
      //     $scope.markers.push({
      //       id          : proveedor.id,
      //       title       : proveedor.titulo,
      //       options     : { icon: image, animation: google.maps.Animation.DROP },
      //       coords      : {
      //         latitude  : proveedor.latitude,
      //         longitude : proveedor.longitude
      //       }
      //     });
      //   });
      // });
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

    var pedir = function (descripcion, ubicacion, destino) {
      PusherService.unbindAll();
      
      $ionicLoading.show();
      var data = { 
        idUsuario   : usuario.id, 
        ubicacion   : ubicacion['coords']['latitude'] + ',' +  ubicacion['coords']['longitude'],
        destino     : '',
        descripcion : descripcion
      };

      if(destino){
        data['destino'] = destino['coords']['latitude'] + ',' +  destino['coords']['longitude'];
      }

      ServicioService.pedir(data).then(function (response) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title     : 'Solicitud enviada',
          template  : 'Aguarde un momento, esperamos la respuesta de algun proveedor libre.',
          okText    : 'Cancelar',
          okType    : 'button-assertive'
        });

        PusherService.usuarioChannel.bind('solicitud-aceptada', 
          function(data) {
            alertPopup.close();
            var servicio = data.message;
            $state.go('locations.calificar', { id : servicio.id });
          }
        );

        PusherService.usuarioChannel.bind('solicitud-cancelada', 
          function(data) {
            $ionicPopup.alert({
              title: 'Su solicitud fue cancelada',
              template: 'Al no tener respuesta de ningun proveedor se cancelo su solicitud, vuelva a intentarlo mas tarde.'
            });
            alertPopup.close();
          }
        );

        alertPopup.then(function(res) {
          $ionicLoading.show();

          if(res){
            var servicioData = {
              idServicio : response.id,
            }

            ServicioService.cancelar(servicioData).then(function (response) {
              $scope.servicio = response;
              $ionicLoading.hide();
            }, function(err) {
              alert(err.message);
              $ionicLoading.hide();
            });  
          }else{
            $ionicLoading.hide();
          }
        }, function(err) {
          alert(err.message);
          $ionicLoading.hide();
        });
      }, function(err) {
        alert(err.message);
      });
    };

    $scope.solicitar = function(){
      if(!usuario.tokenTarjeta){
        $ionicPopup.alert({
          title: 'Debe ingresar una tarjeta',
          template: 'Dirijase a la seccion de pago en el menu e ingrese una tarjeta.'
        });
        return;
      }

      var ubicacion = _.find($scope.markers, ['id', 'usuario']);
      var destino   = _.find($scope.markers, ['id', 'destino']);

      if (!ubicacion) {
        return;
      }

      if(CONFIG.TIPO === 'transporte' && !destino){
        $ionicPopup.alert({
          title: 'Debe ingresar un destino',
          template: 'Utilize el buscador para ingresar el destino del servicio.'
        });
        return;
      }

      $ionicPopup.show({
        title     : 'Solicitando servicio',
        subTitle  : 'Ingrese un comentario',
        template  : '<textarea ng-model="data.comentario" style="height: 69px;"></textarea>',
        scope     : $scope,
        buttons   : [{
          text  : 'Cancelar',
          type  : 'button-light'
        }, {
          text  : '<b>Aceptar</b>',
          type  : 'button-energized',
          onTap : function(e) {
            pedir($scope.data.comentario, ubicacion, destino);
          }
        }]
      });
    };

    $scope.changeDestino = function(){
      var destino = this.destino;
      if(!destino.geometry){
        return;
      }
      var lat = destino.geometry.location.lat();
      var lng = destino.geometry.location.lng();
      $scope.map.setCenter(new google.maps.LatLng(lat, lng));

      var image = {
        url         : 'img/1478241457_location-24.png',
        size        : new google.maps.Size(71, 71),
        origin      : new google.maps.Point(0, 0),
        anchor      : new google.maps.Point(17, 34),
        scaledSize  : new google.maps.Size(35, 35)
      };

      var marker = _.find($scope.markers, ['id', 'destino']);

      if (marker) {
        marker['coords'] = {
          latitude  : lat,
          longitude : lng
        };
      } else {
        $scope.markers.push({
          id          : 'destino',
          title       : 'el otro',
          options     : { icon : image, draggable: true, animation: google.maps.Animation.DROP },
          coords      : {
            latitude  : lat,
            longitude : lng
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

    $scope.disableTap = function(){
      container = document.getElementsByClassName('pac-container');
      // disable ionic data tab
      angular.element(container).attr('data-tap-disabled', 'true');
      // leave input field if google-address-entry is selected
      angular.element(container).on('click', function(){
          document.getElementById('searchBox').blur();
      });
    };

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

      $scope.cargarProveedores();
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

      $scope.cargarProveedores();
    });

  });
