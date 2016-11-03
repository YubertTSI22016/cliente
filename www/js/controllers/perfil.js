angular.module('app')

  .controller('PerfilCtrl', function ($scope, $state, $ionicAuth, $ionicUser, $ionicModal, UsuarioService, ProveedorService) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }
    
    $scope.usuario = $ionicUser.get('info');
    if ($ionicUser.social.facebook) {
      $scope.usuario['imagen'] = $ionicUser.social.facebook.data.profile_picture;
    } else {
      $scope.usuario['imagen'] = $ionicUser.details.image;
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

    $scope.goToPagos = function(){
      $state.go('locations.pagos');
    };

    $scope.goToServicios = function(){
      $state.go('locations.servicios');
    };

    $scope.goToGanancias = function(){
      $state.go('locations.ganancias');
    };

    $scope.cerrarModal = function(){
      $scope.modal.hide();
    };

    $scope.serProveedor = function() {
      $ionicModal.fromTemplateUrl('templates/locations/_ser-proveedor.html', {
        scope : $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.doSerProveedor = function() {
      var proveedorData = this.proveedorData;
      var usuario       = this.usuario;

      proveedorData['usuario'] = {
        id : usuario.id
      }

      ProveedorService.add(proveedorData).then(function (proveedor) {
        usuario['proveedor'] = proveedor;
        $ionicUser.set('info', usuario);
        $ionicUser.save();

        $scope.modal.hide();
      }, function(err) {
        alert(err.message);
      });
    };

    $scope.perfil = function() {
      $ionicModal.fromTemplateUrl('templates/locations/_perfil.html', {
        scope : $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.doPerfil = function() {
      var usuarioData = angular.copy(this.usuario);

      delete usuarioData['imagen'];
      delete usuarioData['clave'];

      UsuarioService.edit(usuarioData).then(function (usuario) {
        $ionicUser.set('info', usuario);
        $ionicUser.save();

        $scope.modal.hide();
      }, function(err) {
        alert(err.message);
      });
    };

  });
