
--Generar factura de vendedor cuando un pago cambia a “Pagado”

USE PedidosAhorita;
GO

CREATE OR ALTER TRIGGER trg_CrearFacturaVendedorAlPagar
ON Pagos
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Facturas (PagoID, FechaDeEmision, MontoTotal, TipoDeFactura)
    SELECT
        i.PagoID,
        GETDATE(),
        i.Monto, -- 'MontoAPagar' ahora es 'Monto'
        'VENDEDOR_LIQUIDACION' -- Tipo de factura para liquidación de vendedor
    FROM
        inserted i
    JOIN
        deleted d ON i.PagoID = d.PagoID
    WHERE
        i.EstadoDePago = 'Pagado'
        AND d.EstadoDePago <> 'Pagado'
        AND i.TipoDeTransaccion = 'PLATAFORMA_PAGO_VENDEDOR' -- Aseguramos que sea un pago a vendedor
        AND NOT EXISTS (
            SELECT 1
            FROM Facturas f
            WHERE f.PagoID = i.PagoID
            AND f.TipoDeFactura = 'VENDEDOR_LIQUIDACION' -- Evitamos duplicados del mismo tipo de factura
        );
END;
GO
-- Suponiendo que VendedorID = 10 existe.
-- Insertar un pago de ejemplo en estado 'Pendiente' (VendedorID 10, de la plataforma al vendedor)
--INSERT INTO Pagos (Monto, MetodoDePago, FechaDePago, EstadoDePago, TipoDeTransaccion, VendedorID, PeriodoDesde, PeriodoHasta)
--VALUES (250.75, 'Transferencia Bancaria', GETDATE(), 'Pendiente', 'PLATAFORMA_PAGO_VENDEDOR', 10, '2024-05-01', '2024-05-31');

--DECLARE @PagoVendedorID INT = SCOPE_IDENTITY();

--SELECT * FROM Pagos WHERE PagoID = @PagoVendedorID; -- Ver el estado inicial

-- Actualizar el estado del pago a 'Pagado' para activar el trigger
--UPDATE Pagos
--SET EstadoDePago = 'Pagado'
--WHERE PagoID = @PagoVendedorID;

--SELECT * FROM Pagos WHERE PagoID = @PagoVendedorID; -- Ver el nuevo estado

-- Verificar si se generó la factura en la tabla Facturas
--SELECT * FROM Facturas WHERE PagoID = @PagoVendedorID AND TipoDeFactura = 'VENDEDOR_LIQUIDACION';

-- Intentar actualizar el mismo pago a 'Pagado' de nuevo (NO debería crear otra factura)
--UPDATE Pagos
--SET EstadoDePago = 'Pagado' -- De nuevo a 'Pagado'
--WHERE PagoID = @PagoVendedorID;

-- Verificar que no se generó una segunda factura
--SELECT COUNT(*) FROM Facturas WHERE PagoID = @PagoVendedorID AND TipoDeFactura = 'VENDEDOR_LIQUIDACION'; -- Debería ser 1
