using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System;
using System.Linq; // Para FirstOrDefault
using System.Reflection; // Para GetProperty

namespace PedidosAhorita.Server.BaseDeDatosConeccion.MongoDB
{
    public class EjecucionMongo<TDocument> where TDocument : class
    {
        private readonly MongoConeccion _dbHelper;
        private readonly IMongoCollection<TDocument> _collection;
        private readonly string _collectionName;

        public EjecucionMongo(MongoConeccion dbHelper, string collectionName)
        {
            _dbHelper = dbHelper ?? throw new ArgumentNullException(nameof(dbHelper));
            _collectionName = collectionName ?? throw new ArgumentNullException(nameof(collectionName));
            _collection = _dbHelper.GetCollection<TDocument>(_collectionName);
        }

        private string GetIdFromDocument(TDocument document)
        {
            var idProperty = typeof(TDocument).GetProperty("Id");
            if (idProperty == null)
            {
                idProperty = typeof(TDocument).GetProperties()
                                .FirstOrDefault(p => p.GetCustomAttribute<BsonIdAttribute>() != null);
            }

            if (idProperty == null)
            {
                throw new InvalidOperationException($"La clase {typeof(TDocument).Name} debe tener una propiedad 'Id' o una propiedad marcada con [BsonId].");
            }
            return idProperty.GetValue(document)?.ToString();
        }

        public TDocument GetById(string id)
        {
            var filter = Builders<TDocument>.Filter.Eq("_id", id);
            return _collection.Find(filter).FirstOrDefault();
        }

        public List<TDocument> GetAll()
        {
            return _collection.Find(new BsonDocument()).ToList();
        }

        public void Add(TDocument document)
        {
            _collection.InsertOne(document);
        }

        public void Update(string id, TDocument document)
        {
            var filter = Builders<TDocument>.Filter.Eq("_id", id);
            _collection.ReplaceOne(filter, document);
        }

        public void Delete(string id)
        {
            var filter = Builders<TDocument>.Filter.Eq("_id", id);
            _collection.DeleteOne(filter);
        }

        public List<TDocument> Find(FilterDefinition<TDocument> filter)
        {
            return _collection.Find(filter).ToList();
        }
    }
}