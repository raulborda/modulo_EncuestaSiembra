/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  List,
  Radio,
  Select,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";

export const NuevaEncuesta = () => {
  const URL = process.env.REACT_APP_URL;

  const [form] = Form.useForm();
  const {
    usu,
    listCosechas,
    clientes,
    addEncCultivos,
    setIsModalOpen,
    isModalOpen,
    upload,
    setUpload,
    updateSelects,
    setUpdatesSelects,
    loading,
    setIsLoading,
    messageApi,
  } = useContext(GlobalContext);
  const [loteEncuestaAdd, setLoteEncuestaAdd] = useState([]);
  const [lotesSeleccionados, setLotesSeleccionados] = useState([]);
  const [cultivoSeleccionado, setCultivoSeleccionado] = useState(null);

  const [addEncCliente, setAddEncCliente] = useState(null);

  const [cosechaSeleccionada, setCosechaSeleccionada] = useState(null);

  const [cicloSeleccionado, setCicloSeleccionado] = useState("0");

  const [dataRindes, setDataRindes] = useState({ rinde: null, costo: null });

  const [value, setValue] = useState(3);
  const [disabledInputs, setDisabledInputs] = useState(false);
  const onChange = (e) => {
    //console.log('radio checked', e.target.value);
    setValue(e.target.value);
    if (e.target.value === 0 || e.target.value === 1 || e.target.value === 2) {
      setDisabledInputs(true);
    } else {
      setDisabledInputs(false);
    }
  };

  const acceptOnlyNumber = (value) => {
    let valor = value.replace(",", ".");
    return valor;
  };

  useEffect(() => {
    if (addEncCliente) {
      const data = new FormData();
      data.append("idC", addEncCliente);
      fetch(`${URL}encuesta-siembra_listLotes.php`, {
        method: "POST",
        body: data,
      }).then(function (response) {
        response.text().then((resp) => {
          const data = resp;
          const objetoData = JSON.parse(data);
          // console.log("objetoData Nueva Encuesta - encuesta-siembra_listLotes: ", objetoData);
          setLoteEncuestaAdd(objetoData); // Establecer los nuevos lotes
          setLotesSeleccionados([]); // Reiniciar los lotes seleccionados al obtener nuevos lotes
        });
      });
    } else {
      setLoteEncuestaAdd([]); // Establecer los lotes como vacíos
      setLotesSeleccionados([]); // Establecer los lotes seleccionados como vacíos
    }
  }, [addEncCliente]);

  const handleSelectChange = (value) => {
    setAddEncCliente(value);
    setLotesSeleccionados([]); // Reiniciar los lotes seleccionados al cambiar de cliente
  };

  const handleLoteChange = (loteId, checked) => {
    if (checked) {
      // Agregar el lote seleccionado
      setLotesSeleccionados((prevLotesSeleccionados) => [
        ...prevLotesSeleccionados,
        loteId,
      ]);
    } else {
      // Quitar el lote deseleccionado
      setLotesSeleccionados((prevLotesSeleccionados) =>
        prevLotesSeleccionados.filter((id) => id !== loteId)
      );
    }
  };

  const onSubmitAdd = async (values) => {
    try {
      setIsLoading(true);
      // Parsear la fecha en formato GMT
      const fechaSiembra = new Date(values.fechaSiembra);
      // Obtener los componentes de la fecha
      const year = fechaSiembra.getFullYear();
      const month = String(fechaSiembra.getMonth() + 1).padStart(2, "0"); // El mes es base 0, por lo tanto se suma 1
      const day = String(fechaSiembra.getDate()).padStart(2, "0");
      // Formatear la fecha en el formato "yyyy-mm-dd"
      const fechaFormateada = `${year}-${month}-${day}`;

      if (
        cultivoSeleccionado == null ||
        cicloSeleccionado == null ||
        cosechaSeleccionada == null ||
        addEncCliente == null
      ) {
        return messageApi.info(
          "Es necesario que seleccione cliente, cosecha, cultivo y ciclo"
        );
      }

      const dataAdd = new FormData();
      dataAdd.append("usuid", usu);
      dataAdd.append("opciones", values.estado);
      dataAdd.append("newc_clienc", addEncCliente);
      dataAdd.append("newc_lote", lotesSeleccionados);
      dataAdd.append("newc_cosa", cosechaSeleccionada);
      dataAdd.append("newc_cult", cultivoSeleccionado);
      dataAdd.append("newc_ciclo", cicloSeleccionado);
      if (values.estado === 1 || values.estado === 2 || values.estado === 0) {
        dataAdd.append("newc_has", 0);
        dataAdd.append("newc_rinde", 0);
        dataAdd.append("newc_costo", 0);
      } else {
        dataAdd.append("newc_has", acceptOnlyNumber(values.hasEst));
        dataAdd.append("newc_rinde", dataRindes.rinde);
        dataAdd.append("newc_costo", dataRindes.costo);
      }
      //dataAdd.append("newc_fechas", fechaFormateada);
      //Como en FISA no hay necesidad de insertar la fechaFormateada, lo sacamos.
      dataAdd.append("newc_fechas", Date.now());

      dataAdd.append("newc_culta", values.cultivoAnterior);

      const response = await fetch(`${URL}encuesta-siembra_nuevaEncuesta.php`, {
        method: "POST",
        body: dataAdd,
      });
      if (response.ok) {
        const resp = await response.text();
        const data = resp;
        messageApi.success("Encuesta agregada exitosamente");
        setIsLoading(false);
        setUpdatesSelects(!updateSelects);
      } else {
        throw new Error("Error al agregar encuesta");
      }
    } catch (error) {
      console.log("Error: ", error);
      messageApi.error("Error al agregar encuesta");
      setIsLoading(false);
    } finally {
      form.resetFields();
      setIsModalOpen(false);
      setAddEncCliente(null);
      setUpload(!upload);
      setUpdatesSelects(!updateSelects);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    form.resetFields();
    setLoteEncuestaAdd([]);
    setCicloSeleccionado(null);
    setCosechaSeleccionada(null);
    setCultivoSeleccionado(null);
    setAddEncCliente(null);
  }, [isModalOpen]);

  const handleChangeCultivo = (v) => {
    setCultivoSeleccionado(v);
    if (["1", "3"].includes(v)) {
      setCicloSeleccionado("1");
    } else {
      setCicloSeleccionado("0");
    }
  };

  const fetchNuevaEncuesta = async () => {
    const response = await fetch(
      `${URL}encuesta-siembra_rindecosto.php?idcos=${cosechaSeleccionada}&idcul=${cultivoSeleccionado}&idcic=${cicloSeleccionado}&idcli=${addEncCliente}`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      const resp = await response.text();
      let data = resp;

      if (data) {
        data = JSON.parse(data);

        data = data?.[0];

        setDataRindes({ rinde: data.arinde, costo: data.acosto });
      }
    } else {
      messageApi.error("Ocurrió un error al actualizar rindes");
    }
  };

  useEffect(() => {
    if (
      cosechaSeleccionada &&
      cultivoSeleccionado &&
      cicloSeleccionado &&
      addEncCliente
    ) {
      fetchNuevaEncuesta();
    }
  }, [
    cosechaSeleccionada,
    cultivoSeleccionado,
    cicloSeleccionado,
    addEncCliente,
  ]);

  useEffect(() => {
    if (listCosechas?.length > 0) {
      setCosechaSeleccionada(listCosechas?.[0]?.acos_id);
    }
  }, []);

  return (
    <>
      <Form form={form} onFinish={onSubmitAdd}>
        <div style={{ userSelect: "none" }}>
          <div>
            <div>
              <h1 className="subtitulos">Estado</h1>
            </div>
            <div style={{ width: "100%" }}>
              <Form.Item
                name="estado"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona un estado",
                  },
                ]}
                className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                initialValue={3}
              >
                <Radio.Group onChange={onChange} value={value}>
                  <Radio style={{ paddingRight: "15px" }} value={3}>
                    ENCUESTA OK
                  </Radio>
                  {/* <Radio style={{ paddingRight: "15px" }} value={0}>
                    NO ENCUESTADO
                  </Radio>
                  <Radio style={{ paddingRight: "15px" }} value={1}>
                    NO ACCEDE
                  </Radio>
                  <Radio value={2}>NO SIEMBRA</Radio> */}
                </Radio.Group>
              </Form.Item>
            </div>
            <div>
              <div>
                <h1 className="subtitulos">Cliente</h1>
              </div>
              <div>
                <Form.Item
                  name="cliente"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione un cliente",
                    },
                  ]}
                  className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                >
                  <Select
                    // style={{ width: 300 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      return (
                        option.label &&
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={handleSelectChange} // Utilizar la nueva función de cambio de selección
                    options={clientes
                      ?.filter((cliente) => cliente.cli_id !== "0")
                      ?.map((cliente) => {
                        return {
                          value: cliente.cli_id,
                          label: cliente.cli_nombre,
                        };
                      })}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          {/* <div>
            <div>
              <h1 className="subtitulos">Lote</h1>
            </div>
            <div>
              <Form.Item
                name="lote"
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione al menos un lote",
                  },
                ]}
                className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
              >
                <List
                  className="custom-list"
                  style={{ height: "170px", overflow: "auto" }}
                  size="small"
                  bordered
                  // dataSource={lotes}
                  dataSource={
                    loteEncuestaAdd.length > 0
                      ? loteEncuestaAdd
                      : addEncCliente
                      ? [{ alote_id: "0", alote_nombre: "SIN LOTES" }]
                      : []
                  }
                  renderItem={(lote) => (
                    <List.Item key={lote.alote_id}>
                      <Checkbox
                        value={lote.alote_id}
                        checked={lotesSeleccionados.includes(lote.alote_id)}
                        onChange={(e) =>
                          handleLoteChange(lote.alote_id, e.target.checked)
                        }
                      >
                        {lote.alote_nombre}
                      </Checkbox>
                    </List.Item>
                  )}
                />
              </Form.Item>
            </div>
          </div> */}
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
            <div style={{ paddingRight: "5px" }}>
              <div>
                {/* <h1 className="subtitulos">Cosecha</h1> */}
                <h1 className="subtitulos">Campaña</h1>
              </div>
              <div>
                <Form.Item
                  className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                >
                  <Select
                    style={{ width: 200, textAlign: "right" }}
                    onChange={(value) => setCosechaSeleccionada(value)}
                    value={cosechaSeleccionada}
                    options={listCosechas.map((cosecha) => {
                      return {
                        value: cosecha.acos_id,
                        label: cosecha.acos_desc,
                      };
                    })}
                  />
                  {/* {listCosechas?.length > 0 &&
                      listCosechas.map((cosecha) => {
                        return (
                          <Select.Option
                            key={cosecha.acos_id}
                            value={cosecha.acos_id}
                          >
                            {cosecha.acos_desc}
                          </Select.Option>
                        );
                      })}
                  </Select> */}
                </Form.Item>
              </div>
            </div>
            <div style={{ paddingRight: "5px" }}>
              <div>
                {/* <h1 className="subtitulos">Cultivo</h1> */}
                <h1 className="subtitulos">Destino</h1>
              </div>
              <div>
                <Form.Item
                  // name="cultivo"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Por favor seleccione un cultivo",
                  //   },
                  // ]}
                  className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                >
                  <Select
                    // defaultValue='TODOS'
                    style={{ width: 200 }}
                    showSearch
                    optionFilterProp="children"
                    value={cultivoSeleccionado}
                    filterOption={(input, option) =>
                      option.children &&
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value) => handleChangeCultivo(value)}
                  >
                    {addEncCultivos &&
                      addEncCultivos.length > 0 &&
                      addEncCultivos.map((cultivo) => {
                        return (
                          <Select.Option
                            key={cultivo.acult_id}
                            value={cultivo.acult_id}
                          >
                            {cultivo.acult_desc}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/* <div>
              <div>
                <h1 className="subtitulos">Ciclo</h1>
              </div>
              <div>
                <Form.Item>
                  {cultivoSeleccionado === "1" ||
                  cultivoSeleccionado === "3" ? (
                    <Select
                      style={{ width: 200 }}
                      onChange={(value) => setCicloSeleccionado(value)}
                      value={cicloSeleccionado}
                      options={[
                        { value: "1", label: "1°" },
                        { value: "2", label: "2°" },
                      ]}
                    />
                  ) : (
                    <Select
                      style={{ width: 200 }}
                      onChange={(value) => setCicloSeleccionado(value)}
                      value={cicloSeleccionado}
                      options={[{ value: "0", label: " - " }]}
                    />
                  )}
                </Form.Item>
              </div>
            </div> */}
          </div>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
            <div style={{ paddingRight: "5px" }}>
              <div>
                {/* <h1 className="subtitulos">Has. Estimadas</h1> */}
                <h1 className="subtitulos">Litros</h1>
                </div>
              <div>
                <Form.Item
                  name="hasEst"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese un valor",
                    },
                  ]}
                  className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                >
                  <Input
                    type="number"
                    disabled={disabledInputs}
                    style={{ width: 200, textAlign: "right" }}
                    defaultValue={disabledInputs ? 0 : undefined}
                  />
                </Form.Item>
              </div>
            </div>
            {/* <div style={{ paddingRight: "5px" }}>
              <div>
                <h1 className="subtitulos">Rinde (TT)</h1>
              </div>
              <div>
                <Form.Item
                  className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                >
                  <Input
                    type="number"
                    // disabled={disabledInputs}
                    value={dataRindes.rinde}
                    style={{ width: 200, textAlign: "right" }}
                    onChange={(v) => {
                      setDataRindes((prevState) => {
                        return {
                          ...prevState,
                          rinde: acceptOnlyNumber(v.target.value),
                        };
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </div> */}
            <div>
              <div>
                <h1 className="subtitulos">Costo (U$S)</h1>
              </div>
              <div>
                <Form.Item
                  className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                >
                  <Input
                    type="number"
                    // disabled={disabledInputs}
                    style={{ width: 200, textAlign: "right" }}
                    value={dataRindes.costo}
                    onChange={(v) =>
                      setDataRindes((prevState) => {
                        return {
                          ...prevState,
                          costo: acceptOnlyNumber(v.target.value),
                        };
                      })
                    }
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          {/* <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ paddingRight: "5px" }}>
              <div>
                <h1 className="subtitulos">Fecha de Siembra:</h1>
              </div>
              <div>
                <Form.Item
                  name="fechaSiembra"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese una fecha",
                    },
                  ]}
                  className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                >
                  <DatePicker style={{ width: 200 }} />
                </Form.Item>
              </div>
            </div>
            <div>
              <div>
                <h1 className="subtitulos">Cultivo Anterior</h1>
              </div>
              <div>
                <Form.Item
                  name="cultivoAnterior"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el cultivo anterior",
                    },
                  ]}
                  className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                >
                  <Select
                    // defaultValue='TODOS'
                    style={{ width: 200 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children &&
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {addEncCultivos &&
                      addEncCultivos.length > 0 &&
                      addEncCultivos.map((cultivo) => (
                        <Select.Option
                          key={cultivo.acult_id}
                          value={cultivo.acult_id}
                        >
                          {cultivo.acult_desc}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </div> */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ paddingRight: "5px" }}>
              <Button
                type="primary"
                htmlType="submitAdd"
                style={{ borderRadius: "0px" }}
                loading={loading}
              >
                GUARDAR
              </Button>
            </div>
            <div>
              <Button
                style={{ borderRadius: "0px" }}
                onClick={() => (form.resetFields(), setIsModalOpen(false))}
              >
                CANCELAR
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};
