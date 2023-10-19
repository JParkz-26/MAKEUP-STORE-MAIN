import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Button, Form, Input, InputNumber, Layout, Menu, Modal, Popconfirm, Select, Space, Table, message } from 'antd';
import { ShopOutlined, ShoppingCartOutlined, ScheduleOutlined, SettingOutlined, MenuUnfoldOutlined, MenuFoldOutlined, EditOutlined, DeleteOutlined, LogoutOutlined } from '@ant-design/icons';
import Router, { useRouter } from 'next/router';
import axios from 'axios';
import electron from 'electron';
import { log } from 'console';

const { Header, Sider, Content } = Layout;
const ipcRenderer = electron.ipcRenderer;

  
  

function Configuracion() {
  function logout() {
    router.push("/login")
  }
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nombre',
      dataIndex: 'Nombre',
      key: 'Nombre',
    },
    {
      title: 'Descripcion',
      dataIndex: 'Descripcion',
      key: 'Descripcion',
    },
    {
      title: 'Costo',
      dataIndex: 'Costo',
      key: 'Costo',
    },
    {
      title: 'Precio',
      dataIndex: 'Precio',
      key: 'Precio',
    },
    {
      title: 'Inventario',
      dataIndex: 'Inventario',
      key: 'Inventario',
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
    var response = ipcRenderer.sendSync('deleteProduct',id );
    if(response){
      message.success('Borrado con exito');
      const response = ipcRenderer.sendSync('getAllProducts', '');
    setData(JSON.parse(response));
    } else {
      message.error("No se pudo borrar")
    }
    
  };
  
  const cancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.error('Click on No');
  };
  function showEdit(item): any {
    setIsEditingProduct(item)
    console.log(item);
    
    form.setFieldsValue({
      nombre: item.Nombre,
      descripcion: item.Descripcion,
      categoria: item.Categoria_Id,
      marca: item.Marca_Id,
      
      costo: item.Costo,
      precio: item.Precio,
      inventario: item.Inventario,
      id: item.id
    })
    
    
    showEditModal()
  }
  
  function borrar(): any {
   
  }
  const [data, setData] = useState(null)
  const [MenuData, setMenuData] = useState([
    {
      key: '1',
      icon: <ShopOutlined />,
      label: 'Ventas',
      onClick : () => {
        router.push("/ventas")
      }
    },
    {
      key: '2',
      icon: <ShoppingCartOutlined />,
      label: 'Compras',
      onClick : () => {
        router.push("/compras")
      }
    },
    {
      key: '3',
      icon: <ScheduleOutlined />,
      label: 'Inventario',
      onClick : () => {
        router.push("/inventario")
      }
    },
    
  ])
  const [CategoriaData, setCategoriaData] = useState([])
  const [MarcaData, setMarcaData] = useState([])
  

  const onFinish = async (values: any) => { 
      var response = ipcRenderer.sendSync('addProduct', JSON.stringify(values));
      if(response){
        message.success("Producto creado Correctamente.");
        const response = ipcRenderer.sendSync('getAllProducts', '');
        setData(JSON.parse(response));
      } else {
        message.error("Hubo un error, intente de nuevo");
      }
      setIsModalOpen(false)
  };

  
  const onFinishEdit = async (values: any) => { 
    var formVal = await form.validateFields()
    console.log(formVal);
     const response = ipcRenderer.sendSync('editProduct', JSON.stringify(formVal));
    if(response){
      message.success("Producto editado Correctamente.");
      const response = ipcRenderer.sendSync('getAllProducts', '');
      setData(JSON.parse(response));
    } else {
      message.error("Hubo un error, intente de nuevo");
    }
     setIsEditModalOpen(false)
};

  useEffect(() => {
    const user = JSON.parse(ipcRenderer.sendSync('getUserById', localStorage.getItem("Usuario")));
      if(user.user.Tipo_Usuario_Id == 1){
        console.log("Es Admin");
        setMenuData([{
          key: '1',
          icon: <ShopOutlined />,
          label: 'Ventas',
          onClick : () => {
            router.push("/ventas")
          }
        },
        {
          key: '2',
          icon: <ShoppingCartOutlined />,
          label: 'Compras',
          onClick : () => {
            router.push("/compras")
          }
        },
        {
          key: '3',
          icon: <ScheduleOutlined />,
          label: 'Inventario',
          onClick : () => {
            router.push("/inventario")
          }
        },
        {
          key: '4',
          icon: <SettingOutlined />,
          label: 'Configuracion',
          onClick : () => {
            router.push("/configuracion")
          },
  
        },])
      }
    const response = ipcRenderer.sendSync('getAllProducts', '');
    setData(JSON.parse(response));

    
    const responseMarca = ipcRenderer.sendSync('getAllMarcas', '');
    setMarcaData(JSON.parse(responseMarca).map(x => {return {label:x.Nombre,value:x.id}}));
    const responseCategoria = ipcRenderer.sendSync('getAllCategorias', '');
    setCategoriaData(JSON.parse(responseCategoria).map(x => {return {label:x.Nombre,value:x.id}}));
  
  },[])

    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter()
    const [form] = Form.useForm(); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setIsEditingProduct] = useState(null);
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
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}
        style={{
          
        }}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['3']}
            items={MenuData}
          />
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: 0}}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
            <Button onClick={() => logout()} style={{float:"right",margin: "16px 24px 16px 24px"}} icon={<LogoutOutlined />}/>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: "100vh",
            }}
          >

            <Button type="primary" onClick={showModal}>
                Agregar producto
            </Button>
            <Modal footer={null} title="Editar Producto" open={isEditModalOpen} onOk={handleEditOk} onCancel={handleEditCancel}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinishEdit}
                autoComplete="off"
                form={form}
                
            >
              <Form.Item
            hidden
                name="id"
            
                 >
            
            </Form.Item>
            <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Ingresa el nombre del producto' }]}
            
            >
            <Input />
            </Form.Item>
            <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[{ required: false, message: 'Ingresa la descripción del producto' }]}
            >
            <Input />
            </Form.Item>
            <Form.Item
            label="Categoria"
            name="categoria"
            rules={[{ required: true, message: 'Ingresa la categoria del producto' }]}
            >
            <Select 
            options={CategoriaData}
            />
            </Form.Item>
            <Form.Item
            label="Marca"
            name="marca"
            rules={[{ required: true, message: 'Ingresa la marca del producto' }]}
            >
            <Select 
            options={MarcaData}
            
            />
            </Form.Item>
           
            
            <Form.Item
            label="Costo"
            name="costo"
            rules={[{ required: true, message: 'Ingresa el costo del producto' }]}
            >
                <InputNumber addonAfter="$" />
            </Form.Item>
            <Form.Item
            label="Precio"
            name="precio"
            rules={[{ required: true, message: 'Ingresa el precio del producto' }]}
            >
                <InputNumber addonAfter="$" />
            </Form.Item>
            <Form.Item
            label="Inventario"
            name="inventario"
            rules={[{ required: true, message: 'Ingresa el inventario del producto' }]}
            >
                <InputNumber />
            </Form.Item>




    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit" >
        Editar
      </Button>
    </Form.Item>
            </Form>
            </Modal>

            <Modal footer={null} title="Agregar Producto" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                
            >
            <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Ingresa el nombre del producto' }]}
            >
            <Input />
            </Form.Item>
            <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[{ required: false, message: 'Ingresa la descripción del producto' }]}
            >
            <Input />
            </Form.Item>
            <Form.Item
            label="Categoria"
            name="categoria"
            rules={[{ required: true, message: 'Ingresa la categoria del producto' }]}
            >
            <Select 
            options={CategoriaData}
            />
            </Form.Item>
            <Form.Item
            label="Marca"
            name="marca"
            rules={[{ required: true, message: 'Ingresa la marca del producto' }]}
            >
            <Select 
            options={MarcaData}
            
            />
            </Form.Item>
            
            <Form.Item
            label="Costo"
            name="costo"
            rules={[{ required: true, message: 'Ingresa el costo del producto' }]}
            >
                <InputNumber addonAfter="$" />
            </Form.Item>
            <Form.Item
            label="Precio"
            name="precio"
            rules={[{ required: true, message: 'Ingresa el precio del producto' }]}
            >
                <InputNumber addonAfter="$" />
            </Form.Item>
            <Form.Item
            label="Inventario"
            name="inventario"
            rules={[{ required: true, message: 'Ingresa el inventario del producto' }]}
            >
                <InputNumber />
            </Form.Item>


          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" >
              Agregar
            </Button>
          </Form.Item>
            </Form>
            </Modal>

            <Table pagination={{pageSizeOptions:[10],}} dataSource={data} columns={columns} /> 

          </Content>
        </Layout>
      </Layout>
    );
};

export default Configuracion;




