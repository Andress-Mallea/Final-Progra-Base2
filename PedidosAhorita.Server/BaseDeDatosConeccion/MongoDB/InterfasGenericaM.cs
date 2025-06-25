using System;
using System.Collections.Generic;
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

        // Métodos para compatibilidad con el controlador
        List<TDocument> FilterBy(Func<TDocument, bool> filter);
        void ReplaceOne(TDocument document);
        void InsertOne(TDocument document);
        void DeleteOne(Func<TDocument, bool> filter);
    }
}