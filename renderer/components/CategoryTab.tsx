import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, message } from 'antd'
import electron from 'electron';

import React, { useEffect, useState } from 'react'

const ipcRenderer = electron.ipcRenderer;


function CategoryTab() {
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
      title: 'Descripción',
      dataIndex: 'Descripcion',
      key: 'descripcion',
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
    var response = ipcRenderer.sendSync('deleteCategoria',id );
    if(response){
      message.success('Borrado con exito');
      const response = ipcRenderer.sendSync('getAllCategorias', '');
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
      descripcion: item.Descripcion,
      id: item.id,
    })
  }
    
    function onFinishEditUser(values: any): void {
      var response = ipcRenderer.sendSync('editCategoria', JSON.stringify(values));
      console.log(values);
      
    if(response){
      message.success("Categoria editada Correctamente.");
      const response = ipcRenderer.sendSync('getAllCategorias', '');
      setData(JSON.parse(response));
    } else {
      message.error("Hubo un error, intente de nuevo");
    }
    setIsEditModalOpen(false)
      
    }
    const [data, setData] = useState(null)
    
    function onFinishUser(values: any): void {
        var response = ipcRenderer.sendSync('addCategoria', JSON.stringify(values));
      if(response){
        message.success("Usuario creado Correctamente.");
        const response = ipcRenderer.sendSync('getAllCategorias', '');
        setData(JSON.parse(response));
      } else {
        message.error("Hubo un error, intente de nuevo");
      }
      setIsModalOpen(false)
        
      }
      useEffect(() => {
        const response = ipcRenderer.sendSync('getAllCategorias', '');
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
                Agregar Nueva Categoria
    </Button>
    <Modal footer={null} title="Nueva Categoria" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
              rules={[{ required: true, message: 'Ingresa el nombre de la nueva categoria' }]}
          >
              <Input />
          </Form.Item>
          <Form.Item
              label="Descripcion"
              name="descripcion"
              rules={[{ required: true, message: 'Ingresa la descripcion de la nueva categoria' }]}
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
      <Modal footer={null} title="Editar Categoria" open={isEditModalOpen} onOk={handleEditOk} onCancel={handleEditCancel}>
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
              hidden
              name="id"
              
          >
              
          </Form.Item>
          <Form.Item
              label="Nombre"
              name="nombre"
              rules={[{ required: true, message: 'Ingresa el nombre de la nueva categoria' }]}
          >
              <Input />
          </Form.Item>
          <Form.Item
              label="Descripcion"
              name="descripcion"
              rules={[{ required: true, message: 'Ingresa la descripcion de la nueva categoria' }]}
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
      <Table dataSource={data} columns={columns} />
      </>
  )
}

export default CategoryTab