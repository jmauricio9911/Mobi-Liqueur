# Plantilla AngularJS ![MOBI-LIQUEUR](public/resources/descarga1.png)

___

Aplicación construida con AngularJS.

### Ejecución ⚙️

Abrir ***webapp/index.html*** en cualquier servidor web.

### Consideraciones ❗

Lista de consideraciones para ejecutar el proyecto.

- En el archivo ***webapp/services/master.js*** cambiar el valor de **URL** con el servicio que va a consumir.

```javascript
const URL = "yourservice";
```

- Al tratar de consumir los servicios puede tener problemas de CORS. Esto se soluciona si abre un navegador con la seguridad deshabilitada; ejemplo en Google Chrome:

```sh
chrome.exe --args --disable-web-security --user-data-dir="C:\chrome_temp"
```
- Una de las maneras de ejecutar desde un cliente localhost puede ser desde xampp en la carpeta htdos
## Autores 👨‍💻 👩‍💻

Equipo de desarrollo **Mauricio Urriola**
