CREATE PROCEDURE RealizarCompra
    @ClienteID INT,
    @ProductoID INT,
    @Cantidad INT,
    @TipoEntrega NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @StockDisponible INT,
            @PrecioUnitario DECIMAL(10, 2),
            @Total DECIMAL(10, 2),
            @PedidoID INT;

    -- Verificar si el producto existe y tiene stock
    SELECT 
        @StockDisponible = StockDisponible,
        @PrecioUnitario = Precio
    FROM Productos
    WHERE ProductoID = @ProductoID AND Activo = 1;

    IF @StockDisponible IS NULL
    BEGIN
        RAISERROR('El producto no existe o está inactivo.', 16, 1);
        RETURN;
    END

    IF @StockDisponible < @Cantidad
    BEGIN
        RAISERROR('No hay suficiente stock disponible para este producto.', 16, 1);
        RETURN;
    END

    SET @Total = @Cantidad * @PrecioUnitario;

    -- Crear el pedido (EstadoDelPedidoID = 1 asumiendo "Pendiente")
    INSERT INTO Pedidos (ClienteID, EstadoDelPedidoID, Total, TipoEntrega)
    VALUES (@ClienteID, 1, @Total, @TipoEntrega);

    SET @PedidoID = SCOPE_IDENTITY();

    -- Insertar en DetalleDePedido
    INSERT INTO DetalleDePedido (PedidoID, ProductoID, Cantidad, PrecioUnitario)
    VALUES (@PedidoID, @ProductoID, @Cantidad, @PrecioUnitario);

    -- Actualizar el stock del producto
    UPDATE Productos
    SET StockDisponible = StockDisponible - @Cantidad
    WHERE ProductoID = @ProductoID;

    PRINT 'Compra realizada exitosamente.';
END;

EXEC RealizarCompra 
    @ClienteID = 1,        -- el mismo usuario actúa como cliente
    @ProductoID = 15,                -- ID del producto creado (puedes consultar si es distinto)
    @Cantidad = 13, 
    @TipoEntrega = 'Domicilio';
	select *
	from Productos