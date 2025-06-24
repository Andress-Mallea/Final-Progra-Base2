-- Crear el LOGIN para el usuario Tienda
CREATE LOGIN [UsuarioTiendaLogin] WITH PASSWORD = 'Camacho', CHECK_POLICY = ON;

-- Crear el USER de base de datos asociado al LOGIN
CREATE USER [UsuarioTienda] FOR LOGIN [UsuarioTiendaLogin];

-- Permisos para SELECT en tablas relevantes para un vendedor
GRANT SELECT ON Pedidos TO [UsuarioTienda];
GRANT SELECT ON Productos TO [UsuarioTienda];
GRANT SELECT ON DetalleDePedido TO [UsuarioTienda];
GRANT SELECT ON Pagos TO [UsuarioTienda];
GRANT SELECT ON DetallePagosVendedores TO [UsuarioTienda];
GRANT SELECT ON Vendedores TO [UsuarioTienda]; 
GRANT SELECT ON Usuarios TO [UsuarioTienda]; 

-- Permisos para INSERT, UPDATE, DELETE en Productos (gestión de su propio inventario)
GRANT INSERT ON Productos TO [UsuarioTienda];
GRANT UPDATE ON Productos TO [UsuarioTienda];
GRANT DELETE ON Productos TO [UsuarioTienda];

-- Permisos para SELECT en vistas relevantes para un vendedor
GRANT SELECT ON VistaPedidosCompletos TO [UsuarioTienda];
GRANT SELECT ON VistaProductosDisponiblesPorVendedor TO [UsuarioTienda];
GRANT SELECT ON VistaPagosVendedoresDetallados TO [UsuarioTienda];
