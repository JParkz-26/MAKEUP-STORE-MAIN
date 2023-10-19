/*
  Warnings:

  - Added the required column `Tipo_Usuario_Id` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Categoria_Id" INTEGER NOT NULL,
    "Nombre" TEXT NOT NULL,
    "Descripcion" TEXT NOT NULL,
    "Marca_Id" INTEGER NOT NULL,
    "Proveedor_Id" INTEGER NOT NULL,
    "Costo" DECIMAL NOT NULL,
    "Precio" DECIMAL NOT NULL,
    "Inventario" INTEGER NOT NULL,
    CONSTRAINT "Producto_Categoria_Id_fkey" FOREIGN KEY ("Categoria_Id") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Producto_Marca_Id_fkey" FOREIGN KEY ("Marca_Id") REFERENCES "Marca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Producto_Marca_Id_fkey" FOREIGN KEY ("Marca_Id") REFERENCES "Proveedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Marca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT NOT NULL,
    "Descripcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT NOT NULL,
    "Correo_Electronico" TEXT NOT NULL,
    "Telefono" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Venta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Usuario_Id" INTEGER NOT NULL,
    "Precio_Total" DECIMAL NOT NULL,
    "Fecha_Venta" DATETIME NOT NULL,
    CONSTRAINT "Venta_Usuario_Id_fkey" FOREIGN KEY ("Usuario_Id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Detalle_Venta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Venta_Id" INTEGER NOT NULL,
    "Producto_Id" INTEGER NOT NULL,
    "Cantidad" INTEGER NOT NULL,
    CONSTRAINT "Detalle_Venta_Venta_Id_fkey" FOREIGN KEY ("Venta_Id") REFERENCES "Venta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Detalle_Venta_Producto_Id_fkey" FOREIGN KEY ("Producto_Id") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Usuario_Id" INTEGER NOT NULL,
    "Proveedor_Id" INTEGER NOT NULL,
    "Costo_Total" DECIMAL NOT NULL,
    "Fecha_Compra" DATETIME NOT NULL,
    CONSTRAINT "Compra_Usuario_Id_fkey" FOREIGN KEY ("Usuario_Id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Compra_Proveedor_Id_fkey" FOREIGN KEY ("Proveedor_Id") REFERENCES "Proveedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Detalle_Compra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Compra_Id" INTEGER NOT NULL,
    "Producto_Id" INTEGER NOT NULL,
    "Cantidad" INTEGER NOT NULL,
    CONSTRAINT "Detalle_Compra_Compra_Id_fkey" FOREIGN KEY ("Compra_Id") REFERENCES "Compra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Detalle_Compra_Producto_Id_fkey" FOREIGN KEY ("Producto_Id") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Tipo_Usuario_Id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo_electronico" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    CONSTRAINT "Usuario_Tipo_Usuario_Id_fkey" FOREIGN KEY ("Tipo_Usuario_Id") REFERENCES "Tipo_Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Usuario" ("apellido", "contrasena", "correo_electronico", "id", "nombre", "telefono") SELECT "apellido", "contrasena", "correo_electronico", "id", "nombre", "telefono" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_correo_electronico_key" ON "Usuario"("correo_electronico");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
