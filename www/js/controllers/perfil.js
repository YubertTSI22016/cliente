angular.module('app')

  .controller('PerfilCtrl', function ($scope, $state, $ionicAuth, $ionicUser) {
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
      $state.go('locations.usuario');
    };

    $scope.goToProveedor = function(){
      $state.go('locations.proveedor');
    };

  });
