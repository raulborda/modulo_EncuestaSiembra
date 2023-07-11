/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable eqeqeq */
import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import "./modalEncuesta.css";
import { Button, Divider, Empty, Table, Tag } from "antd";
import pdfIcon from "../icons/pdf.png";
import jpgIcon from "../icons/jpg.png";
import pngIcon from "../icons/png.png";
import excelIcon from "../icons/xlsx.png";
import wordIcon from "../icons/docx.png";

// ...

export const VerEncuesta = () => {
  const { infoVerEncuesta, setIsModalOpenVerEncuesta } = useContext(GlobalContext);

  //!funcion para formatear la fecha
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

  // ----------------------------------------------------------------------------------------------------------------------------------
  //!validacion que determina que estado tiene la encuesta
  let estadoMensaje;

  if (infoVerEncuesta[0]?.aencc_estado == 3) {
    // estadoMensaje = "ENCUESTA OK";
    estadoMensaje = (
      <Tag color="green" style={{ paddingTop: "2px" }}>
        ENCUESTA OK
      </Tag>
    );
  } else if (infoVerEncuesta[0]?.aencc_estado == 2) {
    estadoMensaje = (
      <Tag color="red" style={{ paddingTop: "2px" }}>
        NO SIEMBRA
      </Tag>
    );
  } else if (infoVerEncuesta[0]?.aencc_estado == 1) {
    estadoMensaje = (
      <Tag color="red" style={{ paddingTop: "2px" }}>
        NO ACCEDE
      </Tag>
    );
  } else if (infoVerEncuesta[0]?.aencc_estado == 0) {
    estadoMensaje = (
      <Tag color="red" style={{ paddingTop: "2px" }}>
        NO ENCUESTADO
      </Tag>
    );
  } else {
    estadoMensaje = "-"; // Manejar otro caso (opcional)
  }

  // ----------------------------------------------------------------------------------------------------------------------------------

  //! SECCION ICONO DE ARCHIVOS

  const archivos = [
    ...new Set(infoVerEncuesta.map((item) => item.up_hashname)),
  ];

  function renderIcon(filename) {
    const extension = filename.split(".").pop().toLowerCase();

    let icono = null;
    if (extension === "pdf") {
      icono = (
        <img
          style={{ width: "40px", height: "40px" }}
          src={pdfIcon}
          alt="PDF Icon"
        />
      );
    } else if (extension === "jpg") {
      icono = (
        <img
          style={{ width: "40px", height: "40px" }}
          src={jpgIcon}
          alt="Image Icon"
        />
      );
    } else if (extension === "png") {
      icono = (
        <img
          style={{ width: "40px", height: "40px" }}
          src={pngIcon}
          alt="Image Icon"
        />
      );
    } else if (extension === "xlsx" || extension === "xls") {
      icono = (
        <img
          style={{ width: "40px", height: "40px" }}
          src={excelIcon}
          alt="Excel Icon"
        />
      );
    } else if (extension === "docx") {
      icono = (
        <img
          style={{ width: "40px", height: "40px" }}
          src={wordIcon}
          alt="Word Icon"
        />
      );
    }
    return icono;
  }

  // Eliminar duplicados de archivos
  const archivosUnicos = archivos.map((filename) => {
    const archivo = infoVerEncuesta.find(
      (item) => item.up_hashname === filename
    );
    return {
      up_filename: archivo.up_filename,
      up_hashname: archivo.up_hashname,
      up_mimetype: archivo.up_mimetype,
    };
  });

  //console.log("archivosUnicos: ", archivosUnicos);

  //! FIN SECCION ICONO DE ARCHIVOS

  // ----------------------------------------------------------------------------------------------------------------------------------

  //! SECCION LOTES
  const lotesUnicos = [
    ...new Set(infoVerEncuesta.map((item) => item.alote_nombre)),
  ];

  const columns = [
    {
      title: "CAMPO",
      dataIndex: "campo",
      key: "campo",
      align: "left",
    },
    {
      title: "LOTE",
      dataIndex: "lote",
      key: "lote",
      align: "left",
    },
    {
      title: "HAS.",
      dataIndex: "has",
      key: "has",
      align: "center",
    },
  ];

  const data = lotesUnicos.map((lote) => {
    const items = infoVerEncuesta.filter((item) => item.alote_nombre === lote);
    const campo = items[0].cam_nombre;
    const has = items[0].ahas_usuario;

    return {
      campo,
      lote,
      has,
    };
  });

  const paginationConfig = {
    pageSizeOptions: ["5"], // Opciones de cantidad de elementos por página
    defaultPageSize: 5, // Cantidad de elementos por página por defecto
    showSizeChanger: true, // Mostrar selector de cantidad de elementos por página
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} de ${total} registros`, // Texto que muestra la cantidad total de registros
  };

  //! FIN SECCION LOTES

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
        <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
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
        <Divider style={{ marginTop: "8px", marginBottom: "8px" }} />
        {/* LINEA 3 */}
        <span className="spanSuperTitulo">Eventos</span>
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
            <span className="spanTitulo">% Est. Acopio</span>
            <span className="spanCuerpo spanNumber">
              {infoVerEncuesta[0]?.est_acopio
                ? infoVerEncuesta[0]?.est_acopio
                : "0"}
            </span>
          </div>
          <div className="div_formato_vertical">
            <span className="spanTitulo" style={{ marginBottom: "13px" }}>
              Destino
            </span>
            <span className="spanCuerpo" style={{ marginBottom: "14px" }}>
              {infoVerEncuesta[0]?.dest_desc
                ? infoVerEncuesta[0]?.dest_desc
                : "-"}
            </span>
          </div>
        </div>
        <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
        {/* LINEA 4 */}
        <span className="spanSuperTitulo">Archivos</span>
        <div className="div_formato_archivo_horizontal">
          {archivosUnicos.length > 1 ? (
            archivosUnicos.map((archivo) => {
              const { up_filename, up_hashname, up_mimetype } = archivo;
              return (
                <div
                  className="div_formato_archivo_vertical"
                  style={{ marginRight: "10px" }}
                  key={up_hashname}
                >
                  <div style={{ marginLeft: "-15px" }}>
                    {up_mimetype && renderIcon(up_mimetype)}
                  </div>
                  <span className="spanArchivos">
                    {up_filename}.{up_mimetype}
                  </span>
                </div>
              );
            })
          ) : (
            <div style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          )}
        </div>
        <Divider />
        {/* LINEA 5 */}
        <span className="spanSuperTitulo">Lotes</span>
        {data.length > 0 ? (
          <Table
            columns={columns}
            dataSource={data}
            pagination={paginationConfig}
            size="small"
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />

        <div style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"flex-end"}}>
          <Button type="primary" style={{borderRadius:"0px"}} onClick={() =>  setIsModalOpenVerEncuesta(false)}>
            CERRAR
          </Button>
        </div>
      </div>
    </>
  );
};
