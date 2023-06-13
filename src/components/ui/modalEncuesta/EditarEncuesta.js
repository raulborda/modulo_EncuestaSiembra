import { Button, Checkbox, DatePicker, Form, Input, List, Radio, Select, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../context/GlobalContext';

export const EditarEncuesta = () => {
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
        isModalOpenEdit, setIsModalOpenEdit,
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


    const onSubmitEdit = async (values) => {
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
            setIsModalOpenEdit(false);
            setAddEncCliente(null);
            setUpload(!upload);
        }
    };

    useEffect(() => {
        form.resetFields();
    }, [isModalOpenEdit]);



    return (
        <>
            {/* Renderizar el componente de mensaje */}
            {contextHolder}
            <Form form={form} onFinish={onSubmitEdit}>
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
                                className="hidden-asterisk"
                            >
                                <List
                                    disabled={true}
                                    // className="custom-list"
                                    style={{ height: '170px', overflow: 'auto', pointerEvents: 'none', opacity: '4', backgroundColor: '#f5f5f5'}}
                                    size="small"
                                    bordered
                                    dataSource={lotes.length > 0 ? lotes : (addEncCliente ? [{ alote_id: "0", alote_nombre: "SIN LOTES" }] : [])}
                                    renderItem={(lote) => (
                                        <List.Item style={{color: '#0000003F'}} key={lote.alote_id}>
                                            {lote.alote_nombre}
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
                                    // disabled={true}
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
                                        disabled={true}
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
                                    // disabled={true}
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
                                        disabled={true}
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
                                    // disabled={true}
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
                                        disabled={true}
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
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ paddingRight: '5px' }}>
                            <Button type="primary" htmlType="submitAdd">Guardar</Button>
                        </div>
                        <div>
                            <Button onClick={() => (form.resetFields(), setIsModalOpenEdit(false))}>Cancelar</Button>
                        </div>
                    </div>
                </div>
            </Form >
        </>
    )
}
