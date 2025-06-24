USE [PedidosAhorita];
GO -- Use GO to separate batches

CREATE OR ALTER PROCEDURE RegistrarPagoAVendedor
    @VendedorID INT,
    @MetodoDePago NVARCHAR(50), 
    @InicioDePago DATE,
    @FinDePago DATE
AS
BEGIN
    SET NOCOUNT ON; 

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @MontoTotal DECIMAL(10, 2);

        SELECT @MontoTotal = SUM(Total)
        FROM Pedidos
        WHERE VendedorID = @VendedorID
          AND FechaDePedido

        
        IF @MontoTotal IS NULL OR @MontoTotal = 0
        BEGIN
            -- Throw a custom error if no orders are found for the specified vendor and date range
            THROW 50002, 'No hay pedidos para pagar en ese rango de fechas para el vendedor especificado.', 1;
        END

        -- 2. Insert the general payment record into the unified Pagos table
        -- We specify 'PLATAFORMA_PAGO_VENDEDOR' as the transaction type.
        INSERT INTO Pagos (
            VendedorID,
            Monto, -- Renamed from MontoAPagar
            MetodoDePago,
            PeriodoDesde, -- Renamed from InicioDePago for consistency with new schema
            PeriodoHasta, -- Renamed from FinDePago for consistency with new schema
            EstadoDePago,
            TipoDeTransaccion, -- New: Specify the type of transaction
            PedidoID           -- PedidoID must be NULL for this transaction type
        )
        VALUES (
            @VendedorID,
            @MontoTotal,
            @MetodoDePago,
            @InicioDePago,
            @FinDePago,
            'Pendiente', -- Initial state for the payment
            'PLATAFORMA_PAGO_VENDEDOR', -- This is a payment FROM the platform TO the vendor
            NULL -- PedidoID is NULL as this payment is to a vendor, not for a specific client order
        );

        -- Get the ID of the newly inserted payment
        DECLARE @PagoID INT = SCOPE_IDENTITY();

        -- 3. Insert the detail for each order associated with this vendor payment
        -- into the renamed PagosDetallePedidos table.
        INSERT INTO PagosDetallePedidos (
            PagoID,
            PedidoID,
            MontoCorrespondiente -- Renamed from Monto
        )
        SELECT
            @PagoID,
            PedidoID,
            Total
        FROM Pedidos
        WHERE VendedorID = @VendedorID
          AND FechaDePedido BETWEEN @InicioDePago AND @FinDePago;

        COMMIT TRANSACTION; -- Commit the transaction if all operations are successful

        PRINT 'Pago a vendedor registrado con éxito. PagoID: ' + CAST(@PagoID AS NVARCHAR(10));

    END TRY
    BEGIN CATCH
        -- Rollback the transaction if any error occurs
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Re-throw the error to the calling application to provide details
        THROW;
    END CATCH
END;
GO

-- You can check the stored procedure's definition if needed
-- SELECT * FROM sys.procedures WHERE name = 'RegistrarPagoAVendedor';

---

```sql
EXEC RegistrarPagoAVendedor
    @VendedorID = 10,
    @MetodoDePago = 'Transferencia Bancaria', 
    @InicioDePago = '2025-05-01',
    @FinDePago = '2025-05-31';

	select *
	from Pagos
SELECT * FROM Pagos WHERE TipoDeTransaccion = 'PLATAFORMA_PAGO_VENDEDOR' ORDER BY PagoID DESC;
SELECT PDP.* FROM PagosDetallePedidos PDP JOIN Pagos P ON PDP.PagoID = P.PagoID WHERE P.TipoDeTransaccion = 'PLATAFORMA_PAGO_VENDEDOR' ORDER BY PDP.PagoID DESC;