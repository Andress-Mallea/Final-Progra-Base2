USE PedidosAhorita;
GO -- Usamos GO para separar los lotes

CREATE OR ALTER PROCEDURE CancelarPedido
    @PedidoID INT
AS
BEGIN
    SET NOCOUNT ON; -- Evita que se muestren mensajes de "X filas afectadas"

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Verificar que el pedido exista
        IF NOT EXISTS (SELECT 1 FROM Pedidos WHERE PedidoID = @PedidoID)
        BEGIN
            THROW 50005, 'El pedido no existe.', 1;
        END

        -- 2. Obtener el ID del estado 'Cancelado' y 'Entregado' de la tabla EstadosPedido
        DECLARE @EstadoCanceladoID INT;
        DECLARE @EstadoEntregadoID INT;
        DECLARE @EstadoActualID INT;

        SELECT @EstadoCanceladoID = EstadoID FROM EstadosPedido WHERE NombreEstado = 'Cancelado';
        SELECT @EstadoEntregadoID = EstadoID FROM EstadosPedido WHERE NombreEstado = 'Entregado';

        -- Si por alguna razón los estados no existen, lanzamos un error
        IF @EstadoCanceladoID IS NULL OR @EstadoEntregadoID IS NULL
        BEGIN
            THROW 50007, 'No se encontraron los IDs de estado "Cancelado" o "Entregado" en la tabla EstadosPedido. Verifique la configuración.', 1;
        END

        -- Obtener el ID del estado actual del pedido
        SELECT @EstadoActualID = EstadoDelPedidoID FROM Pedidos WHERE PedidoID = @PedidoID;

        -- 3. Verificar que el estado actual permita cancelación
        IF @EstadoActualID = @EstadoEntregadoID OR @EstadoActualID = @EstadoCanceladoID
        BEGIN
            THROW 50006, 'El pedido no puede ser cancelado porque ya está entregado o cancelado.', 1;
        END

        -- 4. Cancelar el pedido (actualizar el ID del estado a 'Cancelado')
        UPDATE Pedidos
        SET EstadoDelPedidoID = @EstadoCanceladoID
        WHERE PedidoID = @PedidoID;

        COMMIT TRANSACTION; -- Confirmar la transacción si todas las operaciones fueron exitosas

        PRINT 'Pedido ' + CAST(@PedidoID AS NVARCHAR(10)) + ' cancelado con éxito.';

    END TRY
    BEGIN CATCH
        -- Revertir la transacción si ocurre algún error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Relanzar el error a la aplicación que llama
        THROW;
    END CATCH
END;
GO

EXEC CancelarPedido @PedidoID = 3;

select *
from pedidos as p
inner join estadospedido as e
on p.[EstadoDelPedidoID] = e.[EstadoID]
