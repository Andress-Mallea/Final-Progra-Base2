--Productos Disponibles por Vendedor
CREATE OR ALTER VIEW VistaProductosDisponiblesPorVendedor AS
SELECT
    prod.ProductoID,
    prod.Nombre AS NombreProducto,
    prod.Precio,
    prod.StockDisponible AS CantidadDisponible, -- 'Cantidad' fue corregido a 'StockDisponible'
    v.NombreDeTienda AS VendedorNombreTienda,
    u.Nombre AS NombreVendedor,
    u.Apellido AS ApellidoVendedor
FROM
    Productos AS prod
INNER JOIN
    Vendedores AS v ON prod.VendedorID = v.VendedorID
INNER JOIN
    Usuarios AS u ON v.VendedorID = u.UsuarioID
WHERE
    prod.StockDisponible > 0;

Select *
from VistaProductosDisponiblesPorVendedor