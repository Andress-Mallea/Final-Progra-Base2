using Microsoft.AspNetCore.Diagnostics; // Necesario para IExceptionHandlerFeature
using Microsoft.AspNetCore.Mvc;
using System;
using System.Diagnostics; // Necesario para Activity.Current?.Id o HttpContext.TraceIdentifier

namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)] // Opcional: Para ocultarlo de Swagger/OpenAPI
    public class ErroControlador : ControllerBase
    {
// Una buena práctica es inyectar un logger para registrar los errores
        private readonly ILogger<ErroControlador> _logger;

        public ErroControlador(ILogger<ErroControlador> logger)
        {
            _logger = logger;
        }

        // Este método se llamará cuando ocurra una excepción no manejada
        // y se configure app.UseExceptionHandler("/Error").
        // La ruta "[Route("/Error")]" es la que se especifica en UseExceptionHandler.
        [Route("/Error")]
        public IActionResult Error()
        {
            // Obtiene la información de la excepción
            var exceptionHandlerPathFeature =
                HttpContext.Features.Get<IExceptionHandlerPathFeature>();

            // Si hay una excepción, la registramos.
            if (exceptionHandlerPathFeature?.Error != null)
            {
                _logger.LogError(exceptionHandlerPathFeature.Error,
                                 "Ha ocurrido un error inesperado en la ruta: {Path}",
                                 exceptionHandlerPathFeature.Path);
            }

            // Construye un objeto de respuesta de error.
            // En un entorno de producción, es crucial NO exponer detalles sensibles de la excepción.
            // Para desarrollo, podrías incluir más detalles para depuración.
            var errorDetails = new
            {
                // Un ID de correlación para ayudar a rastrear el error en los logs
                TraceId = Activity.Current?.Id ?? HttpContext.TraceIdentifier,
                Message = "Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde.",
                // Solo en desarrollo, NO en producción:
                // ExceptionMessage = exceptionHandlerPathFeature?.Error?.Message,
                // StackTrace = exceptionHandlerPathFeature?.Error?.StackTrace
            };

            // Determina el código de estado HTTP.
            // Generalmente, un error no manejado es un 500 Internal Server Error.
            // Si quieres manejar tipos específicos de errores con diferentes códigos,
            // tendrías que analizar exceptionHandlerPathFeature.Error.GetType().
            return StatusCode(500, errorDetails);
        }

        // Opcional: Un endpoint para errores específicos en entornos de desarrollo (con detalles completos)
        // [Route("/Error-Development")] // Puedes exponerlo solo en desarrollo
        // [ApiExplorerSettings(IgnoreApi = false)] // Si lo quieres visible en Swagger en desarrollo
        // public IActionResult ErrorDevelopment()
        // {
        //     if (!Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT").Equals("Development", StringComparison.OrdinalIgnoreCase))
        //     {
        //         return NotFound(); // No disponible en producción
        //     }

        //     var exceptionHandlerPathFeature =
        //         HttpContext.Features.Get<IExceptionHandlerPathFeature>();

        //     var errorDetails = new
        //     {
        //         TraceId = Activity.Current?.Id ?? HttpContext.TraceIdentifier,
        //         Message = "Detalles del error en entorno de desarrollo.",
        //         ExceptionMessage = exceptionHandlerPathFeature?.Error?.Message,
        //         StackTrace = exceptionHandlerPathFeature?.Error?.StackTrace,
        //         Path = exceptionHandlerPathFeature?.Path
        //     };

        //     return StatusCode(500, errorDetails);
        // }
    }
}