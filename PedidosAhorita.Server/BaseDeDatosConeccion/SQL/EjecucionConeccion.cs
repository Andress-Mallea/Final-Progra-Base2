using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection; // Para GetProperties
using Microsoft.Data.SqlClient;
using System.Data;

namespace PedidosAhorita.Server.BaseDeDatosConeccion.SQL
{
    public class EjecucionConeccion<T> : InterfasGenerica<T> where T : class, new()
    {
        protected readonly SQLConeccion _dbHelper;
        protected readonly string _tableName;
        protected readonly string _idColumnName;
        public EjecucionConeccion(SQLConeccion dbHelper, string tableName, string idColumnName)
        {
            _dbHelper = dbHelper ?? throw new ArgumentNullException(nameof(dbHelper));
            _tableName = tableName ?? throw new ArgumentNullException(nameof(tableName));
            _idColumnName = idColumnName ?? throw new ArgumentNullException(nameof(idColumnName));
        }
         public T GetById(int id)
        {
            string query = $"SELECT * FROM {_tableName} WHERE {_idColumnName} = @id";
            SqlParameter[] parameters = { new SqlParameter("@id", id) };
            DataTable dt = _dbHelper.ExecuteQuery(query, parameters);
            if (dt.Rows.Count > 0)
            {
                return SQLConeccion.MapDataRowTo<T>(dt.Rows[0]);
            }
            return null;
        }

        public List<T> GetAll()
        {
            string query = $"SELECT * FROM {_tableName}";
            DataTable dt = _dbHelper.ExecuteQuery(query);
            List<T> items = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                items.Add(SQLConeccion.MapDataRowTo<T>(row));
            }
            return items;
        }

        public void Add(T entity)
        {
            // Para una implementación robusta de Add con IDENTITY en SQL Server:
            // 1. Excluir la columna PK si es autoincremental (IDENTITY).
            // 2. Usar 'SELECT SCOPE_IDENTITY()' para recuperar el ID generado y asignarlo a la entidad.
            // Este ejemplo es simplificado y asume que la PK no es IDENTITY o se gestiona externamente.

            var properties = typeof(T).GetProperties()
                                      .Where(p => p.Name != _idColumnName && p.CanRead && p.CanWrite)
                                      .ToList();

            var columnNames = string.Join(", ", properties.Select(p => p.Name));
            var parameterNames = string.Join(", ", properties.Select(p => "@" + p.Name));
            string query = $"INSERT INTO {_tableName} ({columnNames}) VALUES ({parameterNames})";

            List<SqlParameter> parameters = new List<SqlParameter>();
            foreach (var prop in properties)
            {
                parameters.Add(new SqlParameter($"@{prop.Name}", prop.GetValue(entity) ?? DBNull.Value));
            }

            _dbHelper.ExecuteNonQuery(query, parameters.ToArray());
        }

        public void Update(T entity)
        {
            var properties = typeof(T).GetProperties()
                                      .Where(p => p.Name != _idColumnName && p.CanRead && p.CanWrite)
                                      .ToList();
            var setClauses = string.Join(", ", properties.Select(p => $"{p.Name} = @{p.Name}"));
            string query = $"UPDATE {_tableName} SET {setClauses} WHERE {_idColumnName} = @{_idColumnName}";

            List<SqlParameter> parameters = new List<SqlParameter>();
            foreach (var prop in properties)
            {
                parameters.Add(new SqlParameter($"@{prop.Name}", prop.GetValue(entity) ?? DBNull.Value));
            }
            // Add the primary key parameter for the WHERE clause
            parameters.Add(new SqlParameter($"@{_idColumnName}", typeof(T).GetProperty(_idColumnName).GetValue(entity)));

            _dbHelper.ExecuteNonQuery(query, parameters.ToArray());
        }

        public void Delete(int id)
        {
            string query = $"DELETE FROM {_tableName} WHERE {_idColumnName} = @id";
            SqlParameter[] parameters = { new SqlParameter("@id", id) };
            _dbHelper.ExecuteNonQuery(query, parameters);
        }
    }
}