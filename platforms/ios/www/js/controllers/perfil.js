angular.module('app')

  .controller('PerfilCtrl', function ($scope, $state, $ionicAuth, $ionicUser, $ionicModal) {
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

    console.log('info', $ionicUser)

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

    $scope.goToPagos = function(){
      $state.go('locations.pagos');
    };

    $scope.goToServicios = function(){
      $state.go('locations.servicios');
    };

    $scope.serProveedor = function() {
      $ionicModal.fromTemplateUrl('templates/locations/_ser-proveedor.html', {
        scope : $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.cerrarSerProveedor = function(){
      $scope.modal.hide();
    };

    $scope.doSerProveedor = function() {
      var username = $scope.registroData.username;
      var password = $scope.registroData.password;

      var details = { 'email' : username, 'password' : password };

      $ionicAuth.signup(details).then(function() {
        $scope.modal.hide();
      }, function(err) {
        alert(err.message);
      });
    };

  });
