using System.Collections.Generic;
using MongoDB.Bson; // Necesario para ObjectId
using MongoDB.Driver;

namespace PedidosAhorita.Server.BaseDeDatosConeccion.MongoDB
{
    public interface InterfasGenericaM<TDocument> 
    {
        TDocument GetById(string id);
        List<TDocument> GetAll();
        void Add(TDocument document);
        void Update(string id, TDocument document);
        void Delete(string id);
        List<TDocument> Find(FilterDefinition<TDocument> filter);
    }
}