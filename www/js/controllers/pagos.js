angular.module('app')

  .controller('PagosCtrl', function ($scope, $state, $ionicAuth, $ionicUser, CONFIG) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    var usuario = $ionicUser.get('info');
    
    $scope.pago = {
      cvc     : '',
      numero  : '',
      mm      : '',
      yy      : ''
    };

    $scope.pagoProveedor = {
      cvc     : '',
      numero  : '',
      mm      : '',
      yy      : ''
    }

    $scope.doPago = function(){
      var pago = this.pago;

      Stripe.card.createToken({
        cvc       : pago.cvc,
        number    : pago.numero,
        exp_month : pago.mm,
        exp_year  : pago.yy,
      }, function(status, response){
        if (response.error) { // Problem!
          alert(response.error.message)
        } else { // Token was created!

          // Get the token ID:
          var token = response.id;

          console.log(token, response)
        }
      });
    }

    $scope.doPagoProveedor = function(){
      var pago = this.pagoProveedor;

      Stripe.card.createToken({
        cvc       : pago.cvc,
        number    : pago.numero,
        exp_month : pago.mm,
        exp_year  : pago.yy,
      }, function(status, response){
        if (response.error) { // Problem!
          alert(response.error.message)
        } else { // Token was created!

          // Get the token ID:
          var token = response.id;

          console.log(token, response)
        }
      });
    }

  });