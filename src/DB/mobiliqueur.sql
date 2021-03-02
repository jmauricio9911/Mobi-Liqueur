-- -----------------------------------------------------
-- Base de datos mobiliqueur
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS mobiliqueur DEFAULT CHARACTER SET utf8;
USE mobiliqueur;

-- -----------------------------------------------------
-- Tabla Rol
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Rol (
  idRol INT NOT NULL,
  TipoRol VARCHAR(45) NOT NULL,
  PRIMARY KEY (idRol));

CREATE UNIQUE INDEX TipoRol ON Rol (TipoRol);
CREATE UNIQUE INDEX idRol ON Rol (idRol);


-- -----------------------------------------------------
-- Tabla Usuario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Usuario (
  idUsuario INT NOT NULL,
  Nombre VARCHAR(45) NOT NULL,
  Edad TINYINT(2) NOT NULL,
  Correo VARCHAR(45) NOT NULL,
  Celular INT NOT NULL,
  Estado TINYINT NOT NULL,
  Rol_idRol INT NOT NULL,
  PRIMARY KEY (idUsuario),
  CONSTRAINT fk_Usuario_Rol1
    FOREIGN KEY (Rol_idRol)
    REFERENCES Rol(idRol)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE UNIQUE INDEX idUsuario ON Usuario (idUsuario);
CREATE INDEX fk_Usuario_Rol1_idx ON Usuario (Rol_idRol);


-- -----------------------------------------------------
-- Tabla Producto
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Producto (
  idProducto INT NOT NULL,
  Nombre VARCHAR(45) NOT NULL,
  Cantidad INT NOT NULL,
  ValorUnitario INT NOT NULL,
  FechaVencimiento DATETIME NOT NULL,
  Estado TINYINT NOT NULL,
  Fabricante_idFabricante INT NOT NULL,
  PRIMARY KEY (idProducto));

CREATE UNIQUE INDEX idProducto ON Producto (idProducto);
CREATE UNIQUE INDEX Nombre ON Producto (Nombre);


-- -----------------------------------------------------
-- Tabla Cliente
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Cliente (
  idCliente INT NOT NULL,
  Nombre VARCHAR(45) NOT NULL,
  Direccion VARCHAR(45) NOT NULL,
  Correo VARCHAR(45) NOT NULL,
  Telefono INT NOT NULL,
  PRIMARY KEY (idCliente));

CREATE UNIQUE INDEX idCliente ON Cliente (idCliente);


-- -----------------------------------------------------
-- Tabla Venta
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Venta (
  idFactura INT NOT NULL AUTO_INCREMENT,
  Fecha DATE NOT NULL,
  Total INT NOT NULL,
  Observacion VARCHAR(45) NULL,
  Cliente_idCliente INT NOT NULL,
  PRIMARY KEY (idFactura),
  CONSTRAINT fk_Venta_Cliente1
    FOREIGN KEY (Cliente_idCliente)
    REFERENCES Cliente (idCliente)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE UNIQUE INDEX idFactura ON Venta (idFactura);
CREATE INDEX fk_Venta_Cliente1_idx ON Venta (Cliente_idCliente);


-- -----------------------------------------------------
-- Tabla Promocion
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Promocion (
  idPromocion INT NOT NULL,
  Descuento DECIMAL(2) NOT NULL,
  FechaInicio DATE NOT NULL,
  FechaFin DATE NOT NULL,
  Estado TINYINT NOT NULL,
  Producto_idProducto INT NOT NULL,
  PRIMARY KEY (idPromocion),
  CONSTRAINT fk_Promocion_Producto1
    FOREIGN KEY (Producto_idProducto)
    REFERENCES Producto (idProducto)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE UNIQUE INDEX idPromocion ON Promocion (idPromocion);
CREATE INDEX fk_Promocion_Producto1_idx ON Promocion (Producto_idProducto);


-- -----------------------------------------------------
-- Tabla DetalleVenta
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DetalleVenta (
  Producto_idProducto INT NOT NULL,
  Factura_idFactura INT NOT NULL,
  FormaPago VARCHAR(45) NOT NULL,
  Estado TINYINT NULL,
  CONSTRAINT fk_Producto_Factura_Producto1
    FOREIGN KEY (Producto_idProducto)
    REFERENCES Producto (idProducto)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Producto_Factura_Factura1
    FOREIGN KEY (Factura_idFactura)
    REFERENCES Venta (idFactura)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_Producto_Factura_Producto1_idx ON DetalleVenta (Producto_idProducto);
CREATE INDEX fk_Producto_Factura_Factura1_idx ON DetalleVenta (Factura_idFactura);


-- -----------------------------------------------------
-- Tabla Combo
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Combo (
  idCombo INT NOT NULL,
  Nombre VARCHAR(45) NOT NULL,
  Valor INT NOT NULL,
  PRIMARY KEY (idCombo));

CREATE UNIQUE INDEX idCombo_UNIQUE ON Combo (idCombo);


-- -----------------------------------------------------
-- Tabla Combo_Producto
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Combo_Producto (
  Producto_idProducto INT NOT NULL,
  Combo_idCombo INT NOT NULL,
  CONSTRAINT fk_Combo_Producto_Producto1
    FOREIGN KEY (Producto_idProducto)
    REFERENCES Producto (idProducto)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Combo_Producto_Combo1
    FOREIGN KEY (Combo_idCombo)
    REFERENCES Combo (idCombo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_Combo_Producto_Producto1_idx ON Combo_Producto (Producto_idProducto);
CREATE INDEX fk_Combo_Producto_Combo1_idx ON Combo_Producto (Combo_idCombo);

