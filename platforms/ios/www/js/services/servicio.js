angular.module('app')
  .service('ServicioService', ['$http', '$q' , 'CONFIG', servicioService]);

  function servicioService($http, $q, CONFIG) {
      var datos = [
        {
          id            : 1,
          nombre        : 'titulo 1',
          descripccion  : 'descripccion 1'
        }, {
          id            : 2,
          nombre        : 'titulo 2',
          descripccion  : 'descripccion 2'
        }, {
          id            : 3,
          nombre        : 'titulo 3',
          descripccion  : 'descripccion 3'
        }
      ];

      var getActivos = function(){
          var defer = $q.defer();

          defer.resolve(datos);

          // $http.get(CONFIG.URL + '/usuarios/')
          // .success(function (datos) {
          //     defer.resolve(datos);
          // })
          // .error(function(){
          //     defer.reject('server error')
          // });

          return defer.promise;
      };

      var getById = function(id){
          var defer = $q.defer();

          defer.resolve(datos[id]);

          // $http.get(CONFIG.URL + '/usuarios/')
          // .success(function (datos) {
          //     defer.resolve(datos);
          // })
          // .error(function(){
          //     defer.reject('server error')
          // });

          return defer.promise;
      };

      return {
          getActivos  : getActivos,
          getById     : getById
      }
  }
