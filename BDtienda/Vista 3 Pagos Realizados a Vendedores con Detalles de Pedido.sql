-- Pagos Realizados a Vendedores con Detalles de Pedido
USE PedidosAhorita;
GO

CREATE OR ALTER VIEW VistaPagosVendedoresDetallados AS
SELECT
    pago.PagoID,
    pago.Monto AS MontoPagado,
    pago.MetodoDePago,
    pago.FechaDePago,
    pago.EstadoDePago,
    pago.PeriodoDesde,
    pago.PeriodoHasta,
    u.Nombre AS NombreVendedor,
    u.Apellido AS ApellidoVendedor,
    v.NombreDeTienda
FROM
    Pagos AS pago
LEFT JOIN
    Vendedores AS v ON pago.VendedorID = v.VendedorID
LEFT JOIN
    Usuarios AS u ON v.VendedorID = u.UsuarioID
WHERE
    pago.TipoDeTransaccion = 'PLATAFORMA_PAGO_VENDEDOR';
GO
select *
from VistaPagosVendedoresDetallados