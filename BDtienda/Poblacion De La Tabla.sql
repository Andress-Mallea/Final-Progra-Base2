Use [PedidosAhorita]
-- Insertar Usuarios
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Severo', N'Frutos', 'pepitapou@hotmail.com', '+34 735 050 999', '2c470cb0e94b053d504e2d65d2293436f3509966b35382540307dac4f0e2237e');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Crescencia', N'Oliveras', 'valbuenaelpidio@yahoo.com', '+34 714 215 224', '6abe0d8a45c65309102dffae16ef77305fa1d6a8da8bfaa76a378472ac5de676');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Petrona', N'Toledo', 'tmoran@mulet.es', '+34 720 453 317', 'c9dc41b20423605dfeb0e39eb46e546e37a997f5118220634d1fe65f95d14f53');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Daniela', N'Salamanca', 'leonardogallego@yahoo.com', '+34 728156885', 'f35ca143fdfb72d202a94a4b9809c657821351e5394928e486c651175f060383');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Pancho', N'Sureda', 'danizaguirre@hotmail.com', '+34 727 919 892', 'f1cc01a72bc50a60408b6a3a6111f113129206c471d5c5186de7c7538c939f16');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Bernabé', N'Peral', 'chaparroeli@macias.es', '+34730682427', '7da7bd9fae659a1437fda36a876a8b9326763728b47949bf88247a02dc538368');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Olimpia', N'Roura', 'prietoherberto@melero.com', '+34 749367514', 'e87d0a060b22c8680d96f13e368bd973a1dfe197c4185b1f83f6542057873fc7');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Diana', N'Fuertes', 'maximino99@gascon.net', '+34 998 880 467', 'b254dbc506c3ce3c7951df381eaf35a6edfa7bef8b39f1f68a67bf5bad5e72a3');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Francisco Javier', N'Alcalá', 'rosalia98@hotmail.com', '+34650 584 825', '9f45235f56d588f4cb876ef1329cc4973e0e420dfaf19c690056a283a9d0448d');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Sancho', N'Rojas', 'marciocastro@borras-mendez.org', '+34 624043223', '24b27684f186277ccc29190c1c29f7dd4538f6b57a087e442199e2eee90e7c24');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Eva', N'Garzón', 'abadmarco@hotmail.com', '+34848 06 11 77', '03366bd3203fd76a80e6597f7575562ceaccc019014d2b9f5605d4095583a2db');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Pepito', N'Izquierdo', 'aliagaagata@riquelme-cisneros.es', '+34 680 779 445', '808f62602e2b83e93cbfe58f68d5c6d3f5a15cb1e7ecc6c9d81a747ed135d140');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'Adela', N'Gomis', 'nicodemo24@gmail.com', '+34738 09 41 69', 'e14139645bc76ab9a468e992b0d37f6c8f97d7c0575c1f73c72051418f830b9d');
INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, ContrasenaHash) VALUES (N'María Pilar', N'Galan', 'adelaida31@gmail.com', '+34700 07 14 13', '0e8fe...');

-- Insertar Roles
INSERT INTO RolesDeUsuario (NombreRol) VALUES (N'Cliente');
INSERT INTO RolesDeUsuario (NombreRol) VALUES (N'Vendedor');
INSERT INTO RolesDeUsuario (NombreRol) VALUES (N'Empleado');
INSERT INTO RolesDeUsuario (NombreRol) VALUES (N'Administrador');
-- Clientes
INSERT INTO Clientes (ClienteID, Direccion, Ciudad, CodigoPostal) VALUES
(1, N'Calle Falsa 123', N'Madrid', '28001'),
(2, N'Avenida Siempre Viva 742', N'Barcelona', '08001'),
(3, N'Paseo de la Castellana 100', N'Madrid', '28046'),
(4, N'Calle Luna 50', N'Sevilla', '41001'),
(5, N'Calle Sol 75', N'Valencia', '46001');
--Vendedores
INSERT INTO Vendedores (VendedorID, NombreDeTienda, CuentaDeBanco, Activo) VALUES
(6, N'Tienda El Sol', 'ES7620770024003102575766', 1),
(7, N'Tienda Luna Nueva', 'ES1000491500052710149031', 1),
(8, N'Market Express', 'ES1600491500052710149032', 1),
(9, N'Venta y Punto', 'ES1200491500052710149033', 1),
(10, N'Mercado Rápido', 'ES1400491500052710149034', 1);
INSERT INTO Empleados (EmpleadoID, FechaDeContratacion, FechaDeDespido, RolInterno, Salario) VALUES
(11, '2022-01-15', NULL, N'Atención al Cliente', 1800.00),
(12, '2023-03-10', NULL, N'Repartidor', 1500.00),
(13, '2021-06-01', NULL, N'Soporte Técnico', 2000.00),
(14, '2020-09-20', NULL, N'Administrador', 2500.00);
--Roles
-- Clientes (UsuarioID 1 al 5)
INSERT INTO UsuarioRoles (UsuarioID, RolID) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1);

