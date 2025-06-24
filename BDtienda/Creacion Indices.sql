USE [PedidosAhorita];

-- �ndices para la tabla Usuarios
CREATE INDEX IX_Usuarios_Email ON Usuarios(Email);

-- �ndices para la tabla UsuarioRoles (nueva)
CREATE INDEX IX_UsuarioRoles_RolID ON UsuarioRoles(RolID);

-- �ndices para la tabla Clientes
CREATE INDEX IX_Clientes_Ciudad ON Clientes(Ciudad);

-- �ndices para la tabla Vendedores
CREATE INDEX IX_Vendedores_NombreDeTienda ON Vendedores(NombreDeTienda);

-- �ndices para la tabla Empleados
CREATE INDEX IX_Empleados_RolInterno ON Empleados(RolInterno);
-- Nota: EmpleadoID es PK y FK, ya deber�a estar indexada.

-- �ndices para la tabla Pedidos
CREATE INDEX IX_Pedidos_ClienteID ON Pedidos(ClienteID);
CREATE INDEX IX_Pedidos_VendedorID ON Pedidos(VendedorID);
CREATE INDEX IX_Pedidos_RepartidorID ON Pedidos(RepartidorID);
CREATE INDEX IX_Pedidos_FechaDePedido ON Pedidos(FechaDePedido);
CREATE INDEX IX_Pedidos_EstadoDelPedidoID ON Pedidos(EstadoDelPedidoID);

-- �ndices para la tabla Productos
CREATE INDEX IX_Productos_VendedorID ON Productos(VendedorID);
CREATE INDEX IX_Productos_Nombre ON Productos(Nombre);
CREATE INDEX IX_Productos_CategoriaID ON Productos(CategoriaID); -- Nuevo, �til para b�squedas por categor�a

-- �ndices para la tabla DetalleDePedido
CREATE INDEX IX_DetalleDePedido_PedidoID ON DetalleDePedido(PedidoID);
CREATE INDEX IX_DetalleDePedido_ProductoID ON DetalleDePedido(ProductoID);

-- �ndices para la tabla Pagos (Unificada)
CREATE INDEX IX_Pagos_PedidoID ON Pagos(PedidoID);
CREATE INDEX IX_Pagos_VendedorID ON Pagos(VendedorID);
CREATE INDEX IX_Pagos_FechaDePago ON Pagos(FechaDePago);
CREATE INDEX IX_Pagos_EstadoDePago ON Pagos(EstadoDePago);
CREATE INDEX IX_Pagos_TipoDeTransaccion ON Pagos(TipoDeTransaccion); -- Crucial para la unificaci�n

-- �ndices para la tabla PagosDetallePedidos (antes DetallePagosVendedores)
CREATE INDEX IX_PagosDetallePedidos_PagoID ON PagosDetallePedidos(PagoID);
CREATE INDEX IX_PagosDetallePedidos_PedidoID ON PagosDetallePedidos(PedidoID);

-- �ndices para la tabla Facturas (Unificada)
CREATE INDEX IX_Facturas_PedidoID ON Facturas(PedidoID);
CREATE INDEX IX_Facturas_PagoID ON Facturas(PagoID);
CREATE INDEX IX_Facturas_TipoDeFactura ON Facturas(TipoDeFactura); -- Crucial para la unificaci�n