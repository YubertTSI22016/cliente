// angular.module('app').constant('CONFIG', {
//   'NOMBRE_EMPRESA'  : 'YUBER',
//   'IONIC_ID'        : '324566f8',
//   'URL'             : '/yuberapi/rest/',
//   // 'URL'             : 'http://10.0.22.195:8080/yuberapi/rest/',
//   'TENANT_ID'       : 'b378b367-b024-4168-86dc-fdf0c21ee200',
//	 'TIPO'       	   : 'transporte',
//   'FACEBOOK'        : true,
//   'PUSHER_KEY'      : 'c2f52caa39102181e99f',
//   'STRIPE_KEY'      : 'pk_test_6pRNASCoBOKtIshFeQd4XMUh'
// });

angular.module('app').constant('CONFIG', {
  'NOMBRE_EMPRESA'  : '%NOMBRE_EMPRESA%',
  'IONIC_ID'        : '324566f8',
  'URL'             : '%URL%',
  'TENANT_ID'       : '%TENANT_ID%',
  'TIPO'       		: '%TIPO%',
  'FACEBOOK'        : %FACEBOOK%,
  'PUSHER_KEY'      : 'c2f52caa39102181e99f',
  'STRIPE_KEY'      : 'pk_test_6pRNASCoBOKtIshFeQd4XMUh'
});