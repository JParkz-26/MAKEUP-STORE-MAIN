/*
  Warnings:

  - You are about to drop the `Proveedor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `Proveedor_Id` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `Proveedor_Id` on the `Compra` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Proveedor";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Categoria_Id" INTEGER NOT NULL,
    "Nombre" TEXT NOT NULL,
    "Descripcion" TEXT NOT NULL,
    "Marca_Id" INTEGER NOT NULL,
    "Costo" DECIMAL NOT NULL,
    "Precio" DECIMAL NOT NULL,
    "Inventario" INTEGER NOT NULL,
    CONSTRAINT "Producto_Categoria_Id_fkey" FOREIGN KEY ("Categoria_Id") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Producto_Marca_Id_fkey" FOREIGN KEY ("Marca_Id") REFERENCES "Marca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Producto" ("Categoria_Id", "Costo", "Descripcion", "Inventario", "Marca_Id", "Nombre", "Precio", "id") SELECT "Categoria_Id", "Costo", "Descripcion", "Inventario", "Marca_Id", "Nombre", "Precio", "id" FROM "Producto";
DROP TABLE "Producto";
ALTER TABLE "new_Producto" RENAME TO "Producto";
CREATE TABLE "new_Compra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Usuario_Id" INTEGER NOT NULL,
    "Costo_Total" DECIMAL NOT NULL,
    "Fecha_Compra" DATETIME NOT NULL,
    CONSTRAINT "Compra_Usuario_Id_fkey" FOREIGN KEY ("Usuario_Id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Compra" ("Costo_Total", "Fecha_Compra", "Usuario_Id", "id") SELECT "Costo_Total", "Fecha_Compra", "Usuario_Id", "id" FROM "Compra";
DROP TABLE "Compra";
ALTER TABLE "new_Compra" RENAME TO "Compra";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
