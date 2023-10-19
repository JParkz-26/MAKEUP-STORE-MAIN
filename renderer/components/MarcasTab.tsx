import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, message } from 'antd'
import { log } from 'console';
import electron from 'electron';

import React, { useEffect, useState } from 'react'

const ipcRenderer = electron.ipcRenderer;


function MarcasTab() {
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nombre',
      dataIndex: 'Nombre',
      key: 'nombre',
    },
    {
      title: 'Accion',
      key: 'action',
      render: (_, item) => (
        <><Space size="middle">
          <Button onClick={() => showEdit(item)} icon={<EditOutlined />}></Button>
          <Popconfirm
            title="Estas seguro?"
            onConfirm={()=> confirm(item.id)}

            okText="Si"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space></>
      ),
    },
    
  ];
  const confirm = (id) => {
    var response = ipcRenderer.sendSync('deleteMarca',id );
    if(response){
      message.success('Borrado con exito');
      const response = ipcRenderer.sendSync('getAllMarcas', '');
      setData(JSON.parse(response));
    } else {
      message.error("No se pudo borrar")
    }
    
  };
  const [form] = Form.useForm(); 
  function showEdit(item): any {
    showEditModal()
    console.log(item);
    
    form.setFieldsValue({
      nombre: item.Nombre,
      id: item.id,
    })
  }
    const [data, setData] = useState(null)
    function onFinishEditUser(values: any): void {
      var response = ipcRenderer.sendSync('editMarca', JSON.stringify(values));
      console.log(values);
      
    if(response){
      message.success("Marca editada Correctamente.");
      const response = ipcRenderer.sendSync('getAllMarcas', '');
      setData(JSON.parse(response));
    } else {
      message.error("Hubo un error, intente de nuevo");
    }
    setIsEditModalOpen(false)
      
    }
    function onFinishUser(values: any): void {
        var response = ipcRenderer.sendSync('addMarca', JSON.stringify(values));
      if(response){
        message.success("Usuario creado Correctamente.");
        const response = ipcRenderer.sendSync('getAllMarcas', '');
        setData(JSON.parse(response));
      } else {
        message.error("Hubo un error, intente de nuevo");
      }
      setIsModalOpen(false)
        
      }
      useEffect(() => {
        const response = ipcRenderer.sendSync('getAllMarcas', '');
        setData(JSON.parse(response));
      },[])
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const showEditModal = () => {
      setIsEditModalOpen(true);
    };
  
    const handleEditOk = () => {
      setIsEditModalOpen(false);
    };
  
    const handleEditCancel = () => {
      setIsEditModalOpen(false);
    };
      
  return (
    
    <>
    <Button type="primary" onClick={showModal}>
                Agregar Nueva Marca
    </Button>
    <Modal footer={null} title="Nueva Marca" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
    <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinishUser}

          autoComplete="off"

      >
          <Form.Item
              label="Nombre"
              name="nombre"
              rules={[{ required: true, message: 'Ingresa el nombre de la nueva marca' }]}
          >
              <Input />
          </Form.Item>
          

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                  Submit
              </Button>
          </Form.Item>
      </Form>
    </Modal>
    <Modal footer={null} title="Editar Marca" open={isEditModalOpen} onOk={handleEditOk} onCancel={handleEditCancel}>
    <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinishEditUser}
          form={form}
          autoComplete="off"

      >
          <Form.Item
              label="Nombre"
              name="nombre"
              rules={[{ required: true, message: 'Ingresa el nombre de la nueva marca' }]}
          >
              <Input />
          </Form.Item>
          <Form.Item
              
              name="id"
              hidden
          >
              
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                  Submit
              </Button>
          </Form.Item>
      </Form>
    </Modal>
      <Table dataSource={data} columns={columns} />
      </>
  )
}

export default MarcasTab