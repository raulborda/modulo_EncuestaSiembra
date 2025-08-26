/* eslint-disable react-hooks/exhaustive-deps */
import { ConfigProvider, Spin, message } from "antd";
import esES from "antd/lib/locale/es_ES";
import "./App.css";
import { useEffect, useState } from "react";
import { GlobalContext } from "./components/context/GlobalContext";
import { EncuestaSiembra } from "./components/ui/EncuestaSiembra";

function App() {
  const URL = process.env.REACT_APP_URL;

  //! LOCAL
  //* Id de usuario que se obtiene desde local storage
  // const idUsu = 1; //.28
  // const idC = 2; // .153
  // const idC = 2083; //.28
  // const idC = 2049; //.28

  //! PRODUCCION
  //* Id de cliente que se obtine desde local storage
  const idUsu = localStorage.getItem("usuario");
  const idC = localStorage.getItem("cliSelect");

  const [usu, setUsu] = useState(idUsu);
  const [idCliente, setIdCliente] = useState(idC);

  const [messageApi, contextHolder] = message.useMessage();

  const [addSubmit, setAddSubmit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [isModalOpenEvent, setIsModalOpenEvent] = useState(false);
  const [isModalOpenVerEncuesta, setIsModalOpenVerEncuesta] = useState(false);
  const [selectedAcosDesc, setSelectedAcosDesc] = useState("");
  const [cosechaSeleccionada, setCosechaSeleccionada] = useState(null);
  const [cosechaAnterior, setCosechaAnterior] = useState("");
  const [infoCosechas, setCosechas] = useState([]);
  const [cosechaA, setCosechaA] = useState([]);
  const [listCosechas, setListCosechas] = useState([]);
  const [clientes, setClientes] = useState();
  const [lotes, setLotes] = useState([]);
  const [cultivos, setCultivos] = useState([]);
  const [addEncCliente, setAddEncCliente] = useState(null);
  const [addEncCultivos, setAddEncCultivos] = useState();
  const [infoEncuesta, setInfoEncuesta] = useState({});
  const [infoEncuestaEvent, setInfoEncuestaEvent] = useState({});
  const [editarEncuesta, setEditarEncuesta] = useState([]);
  const [infoEventoNew, setInfoEventoNew] = useState([]);
  const [infoVer, setInfoVer] = useState([]);
  const [infoVerEncuesta, setInfoVerEncuesta] = useState([]);
  const [dataLotes, setDataLotes] = useState({});

  const [upload, setUpload] = useState(false);

  const [selectedCosechaId, setSelectedCosechaId] = useState(null);
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState([]);
  const [cosInicial, setCosInicial] = useState("");

  //! reinicia selects encuesta
  const [updateSelects, setUpdatesSelects] = useState(false);
  const [updateGraph, setUpdateGraph] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Administrador
  const [isAdmin, setIsAdmin] = useState(false);

  // Parametros generales de CRM
  const [parametros, setParametros] = useState([]);

  // //* FUNCION QUE TRAE LOS DATOS DE COSECHA ACTIVA Y LAS QUE SE PUEDEN VISUALIZAR DEL CLIENTE
  function cosechas(idCliente) {
    const data = new FormData();
    data.append("idC", idCliente);
    fetch(`${URL}com_traerCosechas.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        setCosechas(objetoData);
        setCosechaA(objetoData[0].acos_desc);
        setListCosechas(objetoData);
        setCosechaSeleccionada(
          objetoData.length > 0 ? objetoData[0]?.acos_id : null
        );
        setSelectedAcosDesc(
          objetoData.length > 0 ? objetoData[0]?.acos_desc : null
        );
        setCosechaAnterior(
          objetoData.length > 0 ? objetoData[1]?.acos_desc : null
        );

        setCosInicial(objetoData.length > 0 ? objetoData[0]?.acos_id : null);
      });
    });
  }

  const fetchIsAdmin = async () => {
    const dataForm = new FormData();
    // console.log("idU", idUser)
    dataForm.append("idU", usu);

    const requestOptions = {
      method: 'POST',
      body: dataForm
    };

    const data = await fetch(`${URL}cam_isAdmin.php`, requestOptions);
    const jsonData = await data.json();
    setIsAdmin(jsonData?.isAdmin);
  };

  const fetchParametros = async () => {
    const requestOptions = {
      method: 'GET',
    };

    const data = await fetch(`${URL}getParametros.php`, requestOptions)

    const jsonData = await data.json();
    setParametros(jsonData);
  };

  useEffect(() => {
    cosechas(idCliente);
    fetchParametros();
  }, []);

  useEffect(() => {
    if (idCliente) {
      cosechas(idCliente);
    }
  }, [idCliente]);

  useEffect(() => {
    if (usu) {
      fetchIsAdmin()
        .catch(console.error);;
    }
  }, [usu])

  console.log("version modulo_EncuestaSiembra: 26.08.25.F"); 

  return (
    <GlobalContext.Provider
      value={{
        usu,
        setUsu,
        idCliente,
        setIdCliente,
        selectedAcosDesc,
        setSelectedAcosDesc,
        cosechaSeleccionada,
        setCosechaSeleccionada,
        infoCosechas,
        setCosechas,
        listCosechas,
        setListCosechas,
        cosechaA,
        setCosechaA,
        cosechaAnterior,
        setCosechaAnterior,
        clientes,
        setClientes,
        lotes,
        setLotes,
        cultivos,
        setCultivos,

        addEncCliente,
        setAddEncCliente,
        addEncCultivos,
        setAddEncCultivos,
        addSubmit,
        setAddSubmit,
        isModalOpen,
        setIsModalOpen,
        isModalOpenEdit,
        setIsModalOpenEdit,
        upload,
        setUpload,
        infoEncuesta,
        setInfoEncuesta,
        infoEncuestaEvent,
        setInfoEncuestaEvent,
        infoVer,
        setInfoVer,
        infoVerEncuesta,
        setInfoVerEncuesta,
        editarEncuesta,
        setEditarEncuesta,
        infoEventoNew,
        setInfoEventoNew,
        dataLotes,
        setDataLotes,

        selectedCosechaId,
        setSelectedCosechaId,
        encuestaSeleccionada,
        setEncuestaSeleccionada,
        isModalOpenEvent,
        setIsModalOpenEvent,
        isModalOpenVerEncuesta,
        setIsModalOpenVerEncuesta,

        updateSelects,
        setUpdatesSelects,
        updateGraph,
        setUpdateGraph,
        isLoading,
        setIsLoading,

        isAdmin,
        parametros,

        messageApi
      }}
    >
      <ConfigProvider
        locale={esES}
        theme={{
          token: {
            colorPrimary: "#56b43c",
          },
        }}
      >
        {contextHolder}
        {isLoading === true || selectedAcosDesc.length == 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <EncuestaSiembra
            listadoCosechas={listCosechas}
            cosechaActiva={cosechaA}
          />
        )}
      </ConfigProvider>
    </GlobalContext.Provider>
  );
}

export default App;
