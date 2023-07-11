import React from 'react';

const DrawerUpload = ({drawer, modori_id, filter_id, usu_id, generico_id, cli_id}) => {
    const URL = process.env.REACT_APP_URL;

    console.log("drawer: ", drawer);
    console.log("modori_id: ", modori_id);
    console.log("filter_id: ", filter_id);
    console.log("usu_id: ", usu_id);
    console.log("generico_id: ", generico_id);
    console.log("cli_id: ", cli_id);
    
    
    return (
        <>
        <iframe
            loading="lazy"
            //src={`${URL}/duoc/modulos/vista_cliente/?idC=${cliSelect}`} // para el resto de los crm
            src={`http://10.0.0.28//tati/file/?drawer=${drawer}&modori_id=${modori_id}&filter_id=${filter_id}&usu_id=${usu_id}&generico_id=${generico_id}&cli_id=${cli_id}`} // para probar en tati
            width={"100%"}
            // height={"600"}
            height={"1000"}
            style={{ border: "none" }}
            title="drawer"
          ></iframe>
        </>
    );
};

export default DrawerUpload;