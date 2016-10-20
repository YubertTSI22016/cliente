angular.module('app')

  .controller('PerfilCtrl', function ($scope, $state, $ionicAuth, $ionicUser) {
    if ($state.is('locations.usuario')) {
      $scope.modo = 'usuario';
    } else if ($state.is('locations.proveedor')) {
      $scope.modo = 'proveedor';
    }

    if ($ionicUser.social.facebook) {
      $scope.usuario = {
        name  : $ionicUser.social.facebook.data.full_name,
        image : $ionicUser.social.facebook.data.profile_picture
      }
    } else {
      $scope.usuario = {
        name  : $ionicUser.details.name || $ionicUser.details.email,
        image : $ionicUser.details.image
      }
    }

    $scope.logout = function() {
      $ionicAuth.logout();
      $state.go('welcome');
    };

    $scope.goToUsuario = function(){
      $scope.modo = 'usuario';
      $state.go('locations.usuario');
    };

    $scope.goToProveedor = function(){
      $scope.modo = 'proveedor';
      $state.go('locations.proveedor');
    };

  });
