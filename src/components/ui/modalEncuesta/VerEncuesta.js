/* eslint-disable eqeqeq */
import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import "./modalEncuesta.css";
import { Divider } from "antd";

export const VerEncuesta = () => {
  const { infoVerEncuesta } = useContext(GlobalContext);

  //funcion para formatear la fecha
  function formatDate(dateString) {
    if (!dateString) {
      return "-"; // Manejar caso de fecha vacía o indefinida
    }

    const parts = dateString.split("-");
    const day = parts[2].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[0];

    return `${day}/${month}/${year}`;
  }

  //validacion que determina que estado tiene la encuesta
  let estadoMensaje;

  if (infoVerEncuesta[0]?.aencc_estado == 3) {
    // estadoMensaje = "ENCUESTA OK";
    estadoMensaje = <span style={{backgroundColor:"#56b43c", color:"white", fontWeight:"500", padding:"1px 8px", borderRadius:"4px"}}>ENCUESTA OK</span>
  } else if (infoVerEncuesta[0]?.aencc_estado == 2) {
    estadoMensaje = <span style={{backgroundColor:"#da4453", color:"white", fontWeight:"500", padding:"1px 8px", borderRadius:"4px"}}>NO SIEMBRA</span>
  } else if (infoVerEncuesta[0]?.aencc_estado == 1) {
    estadoMensaje = <span style={{backgroundColor:"#da4453", color:"white", fontWeight:"500", padding:"1px 8px", borderRadius:"4px"}}>NO ACCEDE</span>
  } else if (infoVerEncuesta[0]?.aencc_estado == 0) {
    estadoMensaje = <span style={{backgroundColor:"#da4453", color:"white", fontWeight:"500", padding:"1px 8px", borderRadius:"4px"}}>NO ENCUESTADO</span>
  } else {
    estadoMensaje = "-"; // Manejar otro caso (opcional)
  }

  return (
    <>
      <div className="wrapper_divVerEnc">
        {/* LINEA 1 */}
        <div className="div_formato_horizontal">
          <div className="div_formato_vertical">
            <span className="spanTitulo">Cosecha</span>
            <span className="spanCuerpo">{infoVerEncuesta[0]?.acos_desc}</span>
          </div>
          <div className="div_formato_vertical">
            <span className="spanTitulo">Cultivo / Ciclo</span>
            <span className="spanCuerpo">
              {infoVerEncuesta[0]?.acult_desc} /{" "}
              {infoVerEncuesta[0]?.aencc_ciclo}º
            </span>
          </div>
          <div className="div_formato_vertical">
            <span className="spanTitulo">Cultivo Anterior</span>
            <span className="spanCuerpo">
              {infoVerEncuesta[0]?.acult_desc_anterior}
            </span>
          </div>
          <div className="div_formato_vertical">
            <span className="spanTitulo">Estado</span>
            {estadoMensaje}
          </div>
        </div>
        <Divider />
        {/* LINEA 2 */}
        <div className="div_formato_horizontal">
          <div className="div_formato_vertical">
            <span className="spanTitulo">Fecha de siembra</span>
            <span className="spanCuerpo">
              {formatDate(infoVerEncuesta[0]?.fechasiembra)}
            </span>
          </div>
          <div className="div_formato_vertical">
            <span className="spanTitulo">Sup. Est.(Has)</span>
            <span className="spanCuerpo spanNumber">
              {infoVerEncuesta[0]?.superficie
                ? infoVerEncuesta[0]?.superficie
                : "0"}
            </span>
          </div>
          <div className="div_formato_vertical">
            <span className="spanTitulo">Rinde Est. (TT)</span>
            <span className="spanCuerpo spanNumber">
              {infoVerEncuesta[0]?.rindeest
                ? infoVerEncuesta[0]?.rindeest
                : "0"}
            </span>
          </div>
          <div className="div_formato_vertical">
            <span className="spanTitulo">Costo (U$S)</span>
            <span className="spanCuerpo spanNumber">
              {infoVerEncuesta[0]?.costoest
                ? infoVerEncuesta[0]?.costoest
                : "0"}
            </span>
          </div>
        </div>
        <Divider />
        {/* LINEA 3 */}
        <div className="div_formato_horizontal">
          <div className="div_formato_vertical">
            <span className="spanTitulo">Sup. Real(Has)</span>
            <span className="spanCuerpo spanNumber">
              {infoVerEncuesta[0]?.superficiereal
                ? infoVerEncuesta[0]?.superficiereal
                : "0"}
            </span>
          </div>
          <div className="div_formato_vertical">
            <span className="spanTitulo">Rinde Real (TT)</span>
            <span className="spanCuerpo spanNumber">
              {infoVerEncuesta[0]?.rindereal
                ? infoVerEncuesta[0]?.rindereal
                : "0"}
            </span>
          </div>
          <div className="div_formato_vertical">
            <span className="spanTitulo">% EST. ACOPIO</span>
            <span className="spanCuerpo spanNumber">
              {infoVerEncuesta[0]?.est_acopio
                ? infoVerEncuesta[0]?.est_acopio
                : "0"}
            </span>
          </div>
          <div className="div_formato_vertical">
            <span className="spanTitulo">DESTINO</span>
            <span className="spanCuerpo spanNumber">
              {infoVerEncuesta[0]?.dest_desc
                ? infoVerEncuesta[0]?.dest_desc
                : "-"}
            </span>
          </div>
        </div>
        <Divider />
        {/* LINEA 4 */}
      </div>
    </>
  );
};
