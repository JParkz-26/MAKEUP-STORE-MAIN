import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Button, Form, Input, InputNumber, Layout, Menu, Select, Table, Tabs, TabsProps } from 'antd';
import { ShopOutlined, ShoppingCartOutlined, ScheduleOutlined, SettingOutlined, MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import UsersTab from '../components/UsersTab';
import ProvidersTab from '../components/ProvidersTab';
import CategoryTab from '../components/CategoryTab';
import MarcasTab from '../components/MarcasTab';
import electron from 'electron';


const onChange = (key: string) => {
  
};
/*
{
    key: '2',
    label: `Proveedores`,
    children: (
      <ProvidersTab></ProvidersTab>
    ),
  },
*/
const ipcRenderer = electron.ipcRenderer;
const items: TabsProps['items'] = [
  {
    key: '1',
    label: `Usuarios`,
    children: (
      <UsersTab></UsersTab>
    ),
  },
  
  {
    key: '3',
    label: `Categorias`,
    children: (
      <CategoryTab></CategoryTab>
    ),
  },
  {
    key: '4',
    label: `Marcas`,
    children: (
      <MarcasTab></MarcasTab>
    ),
  },
];
const { Header, Sider, Content } = Layout;
function Configuracion() {
  
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
  }, [])
  
   
    const [collapsed, setCollapsed] = useState(false);
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
    function logout()  {
      router.push("/login")
    }
    const router = useRouter()
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['4']}
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
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </Content>
        </Layout>
      </Layout>
    );
};

export default Configuracion;
