USE PedidosAhorita;
GO

CREATE OR ALTER VIEW VistaEmpleadosConDetalle AS
SELECT
    e.EmpleadoID,
    e.FechaDeContratacion,
    e.FechaDeDespido,
    e.RolInterno AS RolEmpleado, -- 'Rol' ahora es 'RolInterno' y renombrado para claridad
    e.Salario,
    u.Nombre AS NombreUsuario,
    u.Apellido AS ApellidoUsuario,
    u.Email AS EmailUsuario, -- 'DireccionEmail' ahora es 'Email'
    u.Telefono
FROM
    Empleados AS e
LEFT JOIN
    Usuarios AS u ON e.EmpleadoID = u.UsuarioID; -- El JOIN es por EmpleadoID, que es la FK a UsuarioID
GO

select *
from VistaEmpleadosConDetalle