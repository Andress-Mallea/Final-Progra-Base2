--Facturas de Clientes con Detalles de Pedido y Cliente
USE PedidosAhorita;
GO

CREATE OR ALTER VIEW VistaFacturasDetalle AS
SELECT
    f.FacturaID,
    f.FechaDeEmision,
    f.MontoTotal,
    f.TipoDeFactura,
    p.PedidoID,
    p.FechaDePedido,
    u.Nombre AS NombreCliente,
    u.Apellido AS ApellidoCliente,
    u.Email AS EmailCliente
FROM
    Facturas AS f
RIGHT JOIN
    Pedidos AS p ON f.PedidoID = p.PedidoID
RIGHT JOIN
    Clientes AS c ON p.ClienteID = c.ClienteID
RIGHT JOIN
    Usuarios AS u ON c.ClienteID = u.UsuarioID
RIGHT JOIN
    EstadosPedido AS EP ON p.EstadoDelPedidoID = EP.EstadoID
GO
select *
from VistaFacturasDetalle