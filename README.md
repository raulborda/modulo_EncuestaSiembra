# Node v14.17.0

# modulos/encuesta_siembra

## LOCAL

### App.js

    - Comentar lineas:
        - const idUsu = localStorage.getItem("usuario");
        - const idC = localStorage.getItem("cliSelect");
    - Descomentar lineas:
        - const idUsu = 1; //.28 (También para .153)
        - const idC = 2049; //.28 (a modo ejemplo, hay más)


### .env

    - Comentar lineas:
        - REACT_APP_URL = '../’
    - Descomentar lineas:
        - REACT_APP_URL = 'http://10.0.0.28/tati/modulos/'

### EncuestaSiembra.js

    - Comentar lineas:
        - src={`${URLDrawer}/duoc/file_dos/?drawer=${drawerUpload}&modori_id=${modori}&filter_id=${filter}&usu_id=${usu}&generico_id=${generico}&cli_id=${cliEnc}`} // para el resto de los crm
    - Descomentar lineas:
        - src={`${URLDrawer}/tati/file_dos/?drawer=${drawerUpload}&modori_id=${modori}&filter_id=${filter}&usu_id=${usu}&generico_id=${generico}&cli_id=${cliEnc}`} // para local tati

## PRODUCCION

### App.js

    - Descomentar lineas:
        - const idUsu = localStorage.getItem("usuario");
        - const idC = localStorage.getItem("cliSelect");
    - Comentar lineas:
        - const idUsu = 1; //.28 (También para .153)
        - const idC = 2049; //.28 (a modo ejemplo, hay más)


### .env

    - Descomentar lineas:
        - REACT_APP_URL = '../’
    - Comentar lineas:
        - REACT_APP_URL = 'http://10.0.0.28/tati/modulos/'

### EncuestaSiembra.js

    - Comentar lineas:
        - src={`${URLDrawer}/duoc/file_dos/?drawer=${drawerUpload}&modori_id=${modori}&filter_id=${filter}&usu_id=${usu}&generico_id=${generico}&cli_id=${cliEnc}`} // para el resto de los crm
    - Descomentar lineas:
        - src={`${URLDrawer}/tati/file_dos/?drawer=${drawerUpload}&modori_id=${modori}&filter_id=${filter}&usu_id=${usu}&generico_id=${generico}&cli_id=${cliEnc}`} // para local tati
