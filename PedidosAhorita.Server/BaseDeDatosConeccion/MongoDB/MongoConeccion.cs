using MongoDB.Driver;
using System;
using System.Collections.Generic; // Para List
namespace PedidosAhorita.Server.BaseDeDatosConeccion.MongoDB
{
    public class MongoConeccion
    {
        private readonly IMongoClient _client;
        private readonly string _databaseName;

        public MongoConeccion(string connectionString, string databaseName)
        {
            _client = new MongoClient(connectionString);
            _databaseName = databaseName ?? throw new ArgumentNullException(nameof(databaseName));
        }

        public IMongoDatabase GetDatabase()
        {
            return _client.GetDatabase(_databaseName);
        }

        public IMongoCollection<TDocument> GetCollection<TDocument>(string collectionName)
        {
            return GetDatabase().GetCollection<TDocument>(collectionName);
        }
        public void InsertOne<TDocument>(string collectionName, TDocument document)
        {
            var collection = GetCollection<TDocument>(collectionName);
            collection.InsertOne(document); // Versión síncrona
        }

        public TDocument FindById<TDocument>(string collectionName, string id)
        {
            var collection = GetCollection<TDocument>(collectionName);
            var filter = Builders<TDocument>.Filter.Eq("_id", id);
            return collection.Find(filter).FirstOrDefault(); // Versión síncrona
        }

        public long UpdateOne<TDocument>(string collectionName, FilterDefinition<TDocument> filter, UpdateDefinition<TDocument> update)
        {
            var collection = GetCollection<TDocument>(collectionName);
            var result = collection.UpdateOne(filter, update); // Versión síncrona
            return result.ModifiedCount;
        }

        public long DeleteOne<TDocument>(string collectionName, FilterDefinition<TDocument> filter)
        {
            var collection = GetCollection<TDocument>(collectionName);
            var result = collection.DeleteOne(filter); // Versión síncrona
            return result.DeletedCount;
        }

        public List<TDocument> Find<TDocument>(string collectionName, FilterDefinition<TDocument> filter = null)
        {
            var collection = GetCollection<TDocument>(collectionName);
            if (filter == null)
            {
                filter = Builders<TDocument>.Filter.Empty;
            }
            return collection.Find(filter).ToList(); // Versión síncrona
        }
    }
}