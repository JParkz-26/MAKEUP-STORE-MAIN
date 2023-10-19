import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Alert, Avatar, Button, Card, Col, Form, Input, InputNumber, Layout, List, Menu, Modal, Row, Select, message } from 'antd';
import { ShopOutlined, ShoppingCartOutlined, ScheduleOutlined, SettingOutlined, MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Search from 'antd/lib/input/Search';
import electron from 'electron';
import { log } from 'console';
import Link from 'next/link';
const ipcRenderer = electron.ipcRenderer;
const { Header, Sider, Content } = Layout;
 interface car {
  product:any,
  cantidad:number,
  usuario:number
 }


function Configuracion() {
  function logout()  {
    router.push("/login")
  }
  function addCompra(){
    const response = ipcRenderer.sendSync('addCompra', carrito);
    console.log(response);
    if(response){
      message.success("Compra realizada con Exito")
      const response = ipcRenderer.sendSync('getAllProducts', '');
      setData(JSON.parse(response));
      setCarrito([] as car[])
    } else {
      message.error("Hubo un error. Intenta de Nuevo")
    }
    
  }
  function removeProductFromCart(index) {
      setCarrito(prevCart => {
          const updatedCart = [...prevCart];
          updatedCart.splice(index, 1); // Elimina el producto del carrito utilizando el índice
          return updatedCart; // Devuelve el nuevo estado del carrito
      });
  }
  const onFinish = async (values: any) => { 
    console.log(values);
    var carritoTemp = carrito
    if(carritoTemp.find(x => selectedProd.Nombre == x.product.Nombre)){
      message.error("El producto ya esta en el carrito")
      setIsModalOpen(false)
      return
    }
    carritoTemp.unshift({product:selectedProd,cantidad:values.Cantidad,usuario: parseInt( localStorage.getItem("Usuario"))})
    setCarrito(carritoTemp)
    setIsModalOpen(false)
};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProd, setSelectedProd] = useState({Inventario:0,Nombre:""});
  const onSearch = (value: string) => {
    const response = ipcRenderer.sendSync('getFilteredProducts', value);
    setData(JSON.parse(response));
  }
  const showModal = () => {
    setIsModalOpen(true);
  };

  function selectProduct(item) {
    
    setSelectedProd(item)
    showModal()
  };

  

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter()
    const [data, setData] = useState([])
    
    const [carrito, setCarrito] = useState([] as car[])
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
    }, [])
    
    return (
      
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>    
          
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['2']}
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
            
            <Row>
              <Col span={14}>
              <Search placeholder="input search text" allowClear onSearch={onSearch} style={{ width: 200 }} />
              <Link href="/comprasHistorial">Historial de Compras</Link>

              <Row>
             
              </Row>
              
              
              
              <List
              
              pagination={{pageSize:9,pageSizeOptions:[10]}}
              style={{marginTop:"16px"}}
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 4,
                  xl: 4,
                  xxl: 5,
                }}
                
                dataSource={data}
                renderItem={item => (
                  <><List.Item onClick={() => selectProduct(item)}>
                    
                    <Card 
                      size='small' className='cardHover' style={{ height: "200px" }}>
                      <h4>{item.Nombre}</h4>
                      <p>{item.Descripcion}</p>
                      <p> {"$" + item.Costo}</p>
                      <p> {"Existencia: " + item.Inventario}</p>
                    </Card>
                  </List.Item></>
                )}/>
      <Modal footer={null} title={selectedProd.Nombre} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                      <Form
                      
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: false }}
                        onFinish={onFinish}
                        autoComplete="off"

                      >
                        <Form.Item
                          label="cantidad"
                          name="Cantidad"
                          rules={[{ required: true, message: 'Ingresa la cantida que quieras agregar' }]}
                        >
                          <InputNumber min={1} value={1} max={20} defaultValue={1}  />
                        </Form.Item>


                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                          <Button type="primary" htmlType="submit">
                            Submit
                          </Button>
                        </Form.Item>
                      </Form>
                    </Modal>
              </Col>
              <Col span={10}>
                <h3 style={{textAlign:'center'}}>Carrito</h3>
                <div className='carrito'>
                  <div className='productos'>
                  <List
                 
                    itemLayout="horizontal"
                    dataSource={carrito}
                    renderItem={(item, index) => (
                      <List.Item style={{padding:"1px"}} >
                        <Card style={{width:"100%", lineHeight:"10px"}}>
                        <h4>{item.product.Nombre}</h4>
                        <p> {"Precio Unitario: $" + item.product.Costo}</p>
                        <p> {"Cantidad: " + item.cantidad}</p>
                        <p> {"Precio Total: $" + item.cantidad * item.product.Costo }</p>
                        <Button danger onClick={() => removeProductFromCart(index)}>Eliminar</Button>
                        </Card>
                      </List.Item>
                    )}
                  />
                  </div>
                  <div className='precioTotal'>
                      <h3>Total: $ {carrito.reduce((accumulator, object) => {
                        return accumulator + (object.cantidad * object.product.Costo);
                      }, 0)}</h3>
                      <h5>Cantidad de productos: {carrito.reduce((accumulator, object) => {
                        return accumulator + (object.cantidad);
                      }, 0)} </h5>
                      <Button type='primary' onClick={() => addCompra()}>Comprar</Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
};

export default Configuracion;