angular.module('app')
  .service('ProveedorService', ['$http', '$q' , 'CONFIG', proveedorService]);

  function proveedorService($http, $q, CONFIG) {
      var datos = [
        {
          id        : 1,
          titulo    : 'titulo 1',
          latitude  : -34.90687133532752,
          longitude : -56.14455244337768
        }, {
          id        : 2,
          titulo    : 'titulo 2',
          latitude  : -34.908085524702734,
          longitude : -56.14354393278808
        }, {
          id        : 3,
          titulo    : 'titulo 3',
          latitude  : -34.91091856341917,
          longitude : -56.14526054655761
        }, {
          id        : 4,
          titulo    : 'titulo 4',
          latitude  : -34.91112971766969,
          longitude : -56.14753505980224
        }, {
          id        : 5,
          titulo    : 'titulo 5',
          latitude  : -34.908173508742394,
          longitude : -56.15045330321044
        }, {
          id        : 6,
          titulo    : 'titulo 6',
          latitude  : -34.90639621285841,
          longitude : -56.149316046588126
        }, {
          id        : 7,
          titulo    : 'titulo 7',
          latitude  : -34.912449419431056,
          longitude : -56.1480500439331
        }, {
          id        : 8,
          titulo    : 'titulo 8',
          latitude  : -34.91331161312405,
          longitude : -56.15002414976806
        }, {
          id        : 9,
          titulo    : 'titulo 9',
          latitude  : -34.91155202454143,
          longitude : -56.16392872130126
        }, {
          id        : 10,
          titulo    : 'titulo 10',
          latitude  : -34.91788636692896,
          longitude : -56.16221210753173
        }, {
          id        : 11,
          titulo    : 'titulo 11',
          latitude  : -34.91901242106829,
          longitude : -56.166074488513175
        }, {
          id        : 12,
          titulo    : 'titulo 12',
          latitude  : -34.91535268863003,
          longitude : -56.1659886578247
        }, {
          id        : 13,
          titulo    : 'titulo 13',
          latitude  : -34.9166899174783,
          longitude : -56.163842890612784
        }, {
          id        : 14,
          titulo    : 'titulo 14',
          latitude  : -34.9176048509802,
          longitude : -56.163842890612784
        }, {
          id        : 15,
          titulo    : 'titulo 15',
          latitude  : -34.91098894822965,
          longitude : -56.166074488513175
        }, {
          id        : 16,
          titulo    : 'titulo 12',
          latitude  : -34.9166899174783,
          longitude : -56.16040966307372
        }, {
          id        : 17,
          titulo    : 'titulo 13',
          latitude  : -34.919434687387515,
          longitude : -56.16143963133544
        }, {
          id        : 18,
          titulo    : 'titulo 14',
          latitude  : -34.91155202454143,
          longitude : -56.14847919737548
        }, {
          id        : 19,
          titulo    : 'titulo 15',
          latitude  : -34.911270486868275,
          longitude : -56.15019581114501
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
