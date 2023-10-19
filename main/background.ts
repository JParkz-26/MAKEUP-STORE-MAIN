import { app,ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

import { PrismaClient } from "@prisma/client";
import { log } from 'console';
const prisma = new PrismaClient();

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}


const fs = require('fs')


(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./login.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/login`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('getAllProducts', async (event, args) => {
    var products = await prisma.producto.findMany({include: {
      Marca:true,
      Categoria: true,
      
    }});
    
    event.returnValue = JSON.stringify(products);
});

ipcMain.on('addProduct', async (event, args) => {
  var props = JSON.parse(args)
  try {
    await prisma.producto.create({
      data:{
          Categoria_Id: props.categoria,
          Nombre: props.nombre,
          Descripcion: props.descripcion,
          Marca_Id: props.marca,
          Costo: props.costo,
          Precio: props.precio,
          Inventario: props.inventario
      }
     })

     event.returnValue = true;
  } catch (error) {
    event.returnValue = false;
  }
  

   
});

ipcMain.on('editProduct', async (event, args) => {
  var props = JSON.parse(args)
  try {
    await prisma.producto.update({
      where: {
        id: parseInt(props.id)
      },
      data:{
          Categoria_Id: props.categoria,
          Nombre: props.nombre,
          Descripcion: props.descripcion,
          Marca_Id: props.marca,
          
          Costo: props.costo,
          Precio: props.precio,
          Inventario: props.inventario
      }
     })

     event.returnValue = true;
  } catch (error) {
    event.returnValue = false;
  }
  

   
});

ipcMain.on('deleteProduct', async (event, args) => {
  var props = args
  try {
    await prisma.producto.delete(
      {
        where : {
          id: parseInt(props)
        } 
      }
    )

     event.returnValue = true;
  } catch (error) {
    event.returnValue = false;
  }
  

   
});

ipcMain.on('login', async (event,args) => {
    var props = JSON.parse(args)
    
  try {
    var user = await prisma.usuario.findFirst({
      where:{
              id : parseInt(props.userId),
              contrasena: props.contrasena
      }
     })
     
     if(user){
      event.returnValue = JSON.stringify({user:user, success:true});
     }  else  {
      event.returnValue = JSON.stringify({user:user, success:false});;
     }   

  } catch (error) {
    event.returnValue = JSON.stringify({user:user, success:false});;
  }
  

   
});

ipcMain.on('getAllUsers', async (event, args) => {
  var users = await prisma.usuario.findMany({include: {
    Tipo_Usuario:true
  }});
  
  event.returnValue = JSON.stringify(users);
});
ipcMain.on('getUserById', async (event, args) => {
  var props = parseInt(args)
  var users = await prisma.usuario.findFirst({
    where: {
      id: props
    },
    include: {
    Tipo_Usuario:true
  }});
  
  event.returnValue = JSON.stringify({user: users});
});

ipcMain.on('addUser', async (event, args) => {
  var props = JSON.parse(args)
  console.log(props);

  try {
  await prisma.usuario.create({
    data:{
        Tipo_Usuario_Id: parseInt(props.tipoUsuario),
        nombre: props.nombre,
        apellido: props.apellido,
        correo_electronico: props.correo,
        telefono: props.telefono,
        contrasena: props.contrasena
    }
   })
  console.log(props);

   event.returnValue = true;
  } catch (error) {
  console.log(error);
  event.returnValue = false;
  }


 
});
ipcMain.on('editUser', async (event, args) => {
  var props = JSON.parse(args)
  try {
    await prisma.usuario.update({
      where: {
        id: parseInt(props.id)
      },
      data:{
          Tipo_Usuario_Id: props.tipoUsuario,
          nombre: props.nombre,
          apellido: props.apellido,
          correo_electronico: props.correo,
          telefono: props.telefono,
          contrasena: props.contrasena
      }
     })

     event.returnValue = true;
  } catch (error) {
    event.returnValue = false;
  }
 
});
ipcMain.on('deleteUser', async (event, args) => {
  var props = args
  try {
    await prisma.usuario.delete(
      {
        where : {
          id: parseInt(props)
        } 
      }
    )

     event.returnValue = true;
  } catch (error) {
    event.returnValue = false;
  }


 
});

ipcMain.on('getFilteredProducts', async (event, args) => {

  var products = await prisma.producto.findMany({include: {
    Marca:true,
    Categoria: true,
    
  }});
  
  if(args != ""){
    products = products.filter(x => x.Nombre.toLowerCase().includes(args.toLowerCase()))
  }

  event.returnValue = JSON.stringify(products);
});


ipcMain.on('addSale', async (event, args) => {
//carrito son el argumento
  var props = args

  try {
     var precio_total = props.reduce((accumulator, object) => {
      return accumulator + (object.cantidad * object.product.Precio);
    }, 0)
    await prisma.venta.create({
      data:{
        
          Usuario_Id: props[0].usuario,
          Precio_Total: precio_total,
          Fecha_Venta: new Date(),
          
      }
     })
     const latestQuery = await prisma.venta.findMany({
      orderBy: {
          id: 'desc',
      },
      take: 1,
    })
    
    
for (let obj of props){
  console.log(obj);
  
  await prisma.detalle_Venta.create({
    data:{
        Venta_Id: latestQuery[0].id,
        Producto_Id: obj.product.id,
        Cantidad:obj.cantidad
    }
   })

   await prisma.producto.update({
    where:{
      id: obj.product.id
    },
    data:{
      Inventario: obj.product.Inventario - obj.cantidad
    }
   })
}


    
     event.returnValue = true;
  } catch (error) {
    console.log(error);
    
    event.returnValue = false;
  }

  //Falta restar el stock de los productos
});
ipcMain.on('addCompra', async (event, args) => {


  var props = args
 
  
  try {
     var precio_total = props.reduce((accumulator, object) => {
      return accumulator + (object.cantidad * object.product.Costo);
    }, 0)
    await prisma.compra.create({
      data:{
          Usuario_Id: props[0].usuario,
          Costo_Total: precio_total,
          Fecha_Compra: new Date(),
      }
     })
     const latestQuery = await prisma.compra.findMany({
      orderBy: {
          id: 'desc',
      },
      take: 1,
    })
    
    
for (let obj of props){
  console.log(obj);
  
  await prisma.detalle_Compra.create({
    data:{
        Compra_Id: latestQuery[0].id,
        Producto_Id: obj.product.id,
        Cantidad:obj.cantidad
    }
   })

   await prisma.producto.update({
    where:{
      id: obj.product.id
    },
    data:{
      Inventario: obj.product.Inventario + obj.cantidad
    }
   })
}


    
     event.returnValue = true;
  } catch (error) {
    console.log(error);
    
    event.returnValue = false;
  }

  //Falta restar el stock de los productos
});


ipcMain.on('getAllMarcas', async (event, args) => {
  var products = await prisma.marca.findMany();
  
  event.returnValue = JSON.stringify(products);
});
ipcMain.on('getAllCategorias', async (event, args) => {
  var products = await prisma.categoria.findMany();
  
  event.returnValue = JSON.stringify(products);
});



ipcMain.on('addMarca', async (event, args) => {
  var props = JSON.parse(args)
  console.log(props);

  try {
  await prisma.marca.create({
    data:{
      Nombre: props.nombre,
    }
   })
  console.log(props);

   event.returnValue = true;
  } catch (error) {
  console.log(error);
  event.returnValue = false;
  }


 
});
ipcMain.on('editMarca', async (event, args) => {
  var props = JSON.parse(args)
  try {
    await prisma.marca.update({
      where: {
        id: parseInt(props.id)
      },
      data:{
          Nombre: props.nombre
      }
     })

     event.returnValue = true;
  } catch (error) {
    event.returnValue = false;
  }
 
});
ipcMain.on('deleteMarca', async (event, args) => {
  var props = args
  try {
    await prisma.marca.delete(
      {
        where : {
          id: parseInt(props)
        } 
      }
    )

     event.returnValue = true;
  } catch (error) {
    event.returnValue = false;
  }


 
});

ipcMain.on('addCategoria', async (event, args) => {
  var props = JSON.parse(args)
  console.log(props);

  try {
  await prisma.categoria.create({
    data:{
        Nombre: props.nombre,
        Descripcion: props.descripcion
    }
   })
  console.log(props);

   event.returnValue = true;
  } catch (error) {
  console.log(error);
  event.returnValue = false;
  }


 
});
ipcMain.on('editCategoria', async (event, args) => {
  var props = JSON.parse(args)
  try {
    await prisma.categoria.update({
      where: {
        id: parseInt(props.id)
      },
      data:{
          Nombre: props.nombre,
          Descripcion: props.descripcion
      }
     })

     event.returnValue = true;
  } catch (error) {
    event.returnValue = false;
  }
 
});
ipcMain.on('deleteCategoria', async (event, args) => {
  var props = args
  try {
    await prisma.categoria.delete(
      {
        where : {
          id: parseInt(props)
        } 
      }
    )

     event.returnValue = true;
  } catch (error) {
    event.returnValue = false;
  }


 
});

ipcMain.on('getAllVentas', async (event, args) => {
  var products = await prisma.venta.findMany({
    orderBy: {
      Fecha_Venta: 'desc',
  },
    include: {
      Usuario:true,
      Detalle_Venta: {
        include: {
          Producto: {
            include: {
              Marca:true,
            Categoria: true
            }
          }
        }
      }
    }
  });
  
  event.returnValue = JSON.stringify(products);
});
ipcMain.on('getAllCompras', async (event, args) => {
  var products = await prisma.compra.findMany({
    orderBy: {
      Fecha_Compra: 'desc',
  },
    include: {
      Usuario:true,
      Detalle_Compra: {
        include: {
          Producto: {
            include: {
              Marca:true,
            Categoria: true
            }
          }
        }
      }
    }
  });
  
  event.returnValue = JSON.stringify(products);
});


