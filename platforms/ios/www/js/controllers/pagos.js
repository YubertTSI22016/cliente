angular.module('app')

  .controller('PagosCtrl', function ($scope, $state, $ionicAuth, $ionicUser, $ionicLoading, CONFIG, PagosService) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    var usuario = $ionicUser.get('info');
    $scope.usuario = usuario;
    
    $scope.pago = {
      cvc     : '',
      mm      : '',
      yy      : '',
      numero  : ''
    };

    $scope.pagoProveedor = {
      cvc     : '',
      mm      : '',
      yy      : '',
      numero  : ''
    }

    $scope.doPago = function(){
      var pago = this.pago;
      $ionicLoading.show();

      Stripe.card.createToken({
        cvc       : pago.cvc,
        number    : pago.numero,
        currency  : 'usd',
        exp_month : pago.mm,
        exp_year  : pago.yy,
      }, function(status, response){
        if (response.error) { // Problem!
          alert(response.error.message);
          $ionicLoading.hide();
        } else { // Token was created!
          // Get the token ID:
          var token = response.id;
          var card  = response.card.last4;

          var tokenData = {
            token                 : token,
            idUsuario             : usuario.id,
            ultimosDigitosTarjeta : card
          }

          PagosService.addUsuario(tokenData).then(function (response) {
            usuario['tokenTarjeta']           = token;
            usuario['ultimosNumerosTarjeta']  = card;
            
            $ionicUser.set('info', usuario);
            $ionicUser.save();

            $ionicLoading.hide();
          }, function(err) {
            alert(err.message);
            $ionicLoading.hide();
          });
        }
      });
    }

    $scope.doPagoProveedor = function(){
      var pago = this.pagoProveedor;
      $ionicLoading.show();

      Stripe.card.createToken({
        cvc       : pago.cvc,
        number    : pago.numero,
        currency  : 'usd',
        exp_month : pago.mm,
        exp_year  : pago.yy,
      }, function(status, response){
        if (response.error) { // Problem!
          alert(response.error.message);
          $ionicLoading.hide();
        } else { // Token was created!
          // Get the token ID:
          var token = response.id;
          var card  = response.card.last4;

          var tokenData = {
            token                 : token,
            idProveedor           : usuario.proveedor.id,
            ultimosDigitosTarjeta : card
          }

          PagosService.addProveedor(tokenData).then(function (response) {
            usuario.proveedor['tokenTarjeta']           = token;
            usuario.proveedor['ultimosNumerosTarjeta']  = card;
            $ionicUser.set('info', usuario);
            $ionicUser.save();

            $ionicLoading.hide();
          }, function(err) {
            alert(err.message);
            $ionicLoading.hide();
          });
        }
      });
    }

  });