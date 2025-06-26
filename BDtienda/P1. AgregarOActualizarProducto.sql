

CREATE PROCEDURE AgregarOActualizarProducto
    @VendedorID INT,
    @Nombre NVARCHAR(100),
    @Precio DECIMAL(10,2),
    @Cantidad INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar que el vendedor exista
        IF NOT EXISTS (SELECT 1 FROM Vendedores WHERE VendedorID = @VendedorID)
        BEGIN
            RAISERROR('El VendedorID no existe.', 16, 1);
            ROLLBACK;
            RETURN;
        END

        -- Verificar si el producto ya existe para ese vendedor
        IF EXISTS (
            SELECT 1 
            FROM Productos
            WHERE VendedorID = @VendedorID AND Nombre = @Nombre
        )
        BEGIN
            -- Actualiza el stock y el precio
            UPDATE Productos
            SET Cantidad = Cantidad + @Cantidad,
                Precio = @Precio
            WHERE VendedorID = @VendedorID AND Nombre = @Nombre;
        END
        ELSE
        BEGIN
            -- Inserta nuevo producto
            INSERT INTO Productos (VendedorID, Nombre, Precio, Cantidad)
            VALUES (@VendedorID, @Nombre, @Precio, @Cantidad);
        END

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        THROW;
    END CATCH
END;



-- Ejecutar el procedimiento (vendedor existente)
EXEC AgregarOActualizarProducto
    @VendedorID = 3,
    @Nombre = 'Pan Integral',
    @Precio = 11.00,
    @Cantidad = 20;

-- Ejecutar para nuevo producto
EXEC AgregarOActualizarProducto
    @VendedorID = 3,
    @Nombre = 'Harina 1Kg',
    @Precio = 6.50,
    @Cantidad = 50;

-- Verificar resultados
SELECT * FROM Productos WHERE VendedorID = 3;
