angular.module('app')

  .controller('ProveedorCtrl', function ($scope, $ionicAuth, ProveedorService, $ionicLoading, $state, $ionicSideMenuDelegate, uiGmapGoogleMapApi, uiGmapIsReady, $ionicPopup, PusherService) {
    $scope.markers = [];

    PusherService.unbindAll();

    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    $scope.mapProveedorConfig = {
      center : {
        latitude : -34.9075945,
        longitude : -56.1457051
      },
      zoom : 16,
      options : {
        mapTypeControl : false,
        streetViewControl : false,
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#6195a0"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#e6f3d6"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#f4d2c5"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#f4f4f4"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#eaf6f8"}]}]
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

      var marker = _.find($scope.markers, ['id', 'proveedor']);

      if (marker) {
        marker['coords'] = {
          latitude  : pos.coords.latitude,
          longitude : pos.coords.longitude
        };
      } else {
        $scope.markers.push({
          id          : 'proveedor',
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

    var mostrarServicio = function(){
      $ionicPopup.show({
        template: 'Si desea tomar el servicio acepte el pedido',
        title: 'Usuario solicitando un servicio',
        buttons: [
          {
            text  : 'Cancelar',
            type  : 'button-light',
            onTap : function(e) {
              console.log('cancelar')
            }
          },
          {
            text  : '<b>Aceptar</b>',
            type  : 'button-energized',
            onTap : function(e) {
              $state.go('locations.servicio', { id : 1 });
            }
          }
        ]
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

    $scope.comenzar = function(){
      $scope.activo = true;
    }

    $scope.finalizar = function(){
      $scope.activo = false;
    }

    PusherService.proveedoresChannel.bind('solicitud-recibida',
      function(data) {
        if ($scope.activo) {
          mostrarServicio();
        }
      }
    );

    uiGmapIsReady.promise(3).then(function(instances) {
      var map = instances[2].map;
      $scope.map = map;

      console.log('proveedor', map.uiGmap_id)

      navigator.geolocation.getCurrentPosition(function (pos) {
        setCurrentLocation(pos);
      }, function (error) {
        alert('getCurrentPosition Unable to get location: ' + error);
      });
    });

  });
