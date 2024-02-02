/* eslint-disable no-unused-vars */
/* eslint-disable no-sequences */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Input, List, Radio, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../context/GlobalContext';

export const EditarEncuesta = ({infoEncuesta}) => {
    const URL = process.env.REACT_APP_URL;

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const {
        usu,
        setAddEncCliente,
        isModalOpenEdit, 
        setIsModalOpenEdit,
        upload, setUpload,
        encuestaSeleccionada,
        updateGraph,
        setUpdateGraph,
    } = useContext(GlobalContext);


    const [value, setValue] = useState(3);
    const [disabledInputs, setDisabledInputs] = useState(false);
    const onChange = (e) => {
        //console.log('radio checked', e.target.value);
        setValue(e.target.value);

        if (e.target.value === 0 || e.target.value === 1 || e.target.value === 2) {
            form.setFieldsValue({
                hasEst: 0,
                rinde: 0,
                costo: 0
            });
        } else {
            form.setFieldsValue({
                hasEst: encuestaSeleccionada && encuestaSeleccionada.superficie,
                rinde: encuestaSeleccionada && encuestaSeleccionada.rindeEst,
                costo: encuestaSeleccionada && encuestaSeleccionada.costoEst,
            });
        }
    };


    const onSubmitEdit = async (values) => {
        try {
            //setIsLoading(true);
            const dataAdd = new FormData();
            dataAdd.append("usuid", usu);
            //console.log("encid: ", encuestaSeleccionada.idEncuesta);
            dataAdd.append("encid", encuestaSeleccionada.idEncuesta);
            dataAdd.append("opciones", values.estado);
            if (values.estado === 1 || values.estado === 2 || values.estado === 0) {
                dataAdd.append("newc_has", 0);
                dataAdd.append("newc_rinde", 0);
                dataAdd.append("newc_costo", 0);
            } else {
                dataAdd.append("newc_has", values.hasEst);
                // dataAdd.append("newc_rinde", values.rinde);
                dataAdd.append("newc_rinde", 0);
                dataAdd.append("newc_costo", values.costo);
            }

            const response = await fetch(`${URL}encuesta-siembra_editarEncuesta.php`, {
                method: "POST",
                body: dataAdd,
            });
            if (response.ok) {
                const resp = await response.text();
                const data = resp;
                form.resetFields();
                messageApi.success("Encuesta editada exitosamente");
                //setIsLoading(false);
            } else {
                throw new Error("Error al agregar encuesta");
            }
        } catch (error) {
            //console.log("Error: ", error);
            messageApi.error("Error al agregar encuesta");
            //setIsLoading(false);
        } finally {
            form.resetFields();
            setIsModalOpenEdit(false);
            setAddEncCliente(null);
            setUpload(!upload);
            setUpdateGraph(!updateGraph)
            // setUpdatesSelects(!updateSelects);
            // setIsLoading(false);
        }
    };

    useEffect(() => {
        form.resetFields();
    }, [isModalOpenEdit]);

    // infoEncuesta
    //console.log('encuestaSeleccionada.cosecha?.acos_desc', encuestaSeleccionada);
    return (
        <>
            {/* Renderizar el componente de mensaje */}
            {contextHolder}
            <Form form={form} onFinish={onSubmitEdit} >
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
                                className="hidden-asterisk"
                                // initialValue={encuestaSeleccionada && parseInt(encuestaSeleccionada.estado)}
                                initialValue={parseInt(infoEncuesta.estado?.key)}
                            >
                                <Radio.Group onChange={onChange} >
                                    <Radio style={{ paddingRight: '15px' }} value={3}>
                                        ENCUESTA OK
                                    </Radio>
                                    {/* <Radio style={{ paddingRight: '15px' }} value={0}>
                                        NO ENCUESTADO
                                    </Radio>
                                    <Radio style={{ paddingRight: '15px' }} value={1}>
                                        NO ACCEDE
                                    </Radio>
                                    <Radio value={2}>NO SIEMBRA</Radio> */}
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    </div>
                    {/* <div>
                        <div>
                            <h1 className='subtitulos'>Lote</h1>
                        </div>
                        <div>
                            <Form.Item
                                name="lote"
                            >
                                <List
                                    className='listLotesEditar'
                                    disabled={true}
                                    style={{
                                        height: '170px',
                                        overflow: 'auto',
                                        pointerEvents: 'none',
                                        opacity: '4',
                                        backgroundColor: '#f5f5f5'
                                    }}
                                    size="small"
                                    bordered
                                    dataSource={Object.values(editarEncuesta).map(item => item.alote_nombre)}
                                    renderItem={(lote) => (
                                        <List.Item style={{ color: '#0000003F' }} key={lote}>
                                            {lote}
                                        </List.Item>
                                    )}
                                />
                            </Form.Item>


                        </div>
                    </div> */}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-around" }}>
                        <div style={{ paddingRight: '5px' }}>
                            <div>
                                {/* <h1 className='subtitulos'>Cosecha</h1> */}
                                <h1 className='subtitulos'>Campaña</h1>
                            </div>
                            <div>
                                <Form.Item
                                    name="cosecha"
                                    // initialValue={encuestaSeleccionada && encuestaSeleccionada.cosecha?.acos_desc}
                                    initialValue={infoEncuesta?.acos_desc}
                                >
                                    <Input disabled={true} style={{ width: 200, textAlign: 'right' }} />
                                </Form.Item>


                            </div>
                        </div>
                        <div style={{ paddingRight: '5px' }}>
                            <div>
                                {/* <h1 className='subtitulos'>Cultivo</h1> */}
                                <h1 className='subtitulos'>Destino</h1>
                            </div>
                            <div>
                                <Form.Item
                                    // disabled={true}
                                    name="cultivo"
                                    // initialValue={encuestaSeleccionada && encuestaSeleccionada.cultivo?.acult_desc}
                                    initialValue={infoEncuesta?.cultivo}
                                >
                                    <Input disabled={true} style={{ width: 200, textAlign: 'right' }} />
                                </Form.Item>
                            </div>
                        </div>
                        {/* <div>
                            <div>
                                <h1 className='subtitulos'>Ciclo</h1>
                            </div>
                            <div>
                                <Form.Item
                                    // disabled={true}
                                    name="ciclo"
                                    initialValue={encuestaSeleccionada && `${encuestaSeleccionada.ciclo}°`}
                                >
                                    <Input disabled={true} style={{ width: 200, textAlign: 'right' }} />
                                </Form.Item>
                            </div>
                        </div> */}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-around" }}>
                        <div style={{ paddingRight: '5px' }}>
                            <div>
                                {/* <h1 className='subtitulos'>Has. Estimadas</h1> */}
                                <h1 className='subtitulos'>Litros</h1>
                            </div>
                            <div>
                                <Form.Item
                                    name="hasEst"
                                    // initialValue={value === 0 || value === 1 || value === 2 ? 0 : (encuestaSeleccionada && encuestaSeleccionada.superficie)}
                                    initialValue={value === 0 || value === 1 || value === 2 ? 0 : (infoEncuesta && infoEncuesta?.supEstimado)}
                                >
                                    <Input type="number" disabled={disabledInputs} style={{ width: 200, textAlign: 'right' }} />
                                </Form.Item>
                            </div>
                        </div>
                        {/* <div style={{ paddingRight: '5px' }}>
                            <div>
                                <h1 className='subtitulos'>Rinde (TT)</h1>
                            </div>
                            <div>
                                <Form.Item
                                    name="rinde"
                                    initialValue={value === 0 || value === 1 || value === 2 ? 0 : (encuestaSeleccionada && encuestaSeleccionada.rindeEst)}
                                >
                                    <Input disabled={disabledInputs} style={{ width: 200, textAlign: 'right' }} />
                                </Form.Item>
                            </div>
                        </div> */}
                        <div>
                            <div>
                                <h1 className='subtitulos'>Venta x Ltr (U$S)</h1>
                            </div>
                            <div>
                                <Form.Item
                                    name="costo"
                                    // initialValue={value === 0 || value === 1 || value === 2 ? 0 : (encuestaSeleccionada && encuestaSeleccionada.costoEst)}
                                    initialValue={value === 0 || value === 1 || value === 2 ? 0 : (infoEncuesta && infoEncuesta?.costoEstimado)}
                                >
                                    <Input type="number" disabled={disabledInputs} style={{ width: 200, textAlign: 'right' }} />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ paddingRight: '5px' }}>
                            <Button type="primary" htmlType="submitEdit" style={{borderRadius:"0px"}} >GUARDAR</Button>
                        </div>
                        <div>
                            <Button style={{borderRadius:"0px"}} onClick={() => (form.resetFields(), setIsModalOpenEdit(false))}>CANCELAR</Button>
                        </div>
                    </div>
                </div>
            </Form >
        </>
    )
}
