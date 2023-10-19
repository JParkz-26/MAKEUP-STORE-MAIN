-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo_electronico" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tipo_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "Descripcion" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_electronico_key" ON "Usuario"("correo_electronico");
