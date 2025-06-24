-- 1. Crear el LOGIN para el usuario Administrador
CREATE LOGIN [AdminAppLogin] WITH PASSWORD = 'Elchapulincolorado', CHECK_POLICY = ON;

-- 2. Crear el USER de base de datos asociado al LOGIN
CREATE USER [AdminApp] FOR LOGIN [AdminAppLogin];

-- Otorgar db_owner o roles más específicos si se quiere un control más granular.
ALTER ROLE db_owner ADD MEMBER [AdminApp];

-- Adicionalmente, para asegurar que el administrador pueda manejar las vistas
GRANT SELECT ON VistaPedidosCompletos TO [AdminApp];
GRANT SELECT ON VistaProductosDisponiblesPorVendedor TO [AdminApp];
GRANT SELECT ON VistaEmpleadosConDetalle TO [AdminApp];
GRANT SELECT ON VistaPagosVendedoresDetallados TO [AdminApp];
GRANT SELECT ON VistaFacturasClientesDetalle TO [AdminApp];