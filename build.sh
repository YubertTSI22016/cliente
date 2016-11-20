#!/bin/bash
# Usage: build.sh 'platform'
cp tpl/config.xml.tpl config.xml
sed -i s/%NOMBRE_APP%/$1/g config.xml
sed -i s/%DOMINIO%/com.yuber.app/g config.xml
cp tpl/ionic.config.json.tpl ionic.config.json
sed -i s/%NOMBRE_APP%/$1/g ionic.config.json
cp tpl/config.js.tpl www/js/config.js
sed -i s/%NOMBRE_EMPRESA%/$2/g www/js/config.js
sed -i s/%URL%/$3/g www/js/config.js
sed -i s/%TIPO%/$4/g www/js/config.js
sed -i s/%TENANT_ID%/$5/g www/js/config.js
sed -i s/%FACEBOOK%/$6/g www/js/config.js

ionic build android
#orden de variables: nombreApp nombreEmpresa URL TIPO TENANT_ID FACEBOOK
