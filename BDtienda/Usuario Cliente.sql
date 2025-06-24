-- Crear el LOGIN para el usuario Cliente
CREATE LOGIN [UsuarioClienteLogin] WITH PASSWORD = 'Jaimitoelcartero', CHECK_POLICY = ON;

-- Crear el USER de base de datos asociado al LOGIN
CREATE USER [UsuarioCliente] FOR LOGIN [UsuarioClienteLogin];

-- Permisos para SELECT en tablas relevantes para un cliente
GRANT SELECT ON Pedidos TO [UsuarioCliente];
GRANT SELECT ON Productos TO [UsuarioCliente];
GRANT SELECT ON DetalleDePedido TO [UsuarioCliente];
GRANT SELECT ON FacturasClientes TO [UsuarioCliente];
GRANT SELECT ON Usuarios TO [UsuarioCliente]; 
GRANT SELECT ON Clientes TO [UsuarioCliente]; 

-- Permisos para SELECT en vistas relevantes para un cliente
GRANT SELECT ON VistaPedidosCompletos TO [UsuarioCliente];
GRANT SELECT ON VistaProductosDisponiblesPorVendedor TO [UsuarioCliente];
GRANT SELECT ON VistaFacturasClientesDetalle TO [UsuarioCliente];

-- Permiso para INSERT en Pedidos y DetalleDePedido (para crear pedidos)
GRANT INSERT ON Pedidos TO [UsuarioCliente];
GRANT INSERT ON DetalleDePedido TO [UsuarioCliente];

-- Permiso para UPDATE en Pedidos (ej. para actualizar estado de un pedido propio, si la lógica lo permite)
GRANT UPDATE ON Pedidos TO [UsuarioCliente];