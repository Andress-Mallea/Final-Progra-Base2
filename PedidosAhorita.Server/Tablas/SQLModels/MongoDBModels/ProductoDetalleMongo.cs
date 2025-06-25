// PedidosAhorita.Server/Tablas/MongoDBModels/ProductoDetalleMongo.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PedidosAhorita.Server.Tablas.MongoDBModels
{
    public class ProductoDetalleMongo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!; // El _id de MongoDB

        [BsonElement("ProductoID")]
        public int ProductoID { get; set; }

        [BsonElement("Nombre")]
        public string Nombre { get; set; } = default!;

        [BsonElement("Precio")]
        public double Precio { get; set; }

        [BsonElement("Cantidad")]
        public int Cantidad { get; set; } // Cantidad de stock

        [BsonElement("descripcion")] // Coincide con el casing en tu imagen de MongoDB
        public string Descripcion { get; set; } = default!;

        [BsonElement("imagen")]     // Coincide con el casing en tu imagen de MongoDB
        public string Imagen { get; set; } = default!;
        // Añadido para resolver el error "Element 'VendedorID' does not match"
        [BsonElement("VendedorID")]
        public int VendedorID { get; set; } 
    }
}
