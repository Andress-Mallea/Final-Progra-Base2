--Pedidos con Información Completa del Cliente y Vendedor
CREATE OR ALTER VIEW VistaPedidosCompletos AS
SELECT
    p.PedidoID,
    EP.NombreEstado AS EstadoDelPedido,
    p.FechaDePedido,
    p.FechaEstimadaDeEntrega,
    p.Total,
    u_cliente.Nombre AS NombreCliente,
    u_cliente.Apellido AS ApellidoCliente,
    u_cliente.Email AS EmailCliente,
    u_vendedor.Nombre AS NombreVendedor,
    u_vendedor.Apellido AS ApellidoVendedor,
    v.NombreDeTienda
FROM
    Pedidos AS p
INNER JOIN
    Clientes AS cl ON p.ClienteID = cl.ClienteID
INNER JOIN
    Usuarios AS u_cliente ON cl.ClienteID = u_cliente.UsuarioID
LEFT JOIN -- CAMBIO CLAVE AQUÍ: De INNER JOIN a LEFT JOIN
    Vendedores AS v ON p.VendedorID = v.VendedorID
LEFT JOIN -- CAMBIO CLAVE AQUÍ: De INNER JOIN a LEFT JOIN
    Usuarios AS u_vendedor ON v.VendedorID = u_vendedor.UsuarioID
INNER JOIN
    EstadosPedido AS EP ON p.EstadoDelPedidoID = EP.EstadoID;

select * 
from VistaPedidosCompletos