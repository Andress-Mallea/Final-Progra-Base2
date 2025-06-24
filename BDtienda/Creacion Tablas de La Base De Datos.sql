USE [PedidosAhorita];

-- Tablas base (sin cambios significativos desde la propuesta optimizada anterior)
-- 1. Usuarios: Centraliza la información de acceso y perfil básico.
CREATE TABLE Usuarios (
    UsuarioID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Apellido NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Telefono NVARCHAR(20),
    ContrasenaHash NVARCHAR(255) NOT NULL,
    FechaDeRegistro DATETIME DEFAULT GETDATE(),
    Activo BIT DEFAULT 1
);

-- 2. RolesDeUsuario: Para definir los tipos de usuarios (Cliente, Vendedor, Empleado, Administrador, etc.)
CREATE TABLE RolesDeUsuario (
    RolID INT PRIMARY KEY IDENTITY(1,1),
    NombreRol NVARCHAR(50) UNIQUE NOT NULL
);

-- 3. UsuarioRoles: Para asignar múltiples roles a un usuario (si es necesario)
CREATE TABLE UsuarioRoles (
    UsuarioID INT NOT NULL,
    RolID INT NOT NULL,
    PRIMARY KEY (UsuarioID, RolID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID),
    FOREIGN KEY (RolID) REFERENCES RolesDeUsuario(RolID)
);

-- 4. Clientes: Información específica de clientes.
CREATE TABLE Clientes (
    ClienteID INT PRIMARY KEY,
    Direccion NVARCHAR(255),
    Ciudad NVARCHAR(100),
    CodigoPostal NVARCHAR(10),
    FOREIGN KEY (ClienteID) REFERENCES Usuarios(UsuarioID)
);

-- 5. Vendedores: Información específica de vendedores.
CREATE TABLE Vendedores (
    VendedorID INT PRIMARY KEY,
    NombreDeTienda NVARCHAR(100) NOT NULL,
    CuentaDeBanco NVARCHAR(100),
    Activo BIT DEFAULT 1,
    FOREIGN KEY (VendedorID) REFERENCES Usuarios(UsuarioID)
);

-- 6. Empleados: Información específica de empleados.
CREATE TABLE Empleados (
    EmpleadoID INT PRIMARY KEY,
    FechaDeContratacion DATE NOT NULL,
    FechaDeDespido DATE NULL,
    RolInterno NVARCHAR(50),
    Salario DECIMAL(10,2),
    FOREIGN KEY (EmpleadoID) REFERENCES Usuarios(UsuarioID)
);

-- 7. CategoriasProducto: Para organizar los productos.
CREATE TABLE CategoriasProducto (
    CategoriaID INT PRIMARY KEY IDENTITY(1,1),
    NombreCategoria NVARCHAR(100) UNIQUE NOT NULL
);

-- 8. Productos: Información de los productos.
CREATE TABLE Productos (
    ProductoID INT PRIMARY KEY IDENTITY(1,1),
    VendedorID INT NOT NULL,
    CategoriaID INT NULL,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(MAX),
    Precio DECIMAL(10, 2) NOT NULL,
    StockDisponible INT NOT NULL DEFAULT 0,
    ImagenURL NVARCHAR(255),
    FechaCreacion DATETIME DEFAULT GETDATE(),
    Activo BIT DEFAULT 1,
    FOREIGN KEY (VendedorID) REFERENCES Vendedores(VendedorID),
    FOREIGN KEY (CategoriaID) REFERENCES CategoriasProducto(CategoriaID)
);

-- 9. EstadosPedido: Para manejar los estados de un pedido de forma centralizada.
CREATE TABLE EstadosPedido (
    EstadoID INT PRIMARY KEY IDENTITY(1,1),
    NombreEstado NVARCHAR(50) UNIQUE NOT NULL
);

-- 10. Pedidos: Información general de los pedidos.
CREATE TABLE Pedidos (
    PedidoID INT PRIMARY KEY IDENTITY(1,1),
    ClienteID INT NOT NULL,
    VendedorID INT NULL, -- Puede ser NULL si un pedido tiene productos de varios vendedores
    RepartidorID INT NULL,
    EstadoDelPedidoID INT NOT NULL,
    FechaDePedido DATETIME DEFAULT GETDATE(),
    FechaEstimadaDeEntrega DATETIME NULL,
    FechaDeEntregaReal DATETIME NULL,
    Total DECIMAL(10, 2) NOT NULL,
    TipoEntrega NVARCHAR(50),
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID),
    FOREIGN KEY (VendedorID) REFERENCES Vendedores(VendedorID),
    FOREIGN KEY (RepartidorID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (EstadoDelPedidoID) REFERENCES EstadosPedido(EstadoID)
);

