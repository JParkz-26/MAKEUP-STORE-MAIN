import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Alert, Avatar, Button, Card, Col, Form, Input, InputNumber, Layout, List, Menu, Modal, Row, message } from 'antd';
import { ShopOutlined, ShoppingCartOutlined, ScheduleOutlined, SettingOutlined, MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Search from 'antd/lib/input/Search';
import electron from 'electron';
import Link from 'next/link';
import { generateTicket } from './ticketGenerator'; // Asegúrate de que la ruta sea correcta

const ipcRenderer = electron.ipcRenderer;
const { Header, Sider, Content } = Layout;

interface car {
    product: any;
    cantidad: number;
    usuario: number;
}

const IVA_RATE = 0.16; // Tasa de IVA del 16%

function Configuracion() {
    // ... (código anterior)

    function addSale() {
        // Calcular el precio total sin IVA
        const subtotal = carrito.reduce((accumulator, object) => {
            return accumulator + object.cantidad * object.product.Precio;
        }, 0);

        // Calcular el monto del IVA
        const ivaAmount = subtotal * IVA_RATE;

        // Calcular el precio total con IVA incluido
        const total = subtotal + ivaAmount;

        const response = ipcRenderer.sendSync('addSale', {
            carrito,
            subtotal,
            iva: ivaAmount,
            total,
        });

        console.log(response);

        if (response) {
            message.success("Venta realizada con Éxito");

            // Generar el ticket de venta
            const saleData = {
                products: carrito.map((item) => item.product.Nombre).join(', '),
                subtotal,
                iva: ivaAmount,
                total,
            };
            const ticket = generateTicket(saleData);

            // Mostrar el ticket en un cuadro de diálogo o en otro lugar según tus necesidades
            console.log(ticket); // Muestra el ticket en la consola (puedes implementar una vista personalizada en lugar de esto).

            // Limpiar el carrito después de la venta
            const response = ipcRenderer.sendSync('getAllProducts', '');
            setData(JSON.parse(response));
            setCarrito([] as car[]);
        } else {
            message.error("Hubo un error. Intenta de Nuevo");
        }
    }

    function generarTicketDeVenta(ventaDetails) {
        // Genera el contenido del ticket de venta aquí

        // Abre una ventana emergente para mostrar el ticket
        const printWindow = window.open('', '', 'width=600,height=600');
        printWindow.document.open();
        printWindow.document.write('<html><head><title>Ticket de Venta</title></head><body>');
        printWindow.document.write('<h1>Ticket de Venta</h1>');

        // Agrega detalles de la venta al ticket (puedes personalizar esto)
        printWindow.document.write('<h3>Detalles de la venta:</h3>');
        ventaDetails.carrito.forEach((item, index) => {
            printWindow.document.write(`<p>${item.cantidad} x ${item.product.Nombre}: $${item.cantidad * item.product.Precio}</p>`);
        });

        // Agrega el subtotal, IVA y total al ticket
        printWindow.document.write(`<p>Subtotal: $${ventaDetails.subtotal}</p>`);
        printWindow.document.write(`<p>IVA (${(IVA_RATE * 100).toFixed(0)}%): $${ventaDetails.iva}</p>`);
        printWindow.document.write(`<p>Total: $${ventaDetails.total}</p>`);

        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    }

    function removeProductFromCart(index) {
        setCarrito(prevCart => {
            const updatedCart = [...prevCart];
            updatedCart.splice(index, 1);
            return updatedCart;
        });
    }

    function logout() {
        router.push("/login")
    }

    const onFinish = async (values: any) => {
        console.log(values);
        var carritoTemp = carrito;
        if (carritoTemp.find(x => selectedProd.Nombre == x.product.Nombre)) {
            message.error("El producto ya está en el carrito")
            setIsModalOpen(false);
            return;
        }
        carritoTemp.unshift({ product: selectedProd, cantidad: values.Cantidad, usuario: parseInt(localStorage.getItem("Usuario")) });
        setCarrito(carritoTemp);
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProd, setSelectedProd] = useState({ Inventario: 0, Nombre: "" });
    const [MenuData, setMenuData] = useState([
        {
            key: '1',
            icon: <ShopOutlined />,
            label: 'Ventas',
            onClick: () => {
                router.push("/ventas")
            }
        },
        {
            key: '2',
            icon: <ShoppingCartOutlined />,
            label: 'Compras',
            onClick: () => {
                router.push("/compras")
            }
        },
        {
            key: '3',
            icon: <ScheduleOutlined />,
            label: 'Inventario',
            onClick: () => {
                router.push("/inventario")
            }
        },
    ]);
    const onSearch = (value: string) => {
        const response = ipcRenderer.sendSync('getFilteredProducts', value);
        setData(JSON.parse(response));
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    function selectProduct(item) {

        setSelectedProd(item);
        showModal();
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const [data, setData] = useState([]);
    const [carrito, setCarrito] = useState([] as car[]);
    useEffect(() => {
        const user = JSON.parse(ipcRenderer.sendSync('getUserById', localStorage.getItem("Usuario")));
        if (user.user.Tipo_Usuario_Id == 1) {
            console.log("Es Admin");
            setMenuData([
                {
                    key: '1',
                    icon: <ShopOutlined />,
                    label: 'Ventas',
                    onClick: () => {
                        router.push("/ventas")
                    }
                },
                {
                    key: '2',
                    icon: <ShoppingCartOutlined />,
                    label: 'Compras',
                    onClick: () => {
                        router.push("/compras")
                    }
                },
                {
                    key: '3',
                    icon: <ScheduleOutlined />,
                    label: 'Inventario',
                    onClick: () => {
                        router.push("/inventario")
                    }
                },
                {
                    key: '4',
                    icon: <SettingOutlined />,
                    label: 'Configuracion',
                    onClick: () => {
                        router.push("/configuracion")
                    },
                },
            ]);
        }
        const response = ipcRenderer.sendSync('getAllProducts', '');
        setData(JSON.parse(response));
    }, []);

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={MenuData}
                />
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: 0 }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                    <Button onClick={() => logout()} style={{ float: "right", margin: "16px 24px 16px 24px" }} icon={<LogoutOutlined />} />
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
                            <Link href="/ventasHistorial">Historial de Ventas</Link>
                            <List
                                pagination={{ pageSize: 9, pageSizeOptions: [10] }}
                                style={{ marginTop: "16px" }}
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
                                            size="small" className='cardHover' style={{ height: "200px" }}>
                                            <h4>{item.Nombre}</h4>
                                            <p>{item.Descripcion}</p>
                                            <p> {"$" + item.Precio}</p>
                                            <p> {"Existencia: " + item.Inventario}</p>
                                        </Card>
                                    </List.Item></>
                                )} />
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
                                        label="Cantidad"
                                        name="Cantidad"
                                        rules={[{ required: true, message: 'Ingresa la cantidad que quieras agregar' }]}
                                    >
                                        <InputNumber min={1} value={1} max={selectedProd.Inventario || 0} defaultValue={1} />
                                    </Form.Item>
                                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                        <Button type="primary" htmlType="submit">
                                            Agregar al Carrito
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </Col>
                        <Col span={10}>
                            <h3 style={{ textAlign: 'center' }}>Carrito</h3>
                            <div className='carrito'>
                                <div className='productos'>
                                    <List
                                        pagination={{ pageSizeOptions: [10] }}
                                        itemLayout="horizontal"
                                        dataSource={carrito}
                                        renderItem={(item, index) => (
                                            <List.Item style={{ padding: "1px" }} >
                                                <Card style={{ width: "100%", lineHeight: "10px" }}>
                                                    <h4>{item.product.Nombre}</h4>
                                                    <p> {"Precio Unitario: $" + item.product.Precio}</p>
                                                    <p> {"Cantidad: " + item.cantidad}</p>
                                                    <p> {"Precio Total: $" + item.cantidad * item.product.Precio}</p>
                                                    <Button danger onClick={() => removeProductFromCart(index)}>Eliminar</Button>
                                                </Card>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                                <div className='precioTotal'>
                                    <h3>Total: $ {carrito.reduce((accumulator, object) => {
                                        return accumulator + (object.cantidad * object.product.Precio);
                                    }, 0)}</h3>
                                    <h5>Cantidad de productos: {carrito.reduce((accumulator, object) => {
                                        return accumulator + (object.cantidad);
                                    }, 0)} </h5>
                                    <Button type='primary' onClick={() => addSale()}>Vender</Button>
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
