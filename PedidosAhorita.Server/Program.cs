using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using PedidosAhorita.Server; // Asegúrate de que este sea tu namespace correcto para AlmacenDeDependecias
using Microsoft.Extensions.Logging; // Añadir para el ErrorController

var builder = WebApplication.CreateBuilder(args);

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            // Permite solicitudes desde tu frontend (ajusta el puerto si es diferente)
            // Para desarrollo, podrías usar .AllowAnyOrigin() pero NO en producción.
            policy.WithOrigins("http://localhost:3000", "http://localhost:4200", "http://localhost:8080") // Ejemplos de puertos comunes de frontend
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Añadir el servicio de logging si aún no está (necesario para ErrorController)
builder.Services.AddLogging();


var app = builder.Build();

// >> MOVER AQUÍ LA INICIALIZACIÓN DE ALMACEN DE DEPENDENCIAS <<
// Accede a la configuración desde el IServiceProvider de la aplicación
AlmacenDeDependecias.Initialize(app.Services.GetRequiredService<IConfiguration>());

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // Opcional: Si quieres ver la página de errores de desarrollador en lugar del ErrorController durante el desarrollo
    // app.UseDeveloperExceptionPage();
}
else
{
    // EN PRODUCCIÓN: Redirige a ErrorController para errores no manejados
    app.UseExceptionHandler("/Error");
    // Opcional: También puedes añadir un HSTS si estás usando HTTPS y no quieres que los navegadores accedan por HTTP
    // app.UseHsts();
}

app.UseHttpsRedirection();

// >> MOVER app.UseRouting() AQUÍ <<
app.UseRouting(); // Importante: Debe ir antes de UseCors y UseAuthorization

// >> MOVER app.UseCors() AQUÍ <<
app.UseCors(); // Debe ir después de UseRouting y antes de UseAuthorization/MapControllers

app.UseAuthorization();

app.MapControllers(); // Aquí se mapean las rutas de tus controladores API

app.MapFallbackToFile("/index.html"); // Esto es para aplicaciones SPA (Single Page Application)


app.Run();