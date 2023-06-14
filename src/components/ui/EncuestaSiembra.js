import React, { useContext, useEffect, useState } from 'react'
import './index.css';
import { Button, Empty, Modal, Select, Table, Tag } from 'antd';
import { GlobalContext } from '../context/GlobalContext';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';
import { EditOutlined, PlusCircleOutlined, ProfileOutlined } from '@ant-design/icons';
import { NuevaEncuesta } from './modalEncuesta/NuevaEncuesta';
import { EditarEncuesta } from './modalEncuesta/EditarEncuesta';

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

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
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value.toLocaleString()}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export const EncuestaSiembra = ({ cosechaActiva }) => {
  const URL = process.env.REACT_APP_URL;

  const {
    idCliente,
    usu,
    selectedAcosDesc,
    setSelectedAcosDesc,
    cosechaSeleccionada,
    listCosechas,
    clientes,
    setClientes,
    lotes,
    setLotes,
    // setSupEncuestadas,
    // supEncuestadas,
    cultivos, setCultivos,
    setAddEncCultivos,
    setCosechaSeleccionada,
    isModalOpen, setIsModalOpen,
    isModalOpenEdit, setIsModalOpenEdit,
    upload, setUpload,
    infoEncuesta, setInfoEncuesta,
    editarEncuesta, setEditarEncuesta,
  } = useContext(GlobalContext);

  const [idCli, setIdCli] = useState('0');
  const [selectedLote, setSelectedLote] = useState('todos');
  const [selectedCultivo, setSelectedCultivo] = useState("todos");
  const [selectedEstado, setSelectedEstado] = useState("todos");
  const [infoTable, setInfoTable] = useState([]);


  //! Inicio - Modal - Agregar
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModalEdit = () => {
    setIsModalOpenEdit(true);
  };
  const handleOkEdit = () => {
    setIsModalOpenEdit(false);
  };
  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
  };
  //! Fin - Modal - Agregar

  const columns = [
    {
      key: 'idCliente',
      width: '1%', // Ajustar el ancho de la columna
    },
    {
      key: 'idEncuesta',
      width: '1%', // Ajustar el ancho de la columna
    },
    {
      title: 'CLIENTE',
      dataIndex: 'cliente',
      key: 'cliente',
      width: '20%', // Ajustar el ancho de la columna
    },
    {
      title: 'CULTIVO/CICLO',
      dataIndex: 'cultivo',
      key: 'cultivo',
      width: '10%', // Ajustar el ancho de la columna
    },
    {
      title: 'SUP. EST. (HAS)',
      dataIndex: 'supEstimado',
      key: 'supEstimado',
      align: 'right',
      width: '10%', // Ajustar el ancho de la columna
    },
    {
      title: 'RINDE. EST. (TT)',
      dataIndex: 'rindeEstimado',
      key: 'rindeEstimado',
      align: 'right',
      width: '10%', // Ajustar el ancho de la columna
    },
    {
      title: 'COSTO. EST. (U$S)',
      dataIndex: 'costoEstimado',
      key: 'costoEstimado',
      align: 'right',
      width: '10%', // Ajustar el ancho de la columna
    },
    {
      title: 'ESTADO',
      key: 'estado',
      dataIndex: 'estado',
      align: 'center', // Centrar el contenido de la columna
      // width: 100, // Ajustar el ancho de la columna
      width: '10%', // Ajustar el ancho de la columna
    },
    {
      title: '...',
      dataIndex: 'botones',
      key: 'botones',
      align: 'center', // Centrar el contenido de la columna
      width: '10%', // Ajustar el ancho de la columna
      render: (_, record, index) => (
        <span>
          <EditOutlined
            style={{ paddingRight: '5px' }}
            className='btnEditEncuesta'
            onClick={() => handleEditClick(record, index)}
          />
          <ProfileOutlined className='btnNuevoEvento' />
        </span>
      ),
    },
  ];
  const visibleColumns = columns.slice(2); //En esta linea saco las dos primeras columnas para que no se visualicen

  const data = infoTable.map(item => {
    const cultivo = item.ciclo !== "0" ? item.acult_desc + ' / ' + item.ciclo + '°' : item.acult_desc;
    let estadoTag;
    switch (item.aencc_estado) {
      case "3":
        estadoTag = <Tag color="green" key={3}>OK</Tag>;
        break;
      case "2":
        estadoTag = <Tag color="red" key={2}>NS</Tag>;
        break;
      case "1":
        estadoTag = <Tag color="red" key={1}>NA</Tag>;
        break;
      case "0":
        estadoTag = <Tag color="red" key={2}>NE</Tag>;
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
      botones: '...',
    };
  });

  const handleEditClick = (record, index) => {
    // Aquí puedes acceder a los datos de la fila correspondiente
    console.log('Registro seleccionado:', record);
    // console.log('Índice de la fila:', index);

    // Puedes guardar los datos en el estado o realizar cualquier otra operación
    setInfoEncuesta(record);
    // console.log('Registro seleccionado - setInfoEncuesta:', infoEncuesta);

    // Abre el modal de edición
    showModalEdit();
  };




  //! GRAFICOS ENCUESTA SIEMBRA

  // const [cultivos, setCultivos] = useState([]);
  const [cultivosSupEncuestadas, setCultivosSupEncuestadas] = useState([]);
  const [cultivosProdEncuestadas, setCultivosProdEncuestadas] = useState([]);
  const [cultivosCostoEncuestadas, setCultivosCostoEncuestadas] = useState([]);
  const [legendSupEncuestadas, setLegendSupEncuestadas] = useState({ activeIndex: 0 });
  const [legendProdEncuestadas, setLegendProdEncuestadas] = useState({ activeIndex: 0 });
  const [legendCostoEncuestadas, setLegendCostoEncuestadas] = useState({ activeIndex: 0 });
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

  // const handleSelectChange = (value) => {
  //   setSelectedAcosDesc(value);
  // }



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
        const cultivosConTodos = [{ acult_id: "todos", acult_desc: "TODOS" }, ...objetoData];
        setCultivos(cultivosConTodos);
        setAddEncCultivos(objetoData);
      });
    });
  }

  function traeClientes() {
    const data = new FormData();
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


  // function traeLotes() {
  //   const data = new FormData();
  //   data.append("idC", idCli);
  //   fetch(`${URL}encuesta-siembre_listLotes.php`, {
  //     method: "POST",
  //     body: data,
  //   }).then(function (response) {
  //     response.text().then((resp) => {
  //       const data = resp;
  //       const objetoData = JSON.parse(data);
  //       const LotesConTodos = [{ alote_id: "TODOS", alote_nombre: "TODOS" }, ...objetoData];
  //       setLotes(LotesConTodos);
  //       console.log('objetoData - encuesta-siembra_listLotes: ', LotesConTodos)
  //     });
  //   });
  // }



  useEffect(() => {
    if (idCli) {
      console.log('idCli: ', idCli);
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
          const LotesConTodos = [{ alote_id: "todos", alote_nombre: "TODOS" }, { alote_id: "0", alote_nombre: "SIN LOTES" }, ...objetoData];
          // console.log('objetoData - encuesta-siembra_listLotes: ', objetoData);
          if (idCli === 0) {
            setLotes([]);
          } else {
            setLotes(LotesConTodos);
          }
          // setSelectedLote(null); // Reinicia el lote seleccionado
        });
      });
    }
  }, [idCli]);


  useEffect(() => {
    const dataAdd = new FormData();
    dataAdd.append("idU", usu);
    dataAdd.append("idC", idCliente);
    if (cosechaSeleccionada) {
      dataAdd.append("idCos", cosechaSeleccionada);
    } else {
      dataAdd.append("idCos", cosechaActiva);
    }
    if (selectedCultivo === 'TODOS') {
      dataAdd.append("idCul", '');
    } else {
      dataAdd.append("idCul", selectedCultivo);
    }
    fetch(`${URL}clientview_SupEncuestasCultivo.php`, {
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
        setCultivosSupEncuestadas(transformedData);


        // // Calcular el total de los valores
        // const total = transformedData.reduce((accumulator, currentValue) => {
        //   return accumulator + currentValue.value;
        // }, 0);
        // // Hacer algo con el total, como asignarlo a un estado
        // // setSupEncuestadas(total);
        // setTotalSuperficie(total.toLocaleString());
      });
    });
  }, [selectedCultivo, selectedAcosDesc])

  useEffect(() => {
    const dataAdd = new FormData();
    dataAdd.append("idU", usu);
    dataAdd.append("idC", idCliente);
    if (cosechaSeleccionada) {
      dataAdd.append("idCos", cosechaSeleccionada);
    } else {
      dataAdd.append("idCos", cosechaActiva);
    }
    if (selectedCultivo === 'TODOS') {
      dataAdd.append("idCul", '');
    } else {
      dataAdd.append("idCul", selectedCultivo);
    }
    fetch(`${URL}clientview_ProdEncuestasCultivo.php`, {
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



        // // Calcular el total de los valores
        // const total = transformedData.reduce((accumulator, currentValue) => {
        //   return accumulator + currentValue.value;
        // }, 0);
        // setTotalProduccion(total.toLocaleString());
      });
    });
  }, [selectedCultivo, selectedAcosDesc])

  useEffect(() => {
    const dataAdd = new FormData();
    dataAdd.append("idU", usu);
    dataAdd.append("idC", idCliente);
    if (cosechaSeleccionada) {
      dataAdd.append("idCos", cosechaSeleccionada);
    } else {
      dataAdd.append("idCos", cosechaActiva);
    }
    if (selectedCultivo === 'TODOS') {
      dataAdd.append("idCul", '');
    } else {
      dataAdd.append("idCul", selectedCultivo);
    }
    fetch(`${URL}clientview_CostoEncuestasCultivo.php`, {
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
        setCultivosCostoEncuestadas(transformedData);





        // // Calcular el total de los valores
        // const total = transformedData.reduce((accumulator, currentValue) => {
        //   return accumulator + currentValue.value;
        // }, 0);
        // setTotalCosto(total.toLocaleString());
      });
    });
  }, [selectedCultivo, selectedAcosDesc])


  useEffect(() => {
    const dataAdd = new FormData();
    dataAdd.append("idU", usu);
    dataAdd.append("idC", idCliente);
    if (cosechaSeleccionada) {
      dataAdd.append("idCos", cosechaSeleccionada);
    } else {
      dataAdd.append("idCos", cosechaActiva);
    }
    if (selectedCultivo === 'TODOS') {
      dataAdd.append("idCul", '');
    } else {
      dataAdd.append("idCul", selectedCultivo);
    }
    fetch(`${URL}clientview_CostoEncuestasCultivo.php`, {
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
        setCultivosCostoEncuestadas(transformedData);





        // // Calcular el total de los valores
        // const total = transformedData.reduce((accumulator, currentValue) => {
        //   return accumulator + currentValue.value;
        // }, 0);
        // setTotalCosto(total.toLocaleString());
      });
    });
  }, [selectedCultivo, selectedAcosDesc])





  useEffect(() => {
    const dataAdd = new FormData();
    dataAdd.append("idU", usu);
    dataAdd.append("idC", idCli);
    if (selectedLote === 'todos' || selectedLote === '' || selectedLote === -1) {
      // console.log('selectedLote: ', selectedLote);
      dataAdd.append("idLote", '');
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
    if (selectedCultivo === 'todos') {
      dataAdd.append("idCul", '');
    } else {
      dataAdd.append("idCul", selectedCultivo);
    }
    if (selectedEstado === 'todos') {
      dataAdd.append("idEst", '');
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
          console.error('Error al analizar la respuesta JSON:', error);
          console.log('Respuesta no válida:', resp);
        }
      });
    });
  }, [idCli, selectedLote, cosechaSeleccionada, selectedCultivo, selectedAcosDesc, selectedEstado, upload]);



  useEffect(() => {
    // console.log('infoEncuesta.idCliente: ', infoEncuesta.idCliente);
    // console.log('infoEncuesta.idEncuesta: ', infoEncuesta.idEncuesta);
    if (infoEncuesta.idCliente && infoEncuesta.idEncuesta) {
      console.log('ENTRO')
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
            console.log('Resp:', resp);
            setEditarEncuesta(resp);
            // const objetoData = JSON.parse(resp);
            // console.log('objetoData - encuesta-siembra_consultarEncuestaEditar :', objetoData);
            // setInfoTable(objetoData);
          } catch (error) {
            console.error('Error al analizar la respuesta JSON:', error);
            console.log('Respuesta no válida:', resp);
          }
        });
      });
    }
  }, [infoEncuesta]);



  //!


  useEffect(() => {
    traeCultivos();
    traeClientes();
    // traeLotes();
  }, [])

  return (
    <>
      <div style={{ userSelect: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <div>
            <h1 className='titulos'>
              ENCUESTA DE SIEMBRA
            </h1>
          </div>
          <div>
            <PlusCircleOutlined className='btnAddCosecha' onClick={showModal} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <div className='contSubtitulo-cliente'>
            <div style={{ marginLeft: '5px' }}>
              <h1 className='subtitulos'>
                CLIENTE
              </h1>
            </div>
            <Select
              defaultValue={idCli === '0' && 'TODOS'}
              // defaultValue={0}
              style={{ width: 300 }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value) => setIdCli(value)}
            >
              {clientes && clientes.length > 0 && clientes.map((cliente) => (
                <Select.Option key={cliente.cli_id} value={cliente.cli_id}>
                  {cliente.cli_nombre}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className='contSubtitulo-cliente'>
            <div style={{ marginLeft: '5px' }}>
              <h1 className='subtitulos'>
                LOTES
              </h1>
            </div>

            {idCli === '0' ? (
              <Select
                defaultValue="TODOS"
                style={{ width: 300 }}
                // showSearch
                // optionFilterProp="children"
                // filterOption={(input, option) =>
                //   option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // }
                onChange={(value) => setSelectedLote(value)}
                options={[
                  {
                    value: 'todos',
                    label: 'TODOS',
                  },
                  {
                    value: 'sinLotes',
                    label: 'SIN LOTES',
                  }
                ]}
              />
            ) : (
              <Select
                defaultValue="TODOS"
                style={{ width: 300 }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value) => setSelectedLote(value)}
              >
                {lotes && lotes.length > 0 && lotes.map((lote) => (
                  <Select.Option key={lote.alote_id} value={lote.alote_id}>
                    {lote.alote_nombre}
                  </Select.Option>
                ))}
              </Select>
            )}

          </div>
          <div className='contSubtitulo-cliente'>
            <div style={{ marginLeft: '5px' }}>
              <h1 className='subtitulos'>
                COSECHA
              </h1>
            </div>
            <Select
              defaultValue={selectedAcosDesc && selectedAcosDesc}
              style={{ width: 250 }}
              onChange={(value, option) => {
                const cosecha = listCosechas.find(c => c.acos_id === option.key);
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
          <div className='contSubtitulo-cliente'>
            <div style={{ marginLeft: '5px' }}>
              <h1 className='subtitulos'>
                CULTIVO
              </h1>
            </div>
            <Select
              defaultValue='TODOS'
              style={{ width: 300 }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
          <div className='contSubtitulo-cliente'>
            <div style={{ marginLeft: '5px' }}>
              <h1 className='subtitulos'>
                ESTADO
              </h1>
            </div>
            <Select
              defaultValue="TODOS"
              style={{ width: 250 }}
              onChange={(value) => setSelectedEstado(value)}
              options={[
                { value: 'todos', label: 'TODOS' },
                { value: '3', label: 'ENCUESTA OK' },
                { value: '0', label: 'NO ENCUESTADO' },
                { value: '1', label: 'NO ACCEDE' },
                { value: '2', label: 'NO SIEMBRA' },
              ]}
            />
          </div>
        </div>
        <Modal title="NUEVA ENCUESTA" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} width={650} style={{ userSelect: 'none' }}>
          <NuevaEncuesta />
        </Modal>
        <Modal title="EDITAR ENCUESTA" open={isModalOpenEdit} onOk={handleOkEdit} onCancel={handleCancelEdit} footer={null} width={650} style={{ userSelect: 'none' }}>
          <EditarEncuesta />
        </Modal>


        {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '5px' }}>
            <div style={{ width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>
                <h1 className='titulos'>
                  SUP. ENCUESTADA: {totalSuperficie} HAS.
                </h1>
              </div>
              {cultivosSupEncuestadas.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <ResponsiveContainer className="" width="100%" height={260}>
                  <PieChart width={800} height={400} >
                    <Pie
                      data={cultivosSupEncuestadas}
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div style={{ width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>
                <h1 className='titulos'>
                  PRODUCCION ESTIMADA: {totalProduccion} TT
                </h1>
              </div>
              {cultivosProdEncuestadas.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <ResponsiveContainer className="" width="100%" height={260}>
                  <PieChart width={800} height={400} >
                    <Pie
                      data={cultivosProdEncuestadas}
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div style={{ width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>
                <h1 className='titulos'>
                  COSTO ESTIMADO: U$S {totalCosto}
                </h1>
              </div>
              {cultivosCostoEncuestadas.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <ResponsiveContainer className="" width="100%" height={260}>
                  <PieChart width={800} height={400} >
                    <Pie
                      data={cultivosCostoEncuestadas}
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div> */}
        <div>
          <Table columns={visibleColumns} dataSource={data} size="small" />
        </div>
      </div>
    </>
  )
}
