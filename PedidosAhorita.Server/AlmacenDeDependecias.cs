using Microsoft.Extensions.Configuration;
using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.BaseDeDatosConeccion.MongoDB;
using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using System;
using System.Collections.Generic;
using PedidosAhorita.Server.Tablas.SQLModels;
namespace PedidosAhorita.Server
{
    public static class AlmacenDeDependecias
    {
        public static SQLConeccion SQL { get; private set; }
        public static MongoConeccion Mongo { get; private set; }
        public static InterfasGenerica<CategoriaProducto> CategoriaProductoTabla { get; private set; }
        public static InterfasGenerica<Cliente> ClienteTabla { get; private set; }
        public static InterfasGenerica<DetalleDePedido> DetalleDePedidoTabla { get; private set; }
        public static InterfasGenerica<Empleado> EmpleadoTabla { get; private set; }
        public static InterfasGenerica<EstadoPedido> EstadoPedidoTabla { get; private set; }
        public static InterfasGenerica<Factura> FacturaTabla { get; private set; }
        public static InterfasGenerica<Pago> PagoTabla { get; private set; }
        public static InterfasGenerica<PagosDetallePedido> PagosDetallePedidoTabla { get; private set; }
        public static InterfasGenerica<Pedido> PedidoTabla { get; private set; }
        public static InterfasGenerica<Producto> ProductoTabla { get; private set; }
        public static InterfasGenerica<RolDeUsuario> RolDeUsuarioTabla { get; private set; }
        public static InterfasGenerica<Tiendas> TiendasTabla { get; private set; }
        public static InterfasGenerica<UsuarioRol> UsuarioRolTabla { get; private set; }
        public static InterfasGenerica<Usuarios> UsuariosTabla { get; private set; }
         public static void Initialize(IConfiguration configuration)
        {
            // Inicializar SQL Server
            string sqlConnectionString = "Server=MSI\\MSSQLSERVER01;Database=a;Integrated Security=True;TrustServerCertificate=True";
            SQL = new SQLConeccion(sqlConnectionString);
            CategoriaProductoTabla = new EjecucionConeccion<CategoriaProducto>(SQL, "CategoriaProductos","CategoriaID");
            ClienteTabla = new EjecucionConeccion<Cliente>(SQL, "Clientes", "ClienteID");
            DetalleDePedidoTabla = new EjecucionConeccion<DetalleDePedido>(SQL, "DetallesDePedido", "PedidoID");
            EmpleadoTabla = new EjecucionConeccion<Empleado>(SQL, "Empleados", "EmpleadoID");
            EstadoPedidoTabla = new EjecucionConeccion<EstadoPedido>(SQL, "EstadoPedidos", "EstadoID");
            FacturaTabla = new EjecucionConeccion<Factura>(SQL, "Facturas", "FacturaID");
            PagoTabla = new EjecucionConeccion<Pago>(SQL, "Pagos", "PagoID");
            PagosDetallePedidoTabla = new EjecucionConeccion<PagosDetallePedido>(SQL, "PagosDetallePedido", "PagosDetallePedidosID");
            PedidoTabla = new EjecucionConeccion<Pedido>(SQL, "Pedidos", "PedidoID");
            ProductoTabla = new EjecucionConeccion<Producto>(SQL, "Productos", "ProductoID");
            RolDeUsuarioTabla = new EjecucionConeccion<RolDeUsuario>(SQL, "RolesDeUsuarios", "RolID");
            TiendasTabla = new EjecucionConeccion<Tiendas>(SQL, "Tiendas", "TiendaID");
            UsuarioRolTabla = new EjecucionConeccion<UsuarioRol>(SQL, "UsuariosRoles", "UsuarioID");
            UsuariosTabla = new EjecucionConeccion<Usuarios>(SQL, "Usuarios", "UsuarioID");
        
            // Inicializar MongoDB
            string mongoConnectionString = "mongodb://localhost:27017";
            string mongoDatabaseName = "PedidosAhorita";
            Mongo = new MongoConeccion(mongoConnectionString, mongoDatabaseName);
        }
    }
}