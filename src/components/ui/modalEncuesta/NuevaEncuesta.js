import { Button, Checkbox, DatePicker, Form, Input, List, Radio, Select, message } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../context/GlobalContext';

export const NuevaEncuesta = () => {
    const URL = process.env.REACT_APP_URL;

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
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
        // cultivos,
        addEncCliente, setAddEncCliente,
        addEncCultivos, setAddEncCultivos,
        setIsModalOpen, isModalOpen,
        upload, setUpload,
    } = useContext(GlobalContext);
    const [loteEncuestaAdd, setLoteEncuestaAdd] = useState();
    const [lotesSeleccionados, setLotesSeleccionados] = useState([]);


    const [value, setValue] = useState(3);
    const [disabledInputs, setDisabledInputs] = useState(false);
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
        if (e.target.value === 0 || e.target.value === 1 || e.target.value === 2) {
            setDisabledInputs(true);
        } else {
            setDisabledInputs(false);
        }
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
                    setLotes(objetoData); // Establecer los nuevos lotes
                    setLotesSeleccionados([]); // Reiniciar los lotes seleccionados al obtener nuevos lotes
                });
            });
        } else {
            setLotes([]); // Establecer los lotes como vacíos
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
            // Parsear la fecha en formato GMT
            const fechaSiembra = new Date(values.fechaSiembra);
            // Obtener los componentes de la fecha
            const year = fechaSiembra.getFullYear();
            const month = String(fechaSiembra.getMonth() + 1).padStart(2, '0'); // El mes es base 0, por lo tanto se suma 1
            const day = String(fechaSiembra.getDate()).padStart(2, '0');
            // Formatear la fecha en el formato "yyyy-mm-dd"
            const fechaFormateada = `${year}-${month}-${day}`;

            const dataAdd = new FormData();
            dataAdd.append("usuid", usu);
            dataAdd.append("opciones", values.estado);
            dataAdd.append("newc_clienc", values.cliente);
            dataAdd.append("newc_lote", lotesSeleccionados);
            dataAdd.append("newc_cosa", values.cosecha);
            dataAdd.append("newc_cult", values.cultivo);
            dataAdd.append("newc_ciclo", values.ciclo);
            if (values.estado === 1 || values.estado === 2 || values.estado === 0) {
                dataAdd.append("newc_has", 0);
                dataAdd.append("newc_rinde", 0);
                dataAdd.append("newc_costo", 0);
            } else {
                dataAdd.append("newc_has", values.hasEst);
                dataAdd.append("newc_rinde", values.rinde);
                dataAdd.append("newc_costo", values.costo);
            }
            dataAdd.append("newc_fechas", fechaFormateada);
            dataAdd.append("newc_culta", values.cultivoAnterior);

            const response = await fetch(`${URL}encuesta-siembra_nuevaEncuesta.php`, {
                method: "POST",
                body: dataAdd,
            });
            if (response.ok) {
                const resp = await response.text();
                const data = resp;
                form.resetFields();
                message.success("Encuesta agregada exitosamente");
            } else {
                throw new Error("Error al agregar encuesta");
            }
        } catch (error) {
            console.log("Error: ", error);
            message.error("Error al agregar encuesta");
        } finally {
            form.resetFields();
            setIsModalOpen(false);
            setAddEncCliente(null);
            setUpload(!upload);
        }
    };

    useEffect(() => {
        form.resetFields();
        setLotes([]);
        setAddEncCliente(null);
    }, [isModalOpen]);

    return (
        <>
            {/* Renderizar el componente de mensaje */}
            {contextHolder}
            <Form form={form} onFinish={onSubmitAdd}>
                <div style={{ userSelect: 'none' }}>
                    <div>
                        <div>
                            <h1 className='subtitulos'>Estado</h1>
                        </div>
                        <div style={{ width: '100%' }}>
                            <Form.Item
                                name="estado"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor selecciona un estado",
                                    },
                                ]}
                                className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                            >
                                <Radio.Group onChange={onChange} value={value}>
                                    <Radio style={{ paddingRight: '15px' }} value={3}>ENCUESTA OK</Radio>
                                    <Radio style={{ paddingRight: '15px' }} value={0}>NO ENCUESTADO</Radio>
                                    <Radio style={{ paddingRight: '15px' }} value={1}>NO ACCEDE</Radio>
                                    <Radio value={2}>NO SIEMBRA</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                        <div>
                            <div>
                                <h1 className='subtitulos'>Cliente</h1>
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
                                        filterOption={(input, option) =>
                                            option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={handleSelectChange} // Utilizar la nueva función de cambio de selección
                                    >
                                        {clientes &&
                                            clientes.length > 0 &&
                                            clientes
                                                .filter(cliente => cliente.cli_id !== '0') // Filtrar el cliente con ID 0
                                                .map(cliente => (
                                                    <Select.Option key={cliente.cli_id} value={cliente.cli_id}>
                                                        {cliente.cli_nombre}
                                                    </Select.Option>
                                                ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h1 className='subtitulos'>Lote</h1>
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
                                    style={{ height: '170px', overflow: 'auto' }}
                                    size="small"
                                    bordered
                                    // dataSource={lotes}
                                    dataSource={lotes.length > 0 ? lotes : (addEncCliente ? [{ alote_id: "0", alote_nombre: "SIN LOTES" }] : [])}
                                    renderItem={(lote) => (
                                        <List.Item key={lote.alote_id}>
                                            <Checkbox
                                                value={lote.alote_id}
                                                checked={lotesSeleccionados.includes(lote.alote_id)}
                                                onChange={(e) => handleLoteChange(lote.alote_id, e.target.checked)}
                                            >
                                                {lote.alote_nombre}
                                            </Checkbox>
                                        </List.Item>
                                    )}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ paddingRight: '5px' }}>
                            <div>
                                <h1 className='subtitulos'>Cosecha</h1>
                            </div>
                            <div>
                                <Form.Item
                                    name="cosecha"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Por favor seleccione una cosecha",
                                        },
                                    ]}
                                    className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                                    initialValue={listCosechas.length > 0 ? listCosechas[0].acos_id : undefined}
                                >
                                    <Select
                                        style={{ width: 200, textAlign: 'right' }}
                                        onChange={(value) => setSelectedAcosDesc(value)}
                                    >
                                        {listCosechas.length > 0 &&
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
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                        <div style={{ paddingRight: '5px' }}>
                            <div>
                                <h1 className='subtitulos'>Cultivo</h1>
                            </div>
                            <div>
                                <Form.Item
                                    name="cultivo"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Por favor seleccione un cultivo",
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
                                            option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    // onChange={(value) => setAddEncCultivos(value)}
                                    >
                                        {addEncCultivos && addEncCultivos.length > 0 && addEncCultivos.map((cultivo) => (
                                            <Select.Option key={cultivo.acult_id} value={cultivo.acult_id}>
                                                {cultivo.acult_desc}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                        <div>
                            <div>
                                <h1 className='subtitulos'>Ciclo</h1>
                            </div>
                            <div>
                                <Form.Item
                                    name="ciclo"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Por favor seleccione un ciclo",
                                        },
                                    ]}
                                    className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                                >
                                    <Select
                                        // defaultValue="TODOS"
                                        style={{ width: 200 }}
                                        placeholder='SELECCIONE'
                                        // onChange={(value) => setSelectedEstado(value)}
                                        options={[
                                            { value: '1', label: '1°' },
                                            { value: '2', label: '2°' }
                                        ]}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ paddingRight: '5px' }}>
                            <div>
                                <h1 className='subtitulos'>Has. Estimadas</h1>
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
                                    <Input disabled={disabledInputs} style={{ width: 200, textAlign: 'right' }} defaultValue={disabledInputs ? 0 : undefined} />
                                </Form.Item>
                            </div>
                        </div>
                        <div style={{ paddingRight: '5px' }}>
                            <div>
                                <h1 className='subtitulos'>Rinde (TT)</h1>
                            </div>
                            <div>
                                <Form.Item
                                    name="rinde"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Por favor ingrese un valor",
                                        },
                                    ]}
                                    className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                                >
                                    <Input disabled={disabledInputs} style={{ width: 200, textAlign: 'right' }} defaultValue={disabledInputs ? 0 : undefined} />
                                </Form.Item>
                            </div>
                        </div>
                        <div>
                            <div>
                                <h1 className='subtitulos'>Costo (U$S)</h1>
                            </div>
                            <div>
                                <Form.Item
                                    name="costo"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Por favor ingrese un valor",
                                        },
                                    ]}
                                    className="hidden-asterisk" // Agregar esta línea para ocultar el asterisco
                                >
                                    <Input disabled={disabledInputs} style={{ width: 200, textAlign: 'right' }} defaultValue={disabledInputs ? 0 : undefined} />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ paddingRight: '5px' }}>
                            <div>
                                <h1 className='subtitulos'>Fecha de Siembra:</h1>
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
                                <h1 className='subtitulos'>Cultivo Anterior</h1>
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
                                            option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {addEncCultivos && addEncCultivos.length > 0 && addEncCultivos.map((cultivo) => (
                                            <Select.Option key={cultivo.acult_id} value={cultivo.acult_id}>
                                                {cultivo.acult_desc}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ paddingRight: '5px' }}>
                            <Button type="primary" htmlType="submitAdd">Guardar</Button>
                        </div>
                        <div>
                            <Button onClick={() => (form.resetFields(), setIsModalOpen(false))}>Cancelar</Button>
                        </div>
                    </div>

                </div>
            </Form >
        </>
    )
}