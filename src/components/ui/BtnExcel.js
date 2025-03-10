import React from 'react'
import "./index.css";
import { Button } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import { Excel } from "antd-table-saveas-excel";
import dayjs from 'dayjs';

function BtnExcel({ columns, dataSource, saveAsName }) {

  // console.log('columns: ', columns);
  // console.log('dataSource: ', dataSource);

  const handleClick = () => {

    for (const cliente of dataSource) {
      if (!Number.isInteger(parseInt(cliente.cuenta))) {
        cliente.cuenta = "LEAD";
      }
    }
    const excel = new Excel();
    excel
      .addSheet("Hoja 1")
      .addColumns(columns) //parametro
      .addDataSource(dataSource, { //parametro
        str2Percent: true
      })
      .saveAs(`${saveAsName}_${dayjs().format("DDMMYYYY")}.xlsx`);

  };


  return (
    <div className='btn-export-contenedor'>
      <Button className='btn-export' onClick={handleClick} type='primary' icon={<FileExcelOutlined />} >Exportar</Button>
    </div>
  )
}

export default BtnExcel