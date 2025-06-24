using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using Microsoft.Data.SqlClient;
using System;

namespace PedidosAhorita.Server.BaseDeDatosConeccion.SQL
{
    public class SQLConeccion
    {
        private readonly string _connectionString;

        public SQLConeccion(string connectionString)
        {
            _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        }

        public int ExecuteNonQuery(string query, SqlParameter[] parameters = null)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand cmd = new SqlCommand(query, connection))
                    {
                        if (parameters != null)
                        {
                            cmd.Parameters.AddRange(parameters);
                        }
                        return cmd.ExecuteNonQuery();
                    }
                }
                catch (SqlException ex)
                {
                    Console.WriteLine($"SQL Server Database Error (NonQuery): {ex.Message}");
                    throw;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Unexpected Error (NonQuery): {ex.Message}");
                    throw;
                }
            }
        }

        public DataTable ExecuteQuery(string query, SqlParameter[] parameters = null)
        {
            DataTable dt = new DataTable();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand cmd = new SqlCommand(query, connection))
                    {
                        if (parameters != null)
                        {
                            cmd.Parameters.AddRange(parameters);
                        }
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            dt.Load(reader);
                        }
                    }
                }
                catch (SqlException ex)
                {
                    Console.WriteLine($"SQL Server Database Error (Query): {ex.Message}");
                    throw;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Unexpected Error (Query): {ex.Message}");
                    throw;
                }
            }
            return dt;
        }
        public static T MapDataRowTo<T>(DataRow row) where T : new()
        {
            T item = new T();
            foreach (PropertyInfo prop in typeof(T).GetProperties())
            {
                if (prop.CanWrite && row.Table.Columns.Contains(prop.Name))
                {
                    object value = row[prop.Name];
                    if (value == DBNull.Value)
                    {
                        prop.SetValue(item, null);
                    }
                    else
                    {
                        Type propertyType = prop.PropertyType;
                        if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                        {
                            propertyType = Nullable.GetUnderlyingType(propertyType);
                        }

                        if (value.GetType() == propertyType)
                        {
                            prop.SetValue(item, value);
                        }
                        else
                        {
                            try
                            {
                                prop.SetValue(item, Convert.ChangeType(value, propertyType));
                            }
                            catch (InvalidCastException)
                            {
                                Console.WriteLine($"Warning: Could not cast '{value.GetType().Name}' to '{propertyType.Name}' for property '{prop.Name}'.");
                            }
                            catch (FormatException)
                            {
                                Console.WriteLine($"Warning: Format error converting '{value}' for property '{prop.Name}'.");
                            }
                        }
                    }
                }
            }
            return item;
        }

    }
}