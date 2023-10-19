import React from 'react';
import styles from '../styles/login.module.css';
import Head from 'next/head';
import Link from 'next/link';
import {
    Button,
    Checkbox,
    Form,
  Input,
  Layout,
  message,
  Result} from 'antd';
import Router, { useRouter } from 'next/router';
import axios from 'axios';
import electron from 'electron';

const ipcRenderer = electron.ipcRenderer;
const {
  Content,
} = Layout;
const _ = require("lodash")
const onFinish = async (values: any) => {
   
    var response = ipcRenderer.sendSync('login', JSON.stringify(values));
    response = JSON.parse(response)
    console.log(response);
    
    if(response.success){
      localStorage.setItem("Usuario", response.user.id)
      Router.push("/ventas")
    } else {
      message.error("Las credenciales ingresadas no son correctas.")
    }
    
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  

function Login() {

    const router = useRouter()
  return (
    <React.Fragment>
      <Head>
        <title>login</title>
      </Head>
      <div className='loginBG'>
      <Content  style={{ padding: 100, display:"flex", height:"100vh"}}>
        <div className='loginLogo' style={{width:"50%"}}>

        </div>
        <div className='login' style={{width:"50%", display:"flex",alignContent:"center",justifyContent:"center"}}>
        <Form
        name="basic"
        layout="vertical"
        labelCol={{ span: 20 }}
        wrapperCol={{ span: 24}}
        style={{ maxWidth: 600, margin:"auto" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
    <Form.Item
    style={{textAlign:"center"}}
      label="Numero de Empleado"
      name="userId"
      rules={[{ required: true, message: 'Ingresa tu numero de empleado!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Contraseña"
      name="contrasena"
      rules={[{ required: true, message: 'Ingresa tu contraseña!' }]}
    >
      <Input.Password />
    </Form.Item>


    <Form.Item style={{margin:"auto"}} wrapperCol={{  span: 16 }}>
      <Button type="primary" htmlType="submit" className={styles.blueColor}>
        Iniciar Sesion
      </Button>
    </Form.Item>
      </Form>
        </div>
        
      </Content>
      </div>
    </React.Fragment>
  );
};

export default Login;