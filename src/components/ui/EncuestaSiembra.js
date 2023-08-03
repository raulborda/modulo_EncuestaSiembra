/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import "./index.css";
import { Button, Drawer, Empty, Modal, Select, Table, Tag } from "antd";
import { GlobalContext } from "../context/GlobalContext";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import {
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PaperClipOutlined,
  ProfileOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { NuevaEncuesta } from "./modalEncuesta/NuevaEncuesta";
import { EditarEncuesta } from "./modalEncuesta/EditarEncuesta";
import Swal from "sweetalert2";
import { NuevoEvento } from "./modalEncuesta/NuevoEvento";
import LotesEncuestas from "./LotesEncuestas";
import { VerEncuesta } from "./modalEncuesta/VerEncuesta";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${Math.trunc(value).toLocaleString().replace(/,/g, ".")}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export const EncuestaSiembra = ({ cosechaActiva }) => {
  const URL = process.env.REACT_APP_URL;

  const PORT = window.location.port ? window.location.port : 80;
  const PROTOCOL = window.location.protocol;
  const HOSTNAME = window.location.hostname;
  const URLDrawer = `${PROTOCOL}//${HOSTNAME}:${PORT}`;

  const {
    usu,

    selectedAcosDesc,
    cosechaSeleccionada,
    listCosechas,
    clientes,
    setClientes,
    lotes,
    setLotes,
    cultivos,
    setCultivos,
    setAddEncCultivos,
    setCosechaSeleccionada,

    isModalOpen,
    setIsModalOpen,
    isModalOpenEdit,
    setIsModalOpenEdit,
    isModalOpenEvent,
    setIsModalOpenEvent,
    isModalOpenVerEncuesta,
    setIsModalOpenVerEncuesta,

    upload,
    setUpload,
    infoEncuesta,
    setInfoEncuesta,
    infoEncuestaEvent,
    setInfoEncuestaEvent,
    editarEncuesta,
    setEditarEncuesta,
    infoEventoNew,
    setInfoEventoNew,
    infoVer,
    setInfoVer,
    infoVerEncuesta,
    setInfoVerEncuesta,
    dataLotes,
    setDataLotes,

    encuestaSeleccionada,
    setEncuestaSeleccionada,
    addEncCultivos,

    updateSelects, setUpdatesSelects,
    updateGraph, setUpdateGraph,

  } = useContext(GlobalContext);

  const [idCli, setIdCli] = useState(0);
  const [selectedLote, setSelectedLote] = useState("todos");
  const [selectedCultivo, setSelectedCultivo] = useState("todos");
  const [selectedEstado, setSelectedEstado] = useState("3");
  const [infoTable, setInfoTable] = useState([]);
  const [nombreCliLote, setNombreCliLote] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [lotesEncuestasKey, setLotesEncuestasKey] = useState(0);
  const [drawerUpload, setDrawerUpload] = useState(false);
  const [modori, setModori] = useState(0);
  const [filter, setFilter] = useState(0);
  const [generico, setGenerico] = useState(0);
  const [cliEnc, setCliEnc] = useState(0);

  //! Modal - Nueva Encuesta
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //! Modal - Editar Encuesta
  const showModalEdit = () => {
    setIsModalOpenEdit(true);
  };
  const handleOkEdit = () => {
    setIsModalOpenEdit(false);
  };
  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
  };

  //! Modal - Agregar Evento

  const showModalEvent = () => {
    setIsModalOpenEvent(true);
  };
  const handleOkEvent = () => {
    setIsModalOpenEvent(false);
  };
  const handleCancelEvent = () => {
    setIsModalOpenEvent(false);
  };

  //! Modal - Ver Encuesta

  const showModalVerEncuesta = () => {
    setIsModalOpenVerEncuesta(true);
  };
  const handleOkVerEncuesta = () => {
    setIsModalOpenVerEncuesta(false);
  };
  const handleCancelVerEncuesta = () => {
    setIsModalOpenVerEncuesta(false);
  };

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };
  //! Fin - Modales

  const columns = [
    {
      key: "idCliente",
      width: "1%", // Ajustar el ancho de la columna
    },
    {
      key: "idEncuesta",
      width: "1%", // Ajustar el ancho de la columna
    },
    {
      title: "CLIENTE",
      dataIndex: "cliente",
      key: "cliente",
      width: "20%", // Ajustar el ancho de la columna
    },
    {
      title: "CULTIVO/CICLO",
      dataIndex: "cultivo",
      key: "cultivo",
      width: "10%", // Ajustar el ancho de la columna
    },
    {
      title: "SUP. EST. (HAS)",
      dataIndex: "supEstimado",
      key: "supEstimado",
      align: "right",
      width: "10%", // Ajustar el ancho de la columna
    },
    {
      title: "RINDE. EST. (TT)",
      dataIndex: "rindeEstimado",
      key: "rindeEstimado",
      align: "right",
      width: "10%", // Ajustar el ancho de la columna
    },
    {
      title: "COSTO. EST. (U$S)",
      dataIndex: "costoEstimado",
      key: "costoEstimado",
      align: "right",
      width: "10%", // Ajustar el ancho de la columna
    },
    {
      title: "ESTADO",
      key: "estado",
      dataIndex: "estado",
      align: "center", // Centrar el contenido de la columna
      // width: 100, // Ajustar el ancho de la columna
      width: "10%", // Ajustar el ancho de la columna
    },
    {
      title: "...",
      dataIndex: "botones",
      key: "botones",
      align: "center", // Centrar el contenido de la columna
      width: "10%", // Ajustar el ancho de la columna
      render: (_, record, index) => {
        if (
          record.estado &&
          (record.estado.props.children === "NS" ||
            record.estado.props.children === "NA" ||
            record.estado.props.children === "NE")
        ) {
          return (
            <span>
              <ProfileOutlined
                title="Agregar Evento"
                style={{ marginRight: "5px" }}
                className="btnNuevoEvento"
                onClick={() => handleEventClick(record, index)}
              />
              <ReadOutlined
                title="Ver Encuesta"
                style={{ marginRight: "5px" }}
                className="btnVerEncuesta"
                onClick={() => handleVerEnc(record, index)}
              />
              <EnvironmentOutlined
                title="Ver Lotes Encuesta"
                style={{ marginRight: "5px" }}
                // className='btnNuevoEvento'
                onClick={() => handleLoteClick(record, index)}
              />
              <PaperClipOutlined
                className="btnUploadEncuesta"
                title="Archivos"
                style={{ marginRight: "5px" }}
                onClick={() => handleUploadClick(record, index)}
              />
              <DeleteOutlined
                title="Borrar Encuesta"
                style={{ color: "red" }}
                onClick={() => showDeleteConfirmation(record, index)}
              />
            </span>
          );
        } else {
          return (
            <span>
              <EditOutlined
                title="Editar Encuesta"
                style={{ marginRight: "5px" }}
                className="btnEditEncuesta"
                onClick={() => handleEditClick(record, index)}
              />
              <ProfileOutlined
                title="Agregar Evento"
                style={{ marginRight: "5px" }}
                className="btnNuevoEvento"
                onClick={() => handleEventClick(record, index)}
              />
              <ReadOutlined
                title="Ver Encuesta"
                style={{ marginRight: "5px" }}
                className="btnVerEncuesta"
                onClick={() => handleVerEnc(record, index)}
              />
              <EnvironmentOutlined
                title="Ver Lotes Encuesta"
                style={{ marginRight: "5px" }}
                // className='btnNuevoEvento'
                onClick={() => handleLoteClick(record, index)}
              />
              <PaperClipOutlined
                className="btnUploadEncuesta"
                title="Archivos"
                style={{ marginRight: "5px" }}
                onClick={() => handleUploadClick(record, index)}
              />
              <DeleteOutlined
                title="Borrar Encuesta"
                style={{ color: "red" }}
                onClick={() => showDeleteConfirmation(record, index)}
              />
            </span>
          );
        }
      },
    },
  ];
  const visibleColumns = columns.slice(2); //En esta linea saco las dos primeras columnas para que no se visualicen

  const data = infoTable.map((item) => {
    const cultivo =
      item.ciclo !== "0"
        ? item.acult_desc + " / " + item.ciclo + "°"
        : item.acult_desc;
    let estadoTag;
    switch (item.aencc_estado) {
      case "3":
        estadoTag = (
          <Tag color="green" key={3}>
            OK
          </Tag>
        );
        break;
      case "2":
        estadoTag = (
          <Tag color="red" key={2}>
            NS
          </Tag>
        );
        break;
      case "1":
        estadoTag = (
          <Tag color="red" key={1}>
            NA
          </Tag>
        );
        break;
      case "0":
        estadoTag = (
          <Tag color="red" key={0}>
            NE
          </Tag>
        );
        break;
      default:
        estadoTag = null;
    }
    return {
      idCliente: item.cli_id,
      idEncuesta: item.aencc_id,
      cliente: item.cli_nombre,
      cultivo: cultivo,
      supEstimado: item.superficie,
      rindeEstimado: item.rindeest,
      costoEstimado: item.costoest,
      estado: estadoTag,
      botones: "...",
    };
  });

  const showDeleteConfirmation = (record) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la encuesta seleccionada.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ELIMINAR",
      cancelButtonText: "CANCELAR",
      customClass: {
        container: "my-swal-container", // Clase CSS para el contenedor del diálogo
        title: "my-swal-title", // Clase CSS para el título
        content: "my-swal-content", // Clase CSS para el contenido del mensaje
        confirmButton: "my-swal-confirm-button", // Clase CSS para el botón de confirmación
        cancelButton: "my-swal-cancel-button", // Clase CSS para el botón de cancelación
      },
      confirmButtonColor: "#ff0000", // Color del botón de confirmación (en este caso, rojo)
    }).then((result) => {
      if (result.isConfirmed) {
        const dataAdd = new FormData();
        dataAdd.append("idU", usu);
        dataAdd.append("cliid", record.idCliente);
        dataAdd.append("encid", parseInt(record.idEncuesta));

        fetch(`${URL}encuesta-siembra_eliminarEncuesta.php`, {
          method: "POST",
          body: dataAdd,
        }).then(function (response) {
          if (response.ok) {
            response.text().then((resp) => {
              const data = resp;
              //console.log("data: ", data);
              Swal.fire(
                "Eliminado",
                "El elemento ha sido eliminado exitosamente.",
                "success"
              );
              setUpload(!upload);
              setUpdatesSelects(!updateSelects)
            });
          } else {
            // Si la eliminación no fue exitosa, puedes mostrar un mensaje de error aquí
            Swal.fire("Error", "No se pudo eliminar el elemento.", "error");
          }
        });
      }
    });
  };


  //! ACTUALIZAR SELECTS DEFINITIVAMENTE

  useEffect(() => {
    setIdCli(0);
    setSelectedLote("todos");
    setSelectedCultivo("todos");
    setSelectedEstado(3);
    
  }, [updateSelects])
  





  //! INICIO - Abrir Editar Encuesta
  //*Este useEffect es para que me traiga la info actualizada y no atrasada
  useEffect(() => {
    if (Object.keys(infoEncuesta).length > 0 && editarEncuesta.length > 0) {
      showModalEdit();
    }
  }, [editarEncuesta]);

  const handleEditClick = (record) => {
    setInfoEncuesta(record);
  };
  //! FIN - Abrir Editar Encuesta


  //! INICIO - Abrir Nuevo Evento
  //*Este useEffect es para que me traiga la info actualizada y no atrasada
  useEffect(() => {
    if (Object.keys(infoEncuestaEvent).length > 0 && infoEventoNew.length > 0) {
      showModalEvent();
    }
  }, [infoEventoNew]);

  const handleEventClick = (record) => {
    //console.log("Registro seleccionado:", record);
    setInfoEncuestaEvent(record);
    // console.log('Registro seleccionado - infoEncuestaEvent:', infoEncuestaEvent);
  };
  //! FIN - Abrir Nuevo Evento

  //! INICIO - Abrir Ver Encuesta
  //*Este useEffect es para que me traiga la info actualizada y no atrasada
  useEffect(() => {
    if (Object.keys(infoVer).length > 0 && infoVerEncuesta.length > 0) {
      showModalVerEncuesta();
    }
  }, [infoVerEncuesta]);

  const handleVerEnc = (record) => {
    setInfoVer(record);
  };
  //! FIN - Abrir Editar Encuesta

  //! INICIO -  Upload

  const handleUploadClick = (record) => {
    //console.log("handleUploadClick: ",record);
    setDrawerUpload(true);
    setModori(5);
    setFilter(5);
    setCliEnc(Number(record.idCliente))
    setGenerico(Number(record.idEncuesta));
  };

  // console.log("modori:", modori);
  // console.log("cliEnc:", cliEnc);
  // console.log("modori:", generico);

  const handleCloseDrawer = () => {
    setDrawerUpload(false);
  };  

  const handleMessageFromIframe = (event) => {
    if (event.data === "closeDrawer") {
      handleCloseDrawer();
    }
  };

  // Agrega el event listener para recibir mensajes del iframe
  useEffect(() => {
    window.addEventListener("message", handleMessageFromIframe);

    // Remueve el event listener al desmontar el componente
    return () => {
      window.removeEventListener("message", handleMessageFromIframe);
    };
  }, []);

  //! FIN - Upload




  //! GRAFICOS ENCUESTA SIEMBRA

  // const [cultivos, setCultivos] = useState([]);
  const [cultivosSupEncuestadas, setCultivosSupEncuestadas] = useState([]);
  const [cultivosProdEncuestadas, setCultivosProdEncuestadas] = useState([]);
  const [cultivosCostoEncuestadas, setCultivosCostoEncuestadas] = useState([]);
  const [legendSupEncuestadas, setLegendSupEncuestadas] = useState({
    activeIndex: 0,
  });
  const [legendProdEncuestadas, setLegendProdEncuestadas] = useState({
    activeIndex: 0,
  });
  const [legendCostoEncuestadas, setLegendCostoEncuestadas] = useState({
    activeIndex: 0,
  });
  const [totalProduccion, setTotalProduccion] = useState(0);
  const [totalCosto, setTotalCosto] = useState(0);
  const [totalSuperficie, setTotalSuperficie] = useState(0);

  const onPieEnterSupEncuestadas = (_, index) => {
    setLegendSupEncuestadas({
      activeIndex: index,
    });
  };
  const onPieEnterProdEncuestadas = (_, index) => {
    setLegendProdEncuestadas({
      activeIndex: index,
    });
  };
  const onPieEnterCostoEncuestadas = (_, index) => {
    setLegendCostoEncuestadas({
      activeIndex: index,
    });
  };

  //! ACA EMPIEZA DRAWER VER LOTES
  const handleLoteClick = (record) => {
    setDataLotes({});
    //console.log("Registro seleccionado:", record);
    setNombreCliLote(record.cliente);
    const data = new FormData();
    data.append("idEnc", record.idEncuesta);

    fetch(`${URL}encuesta-siembra_viewLotesEncuesta.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        //console.log('resp view lotes: ', resp);
        const data = resp;
        const objetoData = JSON.parse(data);
        setDataLotes(objetoData);
        //console.log('siembra_viewLotesEncuesta - objetoData: ', objetoData);
        //console.log('siembra_viewLotesEncuesta- dataLotes: ', dataLotes);
      });
    });
    // setOpenDrawer(true);
    setLotesEncuestasKey((prevKey) => prevKey + 1);
  };

  //*Este useEffect es para que me traiga la info actualizada y no atrasada para Lotes
  useEffect(() => {
    //console.log("siembra_viewLotesEncuesta- dataLotes: ", dataLotes);
    if (Object.keys(dataLotes).length > 0) {
      setOpenDrawer(true);
    }
  }, [dataLotes]);

  function traeCultivos() {
    const data = new FormData();
    fetch(`${URL}clientview_listCultivos.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        // console.log('objetoData - clientview_listCultivos.php: ', objetoData)
        const cultivosConTodos = [
          { acult_id: "todos", acult_desc: "TODOS" },
          ...objetoData,
        ];
        setCultivos(cultivosConTodos);
        setAddEncCultivos(objetoData);
      });
    });
  }

  function traeClientes() {
    const data = new FormData();
    data.append("idU", usu);
    fetch(`${URL}lot_listClientes.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        // console.log('objetoData - lot_listClientes: ', objetoData)
        // const ClientesConTodos = [{ cli_id: "TODOS", cli_nombre: "TODOS" }, ...objetoData];
        setClientes(objetoData);
      });
    });
  }

  useEffect(() => {
    if (idCli) {
      // console.log('idCli: ', idCli);
      // setLotes([]);
      const data = new FormData();
      data.append("idC", idCli);
      fetch(`${URL}encuesta-siembra_listLotes.php`, {
        method: "POST",
        body: data,
      }).then(function (response) {
        response.text().then((resp) => {
          const data = resp;
          const objetoData = JSON.parse(data);
          const LotesConTodos = [
            { alote_id: "todos", alote_nombre: "TODOS" },
            { alote_id: "0", alote_nombre: "SIN LOTES" },
            ...objetoData,
          ];
          // console.log('objetoData - encuesta-siembra_listLotes: ', objetoData);
          if (idCli === 0) {
            setLotes([]);
          } else {
            setLotes(LotesConTodos);
          }
          //setSelectedLote(null); // Reinicia el lote seleccionado
        });
      });
    }
  }, [idCli]);

  useEffect(() => {
    const dataAdd = new FormData();
    dataAdd.append("idU", usu);
    dataAdd.append("idC", idCli);
    if (cosechaSeleccionada) {
      dataAdd.append("idCos", cosechaSeleccionada);
    } else {
      dataAdd.append("idCos", cosechaActiva);
    }
    if (selectedCultivo === "todos") {
      dataAdd.append("idCul", "");
    } else {
      dataAdd.append("idCul", selectedCultivo);
    }
    if (selectedLote === "todos" || selectedLote === "0") {
      dataAdd.append("idLote", "");
    } else {
      dataAdd.append("idLote", selectedLote);
    }

    fetch(`${URL}encuesta-siembra_SupEncuestasCultivo.php`, {
      method: "POST",
      body: dataAdd,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        // console.log('objetoData - clientview_SupEncuestasCultivo.php: ', objetoData)
        // Transformar los datos antes de asignarlos al estado
        const transformedData = objetoData.map((item) => {
          return { name: item[0], value: item[1], colors: item[2] };
        });
        //console.log("transformedData: ", transformedData);
        setCultivosSupEncuestadas(transformedData);

        // Calcular el total de los valores
        const total = transformedData.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.value;
        }, 0);
        // Hacer algo con el total, como asignarlo a un estado
        // setSupEncuestadas(total);
        setTotalSuperficie(Math.trunc(total).toLocaleString("de-DE"));
      });
    });
  }, [
    selectedCultivo,
    selectedAcosDesc,
    cosechaSeleccionada,
    idCli,
    selectedLote,
    updateSelects,
    updateGraph
  ]);

  useEffect(() => {
    const dataAdd = new FormData();
    dataAdd.append("idU", usu);
    dataAdd.append("idC", parseInt(idCli));
    if (cosechaSeleccionada) {
      dataAdd.append("idCos", cosechaSeleccionada);
    } else {
      dataAdd.append("idCos", cosechaActiva);
    }
    if (selectedCultivo === "todos") {
      dataAdd.append("idCul", "");
    } else {
      dataAdd.append("idCul", selectedCultivo);
    }

    if (selectedLote === "todos" || selectedLote === "0") {
      dataAdd.append("idLote", "");
    } else {
      dataAdd.append("idLote", selectedLote);
    }
    // dataAdd.append("idLote", selectedLote);
    fetch(`${URL}encuesta-siembra_ProdEncuestasCultivo.php`, {
      method: "POST",
      body: dataAdd,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        // console.log('objetoData - clientview_ProdEncuestasCultivo.php: ', objetoData)
        // Transformar los datos antes de asignarlos al estado
        const transformedData = objetoData.map((item) => {
          return { name: item[0], value: item[1], colors: item[2] };
        });
        setCultivosProdEncuestadas(transformedData);

        // Calcular el total de los valores
        const total = transformedData.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.value;
        }, 0);
        setTotalProduccion(Math.trunc(total).toLocaleString("de-DE"));
      });
    });
  }, [
    selectedCultivo,
    selectedAcosDesc,
    cosechaSeleccionada,
    idCli,
    selectedLote,
    updateSelects,
    updateGraph
  ]);

  useEffect(() => {
    const dataAdd = new FormData();
    dataAdd.append("idU", usu);
    dataAdd.append("idC", parseInt(idCli));
    //console.log("cosechaSeleccionada: ", cosechaSeleccionada);
    if (cosechaSeleccionada) {
      dataAdd.append("idCos", cosechaSeleccionada);
    } else {
      dataAdd.append("idCos", cosechaActiva);
    }
    if (selectedCultivo === "todos") {
      dataAdd.append("idCul", "");
    } else {
      dataAdd.append("idCul", selectedCultivo);
    }
    if (selectedLote === "todos" || selectedLote === "0") {
      dataAdd.append("idLote", "");
    } else {
      dataAdd.append("idLote", selectedLote);
    }
    fetch(`${URL}encuesta-siembra_CostoEncuestaCultivo.php`, {
      method: "POST",
      body: dataAdd,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        // console.log('objetoData - clientview_CostoEncuestasCultivo.php: ', objetoData)
        // Transformar los datos antes de asignarlos al estado
        const transformedData = objetoData.map((item) => {
          return { name: item[0], value: item[1], colors: item[2] };
        });

        //console.log("setCultivosCostoEncuestadas: ", transformedData);
        setCultivosCostoEncuestadas(transformedData);

        // Calcular el total de los valores
        const total = transformedData.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.value;
        }, 0);
        setTotalCosto(Math.trunc(total).toLocaleString("de-DE"));
      });
    });
  }, [
    selectedCultivo,
    selectedAcosDesc,
    cosechaSeleccionada,
    idCli,
    selectedLote,
    updateSelects,
    updateGraph
  ]);

  useEffect(() => {
    const dataAdd = new FormData();
    dataAdd.append("idU", usu);
    dataAdd.append("idC", idCli);
    if (
      selectedLote === "todos" ||
      selectedLote === "" ||
      selectedLote === -1
    ) {
      // console.log('selectedLote: ', selectedLote);
      dataAdd.append("idLote", "");
    } else {
      dataAdd.append("idLote", selectedLote);
    }
    if (cosechaSeleccionada) {
      // console.log('cosechaSeleccionada0: ', cosechaSeleccionada);
      dataAdd.append("idCos", cosechaSeleccionada);
    } else {
      // console.log('cosechaSeleccionada1: ', cosechaSeleccionada);
      // console.log('cosechaSeleccionada: ', cosechaActiva);
      dataAdd.append("idCos", cosechaActiva);
    }
    if (selectedCultivo === "todos") {
      dataAdd.append("idCul", "");
    } else {
      dataAdd.append("idCul", selectedCultivo);
    }
    if (selectedEstado === "todos") {
      dataAdd.append("idEst", "");
    } else {
      dataAdd.append("idEst", selectedEstado);
    }
    fetch(`${URL}encuesta-siembra_datosTable.php`, {
      method: "POST",
      body: dataAdd,
    }).then(function (response) {
      response.text().then((resp) => {
        try {
          const objetoData = JSON.parse(resp);
          // console.log('objetoData - encuesta-siembra_datosTable :', objetoData);
          setInfoTable(objetoData);
        } catch (error) {
          console.error("Error al analizar la respuesta JSON:", error);
          //console.log("Respuesta no válida:", resp);
        }
      });
    });
  }, [
    idCli,
    selectedLote,
    cosechaSeleccionada,
    selectedCultivo,
    selectedAcosDesc,
    selectedEstado,
    upload,
    updateSelects
  ]);

  //! Para editar encuesta
  useEffect(() => {
    // console.log('infoEncuesta.idCliente: ', infoEncuesta.idCliente);
    // console.log('infoEncuesta.idEncuesta: ', infoEncuesta.idEncuesta);
    if (infoEncuesta.idCliente && infoEncuesta.idEncuesta) {
      // console.log('ENTRO')
      const dataAdd = new FormData();
      dataAdd.append("idU", usu);
      dataAdd.append("idC", parseInt(infoEncuesta.idCliente));
      dataAdd.append("idEnc", parseInt(infoEncuesta.idEncuesta));
      fetch(`${URL}encuesta-siembra_consultarEncuestaEditar.php`, {
        method: "POST",
        body: dataAdd,
      }).then(function (response) {
        response.json().then((resp) => {
          try {
            //console.log("Resp:", resp);
            setEditarEncuesta(resp);
            // setSelectedCosechaId(listCosechas.find(cosecha => cosecha.acos_id === resp[0]?.cos_id));
            setEncuestaSeleccionada({
              cosecha: listCosechas.find(
                (cosecha) => cosecha.acos_id === resp[0]?.cos_id
              ),
              cultivo: addEncCultivos.find(
                (cultivo) => cultivo.acult_id === resp[0]?.acult_id
              ),
              ciclo: resp[0]?.ciclo,
              rindeEst: resp[0]?.rindeest,
              superficie: resp[0]?.superficie,
              costoEst: resp[0]?.costoest,
              estado: resp[0]?.aencc_estado,
              idEncuesta: resp[0]?.aencc_id,
              idCliente: resp[0]?.cli_id,
              nombreCli: resp[0]?.cli_nombre,
            });

            // console.log('encuestaSeleccionada: ', encuestaSeleccionada);
          } catch (error) {
            console.error("Error al analizar la respuesta JSON:", error);
            console.log("Respuesta no válida:", resp);
          }
        });
      });
    }
  }, [infoEncuesta]);

  //! Para nuevo evento
  useEffect(() => {
    // console.log('infoEncuesta.idCliente: ', infoEncuesta.idCliente);
    // console.log('infoEncuesta.idEncuesta: ', infoEncuesta.idEncuesta);
    if (infoEncuestaEvent.idCliente && infoEncuestaEvent.idEncuesta) {
      // console.log('ENTRO')
      const dataAdd = new FormData();
      dataAdd.append("idU", usu);
      dataAdd.append("idC", parseInt(infoEncuestaEvent.idCliente));
      dataAdd.append("idEnc", parseInt(infoEncuestaEvent.idEncuesta));
      fetch(`${URL}encuesta-siembra_consultarEncuestaEditar.php`, {
        method: "POST",
        body: dataAdd,
      }).then(function (response) {
        response.json().then((resp) => {
          try {
            //console.log("Resp:", resp);
            // setEditarEncuesta(resp);
            setInfoEventoNew(resp);
            // setSelectedCosechaId(listCosechas.find(cosecha => cosecha.acos_id === resp[0]?.cos_id));
            setEncuestaSeleccionada({
              cosecha: listCosechas.find(
                (cosecha) => cosecha.acos_id === resp[0]?.cos_id
              ),
              cultivo: addEncCultivos.find(
                (cultivo) => cultivo.acult_id === resp[0]?.acult_id
              ),
              ciclo: resp[0]?.ciclo,
              rindeEst: resp[0]?.rindeest,
              superficie: resp[0]?.superficie,
              costoEst: resp[0]?.costoest,
              estado: resp[0]?.aencc_estado,
              idEncuesta: resp[0]?.aencc_id,
              idCliente: resp[0]?.cli_id,
              nombreCli: resp[0]?.cli_nombre,
            });

            // console.log('encuestaSeleccionada: ', encuestaSeleccionada);
          } catch (error) {
            console.error("Error al analizar la respuesta JSON:", error);
            console.log("Respuesta no válida:", resp);
          }
        });
      });
    }
  }, [infoEncuestaEvent]);

  //!

  //! Para ver Encuesta
  useEffect(() => {
    // console.log('infoVer.idCliente: ', infoVer.idCliente);
    // console.log('infoVer.idEncuesta: ', infoVer.idEncuesta);
    if (infoVer.idCliente && infoVer.idEncuesta) {
      //console.log('infoVer.idCliente: ', infoVer.idCliente);
      const dataAdd = new FormData();
      dataAdd.append("idEnc", parseInt(infoVer.idEncuesta));
      fetch(`${URL}encuesta-siembra_verEncuesta.php`, {
        method: "POST",
        body: dataAdd,
      }).then(function (response) {
        response.json().then((resp) => {
          try {
            setInfoVerEncuesta(resp);
          } catch (error) {
            console.error("Error al analizar la respuesta JSON:", error);
            console.log("Respuesta no válida:", resp);
          }
        });
      });
    }
  }, [infoVer]);

  //console.log("infoVerEncuesta: ", infoVerEncuesta);

  useEffect(() => {
    traeCultivos();
    traeClientes();
    // traeLotes();
  }, []);


  const paginationConfig = {
    pageSizeOptions: ["5"], // Opciones de cantidad de elementos por página
    defaultPageSize: 5, // Cantidad de elementos por página por defecto
    showSizeChanger: true, // Mostrar selector de cantidad de elementos por página
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} de ${total} registros`, // Texto que muestra la cantidad total de registros
  };

  return (
    <>
      <div style={{ userSelect: "none", position: "relative" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>
            <h1 className="titulos">ENCUESTA DE SIEMBRA</h1>
          </div>
          <div>
            {/* <PlusCircleOutlined title='Agregar Encuesta' className='btnAddCosecha' onClick={showModal} /> */}
            <Button
              type="primary"
              style={{ borderRadius: "0px", fontWeight: "500" }}
              onClick={showModal}
            >
              NUEVA ENCUESTA
            </Button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "90%", marginLeft:"20px" }}>
          <div className="contSubtitulo-cliente">
            <div style={{ marginLeft: "5px" }}>
              <h1 className="subtitulos">CLIENTE</h1>
            </div>
            <Select
              defaultValue={idCli === "0" && "TODOS"}
              // defaultValue={0}
              style={{ width: 250 }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children &&
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value) => setIdCli(value)}
            >
              {clientes &&
                clientes.length > 0 &&
                clientes.map((cliente) => (
                  <Select.Option key={cliente.cli_id} value={cliente.cli_id}>
                    {cliente.cli_nombre}
                  </Select.Option>
                ))}
            </Select>
          </div>
          <div className="contSubtitulo-cliente">
            <div style={{ marginLeft: "5px" }}>
              <h1 className="subtitulos">LOTES</h1>
            </div>
            {idCli === "0" ? (
              <Select
                defaultValue="TODOS"
                style={{ width: 250 }}
                onChange={(value) => setSelectedLote(value)}
                options={[
                  {
                    value: "todos",
                    label: "TODOS",
                  },
                  {
                    value: "sinLotes",
                    label: "SIN LOTES",
                  },
                ]}
              />
            ) : (
              <Select
                defaultValue="TODOS"
                style={{ width: 250 }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children &&
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                }
                onChange={(value) => setSelectedLote(value)}
              >
                {lotes &&
                  lotes.length > 0 &&
                  lotes.map((lote) => (
                    <Select.Option key={lote.alote_id} value={lote.alote_id}>
                      {lote.alote_nombre}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </div>
          <div className="contSubtitulo-cliente">
            <div style={{ marginLeft: "5px" }}>
              <h1 className="subtitulos">COSECHA</h1>
            </div>
            <Select
              defaultValue={selectedAcosDesc && selectedAcosDesc}
              style={{ width: 260 }}
              onChange={(value, option) => {
                const cosecha = listCosechas.find(
                  (c) => c.acos_id === option.key
                );
                setCosechaSeleccionada(cosecha.acos_id);
              }}
            >
              {listCosechas.length > 0 &&
                listCosechas.map((cosecha) => {
                  return (
                    <Select.Option
                      key={cosecha.acos_id} // Cambiar de cosecha.acos_desc a cosecha.acos_id
                      value={cosecha.acos_desc}
                    >
                      {cosecha.acos_desc}
                    </Select.Option>
                  );
                })}
            </Select>
          </div>
          <div className="contSubtitulo-cliente">
            <div style={{ marginLeft: "5px" }}>
              <h1 className="subtitulos">CULTIVO</h1>
            </div>
            <Select
              defaultValue="TODOS"
              style={{ width: 250 }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children &&
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value) => setSelectedCultivo(value)}
            >
              {cultivos.map((cultivo) => (
                <Select.Option key={cultivo.acult_id} value={cultivo.acult_id}>
                  {cultivo.acult_desc}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="contSubtitulo-cliente">
            <div style={{ marginLeft: "5px" }}>
              <h1 className="subtitulos">ESTADO</h1>
            </div>
            <Select
              defaultValue="ENCUESTA OK"
              style={{ width: 250 }}
              onChange={(value) => setSelectedEstado(value)}
              options={[
                { value: "todos", label: "TODOS" },
                { value: "3", label: "ENCUESTA OK" },
                { value: "0", label: "NO ENCUESTADO" },
                { value: "1", label: "NO ACCEDE" },
                { value: "2", label: "NO SIEMBRA" },
              ]}
            />
          </div>
        </div>
        <Modal
          title="NUEVA ENCUESTA"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={650}
          style={{ userSelect: "none", marginTop: "-70px" }}
        >
          <NuevaEncuesta />
        </Modal>
        <Modal
          title={`EDITAR ENCUESTA / ${encuestaSeleccionada.nombreCli}`}
          open={isModalOpenEdit}
          onOk={handleOkEdit}
          onCancel={handleCancelEdit}
          footer={null}
          width={650}
          style={{ userSelect: "none" }}
        >
          <EditarEncuesta />
        </Modal>
        <Modal
          title={`INFORMACIÓN ENCUESTA / ${infoVerEncuesta[0]?.cli_nombre}`}
          open={isModalOpenVerEncuesta}
          onOk={handleOkVerEncuesta}
          onCancel={handleCancelVerEncuesta}
          footer={null}
          width={700}
          style={{ userSelect: "none", marginTop: "-70px" }}
        >
          <VerEncuesta />
        </Modal>
        <Modal
          title={`NUEVO EVENTO / ${encuestaSeleccionada.nombreCli}`}
          open={isModalOpenEvent}
          onOk={handleOkEvent}
          onCancel={handleCancelEvent}
          footer={null}
          width={700}
          style={{ userSelect: "none" }}
        >
          <NuevoEvento />
        </Modal>
        <Drawer
          title={`LOTES ENCUESTA / ${nombreCliLote}`}
          placement="bottom"
          onClose={onClose}
          open={openDrawer}
          style={{marginTop:"-30px", height:"100vh"}}
        >
          {/* {console.log("lotesEncuestasKey: ", lotesEncuestasKey, "| dataLotes: ", dataLotes)} */}
          {openDrawer ? (
            <LotesEncuestas key={lotesEncuestasKey} data={dataLotes} />
          ): null} 
        </Drawer>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ display: "flex", flexDirection: "row", paddingTop: "5px" }}
          >
            <div
              className="grafico-container"
              style={{
                width: "33%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div>
                <h1 className="titulos">
                  SUP. ENCUESTADA: {totalSuperficie} HAS.
                </h1>
              </div>
              {cultivosSupEncuestadas.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <ResponsiveContainer className="" width="100%" height={260}>
                  <PieChart width={800} height={400}>
                    <Pie
                      data={cultivosSupEncuestadas && cultivosSupEncuestadas}
                      activeIndex={legendSupEncuestadas.activeIndex}
                      activeShape={renderActiveShape}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      onMouseEnter={onPieEnterSupEncuestadas}
                    >
                      {cultivosSupEncuestadas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.colors} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        Math.trunc(value).toLocaleString().replace(/,/g, ".")
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div
              className="grafico-container"
              style={{
                width: "33%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div>
                <h1 className="titulos">
                  PRODUCCION ESTIMADA: {totalProduccion} TT
                </h1>
              </div>
              {cultivosProdEncuestadas.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <ResponsiveContainer className="" width="100%" height={260}>
                  <PieChart width={800} height={400}>
                    <Pie
                      data={cultivosProdEncuestadas && cultivosProdEncuestadas}
                      activeIndex={legendProdEncuestadas.activeIndex}
                      activeShape={renderActiveShape}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      onMouseEnter={onPieEnterProdEncuestadas}
                    >
                      {cultivosProdEncuestadas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.colors} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        Math.trunc(value).toLocaleString().replace(/,/g, ".")
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div
              className="grafico-container"
              style={{
                width: "33%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div>
                <h1 className="titulos">COSTO ESTIMADO: U$S {totalCosto}</h1>
              </div>
              {cultivosCostoEncuestadas.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <ResponsiveContainer className="" width="100%" height={260}>
                  <PieChart width={800} height={400}>
                    <Pie
                      data={
                        cultivosCostoEncuestadas && cultivosCostoEncuestadas
                      }
                      activeIndex={legendCostoEncuestadas.activeIndex}
                      activeShape={renderActiveShape}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      onMouseEnter={onPieEnterCostoEncuestadas}
                    >
                      {cultivosCostoEncuestadas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.colors} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        Math.trunc(value).toLocaleString().replace(/,/g, ".")
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <Table
          columns={visibleColumns}
          dataSource={data}
          pagination={paginationConfig}
          size="small"
        />
        {drawerUpload ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
              height:"100%"
            }}
          >
            <iframe
              loading="lazy"
              src={`${URLDrawer}/tati/file_dos/?drawer=${drawerUpload}&modori_id=${modori}&filter_id=${filter}&usu_id=${usu}&generico_id=${generico}&cli_id=${cliEnc}`} // para usar local
              //src={`${URLDrawer}/duoc/file_dos/?drawer=${drawerUpload}&modori_id=${modori}&filter_id=${filter}&usu_id=${usu}&generico_id=${generico}&cli_id=${cliEnc}`} // para usar con resto de crm
              width={"100%"}
              height={"100%"}
              style={{ border: "none" }}
              title="drawer"
            ></iframe>
          </div>
        ) : null}
      </div>
    </>
  );
};
