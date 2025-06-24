
--Evitar que se eliminen pedidos con factura ya emitida

USE PedidosAhorita;
GO

-- Trigger para evitar que se eliminen pedidos con factura ya emitida
CREATE OR ALTER TRIGGER trg_EvitarEliminacionPedidosFacturados
ON Pedidos
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM deleted d
        JOIN Facturas f ON d.PedidoID = f.PedidoID
        WHERE f.TipoDeFactura = 'CLIENTE_COMPRA' -- Aseguramos que sea una factura de cliente
    )
    BEGIN
        -- Usamos THROW para un manejo de errores más moderno y que detenga la ejecución del batch
        -- si es necesario, o RAISERROR si prefieres ese comportamiento.
        -- Para mantener la compatibilidad con el comportamiento original de RAISERROR + RETURN:
        RAISERROR ('No se puede eliminar un pedido que ya tiene una factura de compra emitida.', 16, 1);
        RETURN; -- Esto previene que la operación DELETE continúe dentro del trigger
    END

    -- Si no hay facturas asociadas, procede con la eliminación
    DELETE FROM Pedidos WHERE PedidoID IN (SELECT PedidoID FROM deleted);
END;
GO

-- **************************************************************************
-- PRUEBAS DEL TRIGGER - SCRIPT CORREGIDO
-- **************************************************************************
-- 1. Insertar un nuevo pedido de prueba
-- Asegúrate de que el ClienteID y el EstadoID existan en tus tablas respectivas.
-- Puedes ajustar los IDs si es necesario, o insertar un cliente y estado si no los tienes.
INSERT INTO Pedidos (ClienteID, EstadoDelPedidoID, Total, FechaDePedido)
VALUES (
    1, -- Asume que ClienteID = 1 existe en la tabla Clientes
    (SELECT EstadoID FROM EstadosPedido WHERE NombreEstado = 'Pendiente'), -- Asume que 'Pendiente' existe en EstadosPedido
    250.00,
    GETDATE()
);

-- 2. Capturar el PedidoID recién generado
DECLARE @NuevoPedidoID INT = SCOPE_IDENTITY();

-- 3. Insertar una factura de cliente asociada a ese pedido
INSERT INTO Facturas (PedidoID, MontoTotal, TipoDeFactura, FechaDeEmision)
VALUES (@NuevoPedidoID, 250.00, 'CLIENTE_COMPRA', GETDATE());

-- 4. Intentar eliminar el pedido (esto DEBERÍA ser bloqueado por el trigger)
DELETE FROM Pedidos WHERE PedidoID = @NuevoPedidoID;

-- 5. Verificar que el pedido todavía existe (debería mostrar 1 fila)
DECLARE @NuevoPedidoID INT = SCOPE_IDENTITY();
SELECT *
FROM Pedidos
