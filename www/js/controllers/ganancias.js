angular.module('app')

  .controller('GananciasCtrl', function ($scope, $state, $ionicAuth, $ionicUser, CONFIG) {
    if (!$ionicAuth.isAuthenticated()) {
      $state.go('welcome');
    }

    var usuario = $ionicUser.get('info');
    
    $scope.ganancias = [{
      total     : 100,
      comision  : 20,
      ganancia  : 80
    }, {
      total     : 110,
      comision  : 21,
      ganancia  : 89
    }, {
      total     : 100,
      comision  : 20,
      ganancia  : 80
    }, {
      total     : 110,
      comision  : 21,
      ganancia  : 89
    }, {
      total     : 100,
      comision  : 20,
      ganancia  : 80
    }];

    $scope.doCobrar = function(){
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

  });