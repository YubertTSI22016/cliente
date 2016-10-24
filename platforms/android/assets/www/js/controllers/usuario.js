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
        styles: [{"featureType":"all","elementType":"labels","stylers":[{"lightness":63},{"hue":"#ff0000"}]},{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#000bff"},{"visibility":"on"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"color":"#4a4a4a"},{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"weight":"0.01"},{"color":"#727272"},{"visibility":"on"}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.province","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"administrative.province","elementType":"labels.text","stylers":[{"color":"#545454"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text","stylers":[{"color":"#7c7c7c"},{"weight":"0.01"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text","stylers":[{"color":"#404040"}]},{"featureType":"landscape","elementType":"all","stylers":[{"lightness":16},{"hue":"#ff001a"},{"saturation":-61}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"color":"#828282"},{"weight":"0.01"}]},{"featureType":"poi.government","elementType":"labels.text","stylers":[{"color":"#4c4c4c"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"hue":"#00ff91"}]},{"featureType":"poi.park","elementType":"labels.text","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"color":"#999999"},{"visibility":"on"},{"weight":"0.01"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"hue":"#ff0011"},{"lightness":53}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#626262"}]},{"featureType":"transit","elementType":"labels.text","stylers":[{"color":"#676767"},{"weight":"0.01"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#0055ff"}]}]
      }
    };

    navigator.geolocation.getCurrentPosition(
    function(position) {
         alert("Lat: " + position.coords.latitude + "\nLon: " + position.coords.longitude);
    },
    function(error){
         alert(error.message);
         alert('aaaa')
    }, {
         enableHighAccuracy: true
              ,timeout : 5000
    }
);

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