-- Vendedores (UsuarioID 6 al 10)
INSERT INTO UsuarioRoles (UsuarioID, RolID) VALUES
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2);

-- Empleados (UsuarioID 11 al 15)
INSERT INTO UsuarioRoles (UsuarioID, RolID) VALUES
(11, 3),
(12, 3),
(13, 3),
(14, 3);
-- Categorías
INSERT INTO CategoriasProducto (NombreCategoria) VALUES (N'Categoría 1');
INSERT INTO CategoriasProducto (NombreCategoria) VALUES (N'Categoría 2');
INSERT INTO CategoriasProducto (NombreCategoria) VALUES (N'Categoría 3');
INSERT INTO CategoriasProducto (NombreCategoria) VALUES (N'Categoría 4');
INSERT INTO CategoriasProducto (NombreCategoria) VALUES (N'Categoría 5');

-- Estados de Pedido
INSERT INTO EstadosPedido (NombreEstado) VALUES (N'Pendiente');
INSERT INTO EstadosPedido (NombreEstado) VALUES (N'En Proceso');
INSERT INTO EstadosPedido (NombreEstado) VALUES (N'Enviado');
INSERT INTO EstadosPedido (NombreEstado) VALUES (N'Entregado');

-- Productos (15)
INSERT INTO Productos (VendedorID, CategoriaID, Nombre, Descripcion, Precio, StockDisponible, ImagenURL)
VALUES 
(6, 1, N'Producto 1', N'Descripción del producto 1', 45.00, 12, N'https://img/1.jpg'),
(7, 2, N'Producto 2', N'Descripción del producto 2', 23.00, 26, N'https://img/2.jpg'),
(10, 1, N'Producto 3', N'Descripción del producto 3', 85.00, 18, N'https://img/3.jpg'),
(6, 1, N'Producto 4', N'Descripción del producto 4', 21.00, 11, N'https://img/4.jpg'),
(7, 5, N'Producto 5', N'Descripción del producto 5', 87.00, 5, N'https://img/5.jpg'),
(10, 2, N'Producto 6', N'Descripción del producto 6', 93.00, 27, N'https://img/6.jpg'),
(10, 4, N'Producto 7', N'Descripción del producto 7', 38.00, 19, N'https://img/7.jpg'),
(10, 3, N'Producto 8', N'Descripción del producto 8', 10.00, 29, N'https://img/8.jpg'),
(7, 4, N'Producto 9', N'Descripción del producto 9', 53.00, 13, N'https://img/9.jpg'),
(7, 2, N'Producto 10', N'Descripción del producto 10', 53.00, 8, N'https://img/10.jpg'),
(6, 4, N'Producto 11', N'Descripción del producto 11', 22.00, 16, N'https://img/11.jpg'),
(8, 5, N'Producto 12', N'Descripción del producto 12', 43.00, 30, N'https://img/12.jpg'),
(8, 2, N'Producto 13', N'Descripción del producto 13', 54.00, 22, N'https://img/13.jpg'),
(9, 2, N'Producto 14', N'Descripción del producto 14', 95.00, 20, N'https://img/14.jpg'),
(7, 5, N'Producto 15', N'Descripción del producto 15', 94.00, 13, N'https://img/15.jpg');

-- Pedidos (ClienteID: 1–5, RepartidorID: NULL o 11–15)
INSERT INTO Pedidos (ClienteID, EstadoDelPedidoID, RepartidorID, Total, TipoEntrega)
VALUES
(5, 4, 12, 50.22, N'Pickup'),
(3, 2, NULL, 110.50, N'Domicilio'),
(2, 1, 11, 180.00, N'Domicilio'),
(1, 3, NULL, 77.40, N'Pickup'),
(4, 2, 14, 60.00, N'Domicilio'),
(5, 4, NULL, 99.99, N'Domicilio'),
(1, 1, 13, 45.75, N'Pickup'),
(2, 3, NULL, 190.00, N'Domicilio'),
(4, 1, 14, 75.50, N'Domicilio'),
(2, 3, NULL, 150.30, N'Domicilio'),
(1, 2, NULL, 40.00, N'Pickup'),
(3, 2, 11, 82.25, N'Domicilio'),
(3, 4, 13, 63.40, N'Domicilio'),
(5, 2, NULL, 110.10, N'Domicilio'),
(1, 3, 14, 90.00, N'Pickup');

