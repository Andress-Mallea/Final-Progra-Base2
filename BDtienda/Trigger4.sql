
--Bloquear eliminaci�n de usuarios si est�n en uso


USE PedidosAhorita;
GO

CREATE OR ALTER TRIGGER trg_EvitarEliminarUsuarioEnUso
ON Usuarios
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM deleted d
        WHERE EXISTS (SELECT 1 FROM Clientes c WHERE c.ClienteID = d.UsuarioID)
            OR EXISTS (SELECT 1 FROM Vendedores v WHERE v.VendedorID = d.UsuarioID)
            OR EXISTS (SELECT 1 FROM Empleados e WHERE e.EmpleadoID = d.UsuarioID)
            -- Considera tambi�n la tabla UsuarioRoles si un usuario activo podr�a tener roles que impidan su eliminaci�n
            -- OR EXISTS (SELECT 1 FROM UsuarioRoles ur WHERE ur.UsuarioID = d.UsuarioID)
    )
    BEGIN
        RAISERROR('No se puede eliminar un usuario que est� en uso como cliente, vendedor o empleado.', 16, 1);
        RETURN;
    END;

    DELETE FROM Usuarios
    WHERE UsuarioID IN (SELECT UsuarioID FROM deleted);

END;
GO



SELECT * FROM Usuarios;

DELETE FROM Usuarios WHERE UsuarioID = 10;
