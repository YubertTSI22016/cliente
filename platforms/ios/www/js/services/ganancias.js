angular.module('app')
  .service('GananciasService', ['$http', '$q' , 'CONFIG', gananciasService]);

  function gananciasService($http, $q, CONFIG) {

      var ganancias = function(usuario){
          var defer = $q.defer();

          $http.post(CONFIG.URL + 'vertical/listarpagospendientes/1/999999', usuario)
          .success(function (enc) {
              defer.resolve(enc);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      var cobrar = function(usuario){
          var defer = $q.defer();

          $http.get(CONFIG.URL + 'vertical/pagoaproveedor/' + usuario)
          .success(function (enc) {
              defer.resolve(enc);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      return {
          cobrar    : cobrar,
          ganancias : ganancias,
      }
  }