-- 11. DetalleDePedido: Detalles de cada producto dentro de un pedido.
CREATE TABLE DetalleDePedido (
    PedidoID INT NOT NULL,
    ProductoID INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (PedidoID, ProductoID),
    FOREIGN KEY (PedidoID) REFERENCES Pedidos(PedidoID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

-- -------------------------------------------------------------
-- NUEVAS TABLAS SIMPLIFICADAS Y UNIFICADAS
-- -------------------------------------------------------------

-- 12. Tabla Pagos (Unificada para pagos de clientes y pagos a vende
CREATE TABLE Pagos (
    PagoID INT PRIMARY KEY IDENTITY(1,1),
    Monto DECIMAL(10, 2) NOT NULL,
    MetodoDePago NVARCHAR(50),
    NumeroTransaccion NVARCHAR(100),
    FechaDePago DATETIME DEFAULT GETDATE(),
    EstadoDePago NVARCHAR(20),

    -- Define el tipo de transacción:
    -- 'CLIENTE_PAGO_PEDIDO': Un cliente paga por un pedido.
    -- 'PLATAFORMA_PAGO_VENDEDOR': La plataforma paga a un vendedor.
    -- 'CLIENTE_REEMBOLSO': La plataforma reembolsa a un cliente.
    TipoDeTransaccion NVARCHAR(30) NOT NULL,

    -- Claves foráneas que ahora son puramente NULLABLE,
    -- sin ninguna restricción de base de datos sobre su combinación.
    PedidoID INT NULL, -- FK a Pedidos
    VendedorID INT NULL, -- FK a Vendedores

    -- Periodo de pago (usado para pagos a vendedores, será NULL para otros tipos)
    PeriodoDesde DATE NULL,
    PeriodoHasta DATE NULL,

    FOREIGN KEY (PedidoID) REFERENCES Pedidos(PedidoID),
    FOREIGN KEY (VendedorID) REFERENCES Vendedores(VendedorID)
);
-- Si necesitas detallar qué pedidos específicos cubre un pago a vendedor
-- Esta tabla antes era 'DetallePagosVendedores', ahora más genérica si un pago cubre varios pedidos.
CREATE TABLE PagosDetallePedidos (
    PagosDetallePedidosID INT PRIMARY KEY IDENTITY(1,1),
    PagoID INT NOT NULL,
    PedidoID INT NOT NULL,
    MontoCorrespondiente DECIMAL(10, 2) NOT NULL, -- Monto del pedido cubierto por este pago
    UNIQUE (PagoID, PedidoID), -- Para evitar duplicados de la misma asociación
    FOREIGN KEY (PagoID) REFERENCES Pagos(PagoID),
    FOREIGN KEY (PedidoID) REFERENCES Pedidos(PedidoID)
);


-- 13. Tabla Facturas (Unificada para facturas de clientes y documentos de liquidación de vendedores)
CREATE TABLE Facturas (
    FacturaID INT PRIMARY KEY IDENTITY(1,1),
    FechaDeEmision DATETIME DEFAULT GETDATE(),
    MontoTotal DECIMAL(10,2) NOT NULL,
    URLFacturaPDF NVARCHAR(255),

    -- Define el tipo de factura:
    -- 'CLIENTE_COMPRA': Factura de compra para un cliente (ligada a un pedido).
    -- 'VENDEDOR_LIQUIDACION': Documento de liquidación para un vendedor (ligado a un pago a vendedor).
    -- 'CLIENTE_NOTA_CREDITO': Nota de crédito para un cliente (ligada a un reembolso/pedido).
    TipoDeFactura NVARCHAR(30) NOT NULL,

    -- Claves foráneas que ahora son puramente NULLABLE,
    -- sin ninguna restricción de base de datos sobre su combinación.
    PedidoID INT NULL, -- FK a Pedidos
    PagoID INT NULL, -- FK a Pagos

    FOREIGN KEY (PedidoID) REFERENCES Pedidos(PedidoID),
    FOREIGN KEY (PagoID) REFERENCES Pagos(PagoID)
);