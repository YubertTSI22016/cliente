angular.module('app')

  .controller('UsuarioCtrl', function ($scope, $ionicAuth, $ionicUser, ProveedorService, $ionicLoading, $state, $ionicSideMenuDelegate, uiGmapGoogleMapApi, uiGmapIsReady, $ionicPopup, PusherService) {
    $scope.markers = [];

    PusherService.unbindAll();

    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    $scope.mapUsuarioConfig = {
      center : {
        latitude : -34.9075945,
        longitude : -56.1457051
      },
      zoom : 16,
      options : {
        mapTypeControl : false,
        streetViewControl : false,
        styles: [{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#f49935"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#fad959"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#a1cdfc"},{"saturation":30},{"lightness":49}]}]
      }
    };

    var setCurrentLocation = function(pos){
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

      var image = {
        url: 'img/1476577792_map-marker.png',
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
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
          options     : { icon : image, draggable: true, animation: google.maps.Animation.DROP },
          title       : 'yo mismo',
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
      ProveedorService.getActivos().then(function(collection) {
        $scope.proveedores = collection;
        var image = {
          url: 'img/1476577917_Shop.png',
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(35, 35)
        };

        angular.forEach(collection, function(proveedor) {
          $scope.markers.push({
            id          : proveedor.id,
            options     : { icon: image, animation: google.maps.Animation.DROP },
            title       : proveedor.titulo,
            coords      : {
              latitude  : proveedor.latitude,
              longitude : proveedor.longitude
            }
          });
        });
      });
    }

    $scope.centerOnMe = function () {
      if (!$scope.map) {
        return;
      }

      $ionicLoading.show({
        template : 'Buscando posicion...',
      });

      navigator.geolocation.getCurrentPosition(function (pos) {
        setCurrentLocation(pos);
        $ionicLoading.hide();
      }, function (error) {
        alert('centerOnMe Unable to get location: ' + error.message);
      });
    };

    $scope.solicitar = function () {
      var marker = _.find($scope.markers, ['id', 'usuario']);
      if (!marker) {
        return;
      }

      var alertPopup = $ionicPopup.alert({
        title     : 'Solicitud enviada',
        template  : 'Aguarde un momento, esperamos la respuesta de algun proveedor libre.',
        okText    : 'Cancelar',
        okType    : 'button-assertive'
      });

      var data = { usuario : $ionicUser, coords : marker['coords']};

      alertPopup.then(function(res) {
        console.log('cancelar servicio');
      });

      PusherService.usuarioChannel.bind('solicitud-aceptada',
        function(data) {
          alertPopup.close();
          $state.go('locations.calificar', { id : 1 });
        }
      );
    };

    uiGmapIsReady.promise(2).then(function(instances) {
      var map = instances[1].map;
      $scope.map = map;

      console.log('usuario', map.uiGmap_id)

      navigator.geolocation.getCurrentPosition(function (pos) {
        setCurrentLocation(pos);
      }, function (error) {
        alert('getCurrentPosition Unable to get location: ' + error);
      });

      $scope.cargarProveedores();
    });

  });
