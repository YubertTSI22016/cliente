angular.module('app')

  .controller('PagosCtrl', function ($scope, $state, $ionicLoading, $stateParams, CONFIG) {
    // $ionicLoading.show();

    // ProveedorService.getById($stateParams.id).then(function(proveedor){

    //   $scope.proveedor = proveedor;

    //   $ionicLoading.hide();

    // });

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

  });