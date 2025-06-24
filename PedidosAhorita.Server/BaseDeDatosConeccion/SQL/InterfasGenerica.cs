using System;
using System.Collections.Generic;
using System.Linq;


namespace PedidosAhorita.Server.BaseDeDatosConeccion.SQL
{
    public interface InterfasGenerica<T> where T : class
    {
        T GetById(int id);
        List<T> GetAll();
        void Add(T entity);
        void Update(T entity);
        void Delete(int id);
    }
}