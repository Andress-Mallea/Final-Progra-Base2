
--Evitar que se baje el stock de productos por debajo de 0

USE PedidosAhorita;
GO 

CREATE OR ALTER TRIGGER trg_PreventNegativeStock
ON Productos
AFTER UPDATE 
AS
BEGIN
    SET NOCOUNT ON; 
	IF EXISTS (
        SELECT 1
        FROM inserted 
        WHERE StockDisponible < 0 
    )
    BEGIN
        RAISERROR ('No se puede establecer un stock negativo en el producto. La operación será revertida.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- SELECT * FROM sys.triggers WHERE name = 'trg_PreventNegativeStock';

--UPDATE Productos
--SET StockDisponible = -2 
--WHERE ProductoID = 1;



