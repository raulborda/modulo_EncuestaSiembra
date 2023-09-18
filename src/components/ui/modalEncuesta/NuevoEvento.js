/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-sequences */
import { Button, Form, Input, Select, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import "./modalEncuesta.css";
import { GlobalContext } from "../../context/GlobalContext";

export const NuevoEvento = () => {
  const URL = process.env.REACT_APP_URL;
  const [form] = Form.useForm();
  const {
    setIsModalOpenEvent,
    isModalOpenEvent,
    setUpload,
    upload,
    usu,
    infoEventoNew,
  } = useContext(GlobalContext);

  const [valorSeleccionado, setValorSeleccionado] = useState("");

  const [messageApi, contextHolder] = message.useMessage();

  const handleSelectChange = (value) => {
    // console.log('value: ', value);
    setValorSeleccionado(value);
  };

  // console.log('infoEventoNew: ', infoEventoNew);
  const onSubmitAddEvent = async (values) => {
    try {
      const dataAdd = new FormData();
      dataAdd.append("idUsu", usu);
      dataAdd.append("idCli", infoEventoNew[0]?.cli_id);
      dataAdd.append("idEnc", infoEventoNew[0]?.aencc_id);
      dataAdd.append("newc_tipe", values.tipoEvento);

      if (parseInt(values.tipoEvento) === 0) {
        dataAdd.append("newc_rinde", parseInt(values.rindeReal));
        dataAdd.append("newc_acopio", 0);
        dataAdd.append("newc_cantd", 0);
        dataAdd.append("newc_destino", 0);
        dataAdd.append("newc_has", 0);
      } else if (parseInt(values.tipoEvento) === 1) {
        dataAdd.append("newc_rinde", 0);
        dataAdd.append("newc_acopio", parseInt(values.estAcopio));
        dataAdd.append("newc_cantd", 0);
        dataAdd.append("newc_destino", 0);
        dataAdd.append("newc_has", 0);
      } else if (parseInt(values.tipoEvento) === 2) {
        dataAdd.append("newc_rinde", 0);
        dataAdd.append("newc_acopio", 0);
        dataAdd.append("newc_cantd", 0);
        dataAdd.append("newc_destino", 0);
        dataAdd.append("newc_has", parseInt(values.supReal));
      } else {
        dataAdd.append("newc_rinde", 0);
        dataAdd.append("newc_acopio", 0);
        dataAdd.append("newc_cantd", parseInt(values.hectareas));
        dataAdd.append("newc_destino", parseInt(values.destino));
        dataAdd.append("newc_has", 0);
      }

      const response = await fetch(`${URL}encuesta-siembra_nuevoEvento.php`, {
        method: "POST",
        body: dataAdd,
      });
      if (response.ok) {
        const resp = await response.text();
        const data = resp;
        form.resetFields();
        messageApi.success("Evento agregado exitosamente");
      } else {
        throw new Error("Error al agregar evento");
      }
    } catch (error) {
      console.log("Error: ", error);
      messageApi.error("Error al agregar evento");
    } finally {
      form.resetFields();
      setIsModalOpenEvent(false);
      // setAddEncCliente(null);
      setUpload(!upload);
      setValorSeleccionado("");
    }
  };

  useEffect(() => {
    form.resetFields();
    setValorSeleccionado("");
  }, [isModalOpenEvent]);

  return (
    <>
      <Form form={form} onFinish={onSubmitAddEvent}>
        {contextHolder}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <div className="contSubtitulo-evento">
            <div style={{ marginLeft: "5px" }}>
              <h1 className="subtitulos">Tipo de Evento</h1>
            </div>
            <Form.Item
              name="tipoEvento"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione un tipo de evento",
                },
              ]}
              className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
            >
              <Select
                placeholder="SELECCIONE"
                value={valorSeleccionado}
                style={{
                  width: 200,
                }}
                onChange={handleSelectChange}
                options={[
                  {
                    value: "0",
                    label: "RINDE REAL",
                  },
                  {
                    value: "1",
                    label: "ESTIMADO ACOPIO",
                  },
                  {
                    value: "2",
                    label: "HECTAREAS REALES",
                  },
                  {
                    value: "3",
                    label: "DESTINO",
                  },
                ]}
              />
            </Form.Item>
          </div>

          {valorSeleccionado === "0" && (
            <div className="contSubtitulo-evento">
              <div style={{ marginLeft: "5px" }}>
                <h1 className="subtitulos">Rinde Real (TT)</h1>
              </div>
              <Form.Item
                name="rindeReal"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese un valor",
                  },
                ]}
                className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                initialValue={0}
              >
                <Input
                  style={{
                    width: 200,
                  }}
                />
              </Form.Item>
            </div>
          )}

          {valorSeleccionado === "1" && (
            // <select>
            //     <option>% Est. Acopio</option>
            //     {/* Otros options aquí */}
            // </select>
            <div className="contSubtitulo-evento">
              <div style={{ marginLeft: "5px" }}>
                <h1 className="subtitulos">% Est. Acopio</h1>
              </div>
              <Form.Item
                name="estAcopio"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese un valor",
                  },
                ]}
                className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                initialValue={0}
              >
                <Input
                  style={{
                    width: 200,
                  }}
                />
              </Form.Item>
            </div>
          )}

          {valorSeleccionado === "2" && (
            // <select>
            //     <option>Superficie Real (HAS)</option>
            //     {/* Otros options aquí */}
            // </select>
            <div className="contSubtitulo-evento">
              <div style={{ marginLeft: "5px" }}>
                <h1 className="subtitulos">Superficie Real (HAS)</h1>
              </div>
              <Form.Item
                name="supReal"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese un valor",
                  },
                ]}
                className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                initialValue={0}
              >
                <Input
                  style={{
                    width: 200,
                  }}
                />
              </Form.Item>
            </div>
          )}

          {valorSeleccionado === "3" && (
            <>
              <div className="contSubtitulo-evento">
                <div style={{ marginLeft: "5px" }}>
                  <h1 className="subtitulos">Destino</h1>
                </div>
                <Form.Item
                  name="destino"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione un tipo de destino",
                    },
                  ]}
                  className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                >
                  <Select
                    placeholder="SELECCIONE"
                    // value={valorSeleccionado}
                    style={{
                      width: 200,
                    }}
                    // onChange={handleSelectChange}
                    options={[
                      {
                        value: "1",
                        label: "Consumo",
                      },
                      {
                        value: "2",
                        label: "Semillas",
                      },
                      {
                        value: "3",
                        label: "Comercialización",
                      },
                    ]}
                  />
                </Form.Item>
              </div>

              <div className="contSubtitulo-evento">
                <div style={{ marginLeft: "5px" }}>
                  <h1 className="subtitulos">Hectáreas</h1>
                </div>
                <Form.Item
                  name="hectareas"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese un valor",
                    },
                  ]}
                  className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                  initialValue={0}
                >
                  <Input
                    style={{
                      width: 200,
                    }}
                  />
                </Form.Item>
              </div>
            </>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ paddingRight: "5px" }}>
            <Button
              type="primary"
              htmlType="submitAddEvent"
              style={{ borderRadius: "0px" }}
            >
              GUARDAR
            </Button>
          </div>
          <div>
            <Button
              style={{ borderRadius: "0px" }}
              onClick={() => (
                setIsModalOpenEvent(false),
                setValorSeleccionado(""),
                form.resetFields()
              )}
            >
              CANCELAR
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};
