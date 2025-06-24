USE [PedidosAhorita];
GO -- Use GO to separate batches

CREATE OR ALTER PROCEDURE AsignarRepartidorAPedido
    @PedidoID INT,
    @EmpleadoID INT
AS
BEGIN
    SET NOCOUNT ON; -- Prevents the "X rows affected" message

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validate if the order exists
        IF NOT EXISTS (SELECT 1 FROM Pedidos WHERE PedidoID = @PedidoID)
        BEGIN
            THROW 50003, 'El pedido no existe.', 1;
        END

        -- Validate that the employee exists and their role is 'Repartidor'
        -- We've changed 'Rol' to 'RolInterno' in the Empleados table
        IF NOT EXISTS (
            SELECT 1
            FROM Empleados
            WHERE EmpleadoID = @EmpleadoID
              AND RolInterno = 'Repartidor' -- Corrected column name
        )
        BEGIN
            THROW 50004, 'El empleado no es un repartidor válido o no existe.', 1;
        END

        -- Assign the delivery person to the order
        UPDATE Pedidos
        SET RepartidorID = @EmpleadoID
        WHERE PedidoID = @PedidoID;

        COMMIT TRANSACTION; -- Commit the transaction if all operations are successful

        PRINT 'Repartidor asignado al pedido ' + CAST(@PedidoID AS NVARCHAR(10)) + ' con éxito.';

    END TRY
    BEGIN CATCH
        -- Rollback the transaction if any error occurs
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Re-throw the error to the calling application
        THROW;
    END CATCH
END;
GO

EXEC AsignarRepartidorAPedido
    @PedidoID = 3,
    @EmpleadoID = 12;

	select *
	from empleados as e
	inner join Pedidos as p
	on p.RepartidorID = e.EmpleadoID
