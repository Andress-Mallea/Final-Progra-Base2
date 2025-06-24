CREATE TRIGGER trg_VerificarStock
ON DetalleDePedido
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @ProductoID INT,
            @Cantidad INT,
            @StockDisponible INT;

    SELECT 
        @ProductoID = i.ProductoID,
        @Cantidad = i.Cantidad
    FROM inserted i;

    SELECT @StockDisponible = StockDisponible
    FROM Productos
    WHERE ProductoID = @ProductoID;

    IF @StockDisponible IS NULL
    BEGIN
        RAISERROR('El producto no existe.', 16, 1);
        RETURN;
    END

    IF @StockDisponible < @Cantidad
    BEGIN
        RAISERROR('Stock insuficiente. No se puede completar la inserción.', 16, 1);
        RETURN;
    END

    -- Si hay stock, permitir inserción
    INSERT INTO DetalleDePedido (PedidoID, ProductoID, Cantidad, PrecioUnitario)
    SELECT PedidoID, ProductoID, Cantidad, PrecioUnitario
    FROM inserted;
END;