-- DetalleDePedido (asociaciones de productos aleatorias)
INSERT INTO DetalleDePedido (PedidoID, ProductoID, Cantidad, PrecioUnitario)
VALUES 
(11, 5, 2, 45.00),
(12, 6, 1, 85.00),
(13, 3, 3, 21.00),
(14, 8, 2, 38.00),
(15, 10, 1, 23.00),
(16, 2, 4, 50.00),
(17, 14, 1, 44.00),
(18, 12, 2, 70.00),
(19, 4, 1, 33.00),
(20, 11, 2, 20.00),
(21, 1, 3, 45.00),
(22, 7, 1, 40.00),
(23, 13, 2, 39.00),
(24, 9, 3, 35.00),
(11, 3, 2, 75.00),
(12, 9, 2, 48.00),
(13, 7, 1, 65.00),
(14, 10, 2, 90.00),
(15, 1, 1, 22.00);

-- Facturas (una por pedido)
INSERT INTO Facturas (FechaDeEmision, MontoTotal, URLFacturaPDF, TipoDeFactura, PedidoID)
VALUES 
(GETDATE(), 50.22, N'https://facturas/factura_1.pdf', N'CLIENTE_COMPRA', 11),
(GETDATE(), 110.50, N'https://facturas/factura_2.pdf', N'CLIENTE_COMPRA', 12),
(GETDATE(), 180.00, N'https://facturas/factura_3.pdf', N'CLIENTE_COMPRA', 13),
(GETDATE(), 77.40, N'https://facturas/factura_4.pdf', N'CLIENTE_COMPRA', 14),
(GETDATE(), 60.00, N'https://facturas/factura_5.pdf', N'CLIENTE_COMPRA', 15),
(GETDATE(), 99.99, N'https://facturas/factura_6.pdf', N'CLIENTE_COMPRA', 16),
(GETDATE(), 45.75, N'https://facturas/factura_7.pdf', N'CLIENTE_COMPRA', 17),
(GETDATE(), 190.00, N'https://facturas/factura_8.pdf', N'CLIENTE_COMPRA', 18),
(GETDATE(), 75.50, N'https://facturas/factura_9.pdf', N'CLIENTE_COMPRA', 19),
(GETDATE(), 150.30, N'https://facturas/factura_10.pdf', N'CLIENTE_COMPRA', 20),
(GETDATE(), 40.00, N'https://facturas/factura_11.pdf', N'CLIENTE_COMPRA', 21),
(GETDATE(), 82.25, N'https://facturas/factura_12.pdf', N'CLIENTE_COMPRA', 22),
(GETDATE(), 63.40, N'https://facturas/factura_13.pdf', N'CLIENTE_COMPRA', 23);
-- Pagos de clientes por pedidos (CLIENTE_PAGO_PEDIDO)
INSERT INTO Pagos (Monto, MetodoDePago, NumeroTransaccion, EstadoDePago, TipoDeTransaccion, PedidoID)
VALUES 
(50.22, N'Tarjeta', N'TXN001', N'Completo', N'CLIENTE_PAGO_PEDIDO', 11),
(110.50, N'Tarjeta', N'TXN002', N'Completo', N'CLIENTE_PAGO_PEDIDO', 12),
(180.00, N'Tarjeta', N'TXN003', N'Completo', N'CLIENTE_PAGO_PEDIDO', 13),
(77.40, N'Efectivo', N'TXN004', N'Pendiente', N'CLIENTE_PAGO_PEDIDO', 14),
(60.00, N'Tarjeta', N'TXN005', N'Completo', N'CLIENTE_PAGO_PEDIDO', 15),
(99.99, N'Tarjeta', N'TXN006', N'Completo', N'CLIENTE_PAGO_PEDIDO', 16),
(45.75, N'Tarjeta', N'TXN007', N'Completo', N'CLIENTE_PAGO_PEDIDO', 17),
(190.00, N'Tarjeta', N'TXN008', N'Completo', N'CLIENTE_PAGO_PEDIDO', 18),
(75.50, N'Tarjeta', N'TXN009', N'Completo', N'CLIENTE_PAGO_PEDIDO', 19),
(150.30, N'Tarjeta', N'TXN010', N'Completo', N'CLIENTE_PAGO_PEDIDO', 20);

-- Pagos a vendedores (PLATAFORMA_PAGO_VENDEDOR)
INSERT INTO Pagos (Monto, MetodoDePago, NumeroTransaccion, EstadoDePago, TipoDeTransaccion, VendedorID, PeriodoDesde, PeriodoHasta)
VALUES 
(270.00, N'Transferencia', N'VEND005', N'Completo', N'PLATAFORMA_PAGO_VENDEDOR', 10, '2025-05-01', '2025-05-31');