using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TicketSalesAPI.Data;
using TicketSalesAPI.Models;
using TicketSalesAPI.Services;
using TicketSalesAPI.Services.Interfaces;

namespace TicketSalesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntradasController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ITicketService _ticketService; // Añadir el servicio de tickets

        public EntradasController(DataContext context, ITicketService ticketService)
        {
            _context = context;
            _ticketService = ticketService; // Inyectar el servicio de tickets
        }

        /// <summary>
        /// Lista todas las entradas (Solo para Admin).
        /// </summary>
        [HttpGet("admin/listar")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTodasEntradas()
        {
            try
            {
                var entradas = await _context.Entradas
                    .Include(e => e.Evento)
                    .Include(e => e.Usuario)
                    .Select(e => new EntradaAdminDto
                    {
                        EntradaId = e.EntradaId,
                        EventoId = e.EventoId,
                        EventoNombre = e.Evento != null ? e.Evento.Nombre : "Evento no encontrado", // Validación para Evento
                        UsuarioId = e.UsuarioId,
                        UsuarioNombre = e.Usuario != null ? e.Usuario.Nombre : "Usuario no encontrado", // Validación para Usuario
                        FechaCreacion = e.FechaCreacion,
                        Estado = e.Estado ?? "Estado desconocido" // Validación para Estado, en caso de ser null
                    })
                    .ToListAsync();

                if (!entradas.Any())
                    return NotFound("No se encontraron entradas.");

                return Ok(entradas);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener las entradas: {ex.Message}");
            }
        }


        /// <summary>
        /// Obtiene los detalles de una entrada por su ID (Solo para Admin).
        /// </summary>
        [HttpGet("admin/detalles/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetEntradaPorId(int id)
        {
            try
            {
                var entrada = await _context.Entradas
                    .Include(e => e.Evento)
                    .Include(e => e.Usuario)
                    .Where(e => e.EntradaId == id)
                    .Select(e => new EntradaAdminDto
                    {
                        EntradaId = e.EntradaId,
                        EventoId = e.EventoId,
                        EventoNombre = e.Evento.Nombre,
                        UsuarioId = e.UsuarioId,
                        UsuarioNombre = e.Usuario.Nombre,
                        FechaCreacion = e.FechaCreacion,
                        Estado = e.Estado
                    })
                    .FirstOrDefaultAsync();

                if (entrada == null)
                    return NotFound("Entrada no encontrada.");

                return Ok(entrada);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener la entrada: {ex.Message}");
            }
        }

        /// <summary>
        /// Lista las entradas compradas por el usuario autenticado (Solo para User).
        /// </summary>
        [HttpGet("user/mis-entradas")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetMisEntradas()
        {
            try
            {
                // Obtener el ID del usuario desde los claims
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized("No se pudo identificar al usuario.");

                // Convertir el ID de usuario a entero
                if (!int.TryParse(userIdClaim.Value, out var userId))
                    return BadRequest("El ID del usuario no es válido.");

                // Verificar si el usuario existe
                var userExists = await _context.Users.AnyAsync(u => u.UsuarioId == userId);
                if (!userExists)
                    return NotFound("El usuario no existe.");

                // Obtener las entradas del usuario
                var entradas = await _context.Entradas
                    .Include(e => e.Evento)
                    .Where(e => e.UsuarioId == userId)
                    .Select(e => new EntradaUserDto
                    {
                        EntradaId = e.EntradaId,
                        EventoNombre = e.Evento.Nombre,
                        FechaCreacion = e.FechaCreacion,
                        Estado = e.Estado
                    })
                    .ToListAsync();

                // Verificar si hay entradas
                if (!entradas.Any())
                    return NotFound("No tienes entradas registradas.");

                return Ok(entradas);
            }
            catch (Exception ex)
            {
                // Registrar el error en el log
                Console.Error.WriteLine($"Error en GetMisEntradas: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error interno en el servidor.");
            }
        }



        /// <summary>
        /// Verifica el estado de una entrada usando su código QR (Solo para Admin).
        /// </summary>
        [HttpGet("admin/verificar-estado/{codigoQr}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> VerificarEstadoEntrada(string codigoQr)
        {
            try
            {
                var entrada = await _context.Entradas
                    .Where(e => e.CodigoQR == codigoQr)
                    .FirstOrDefaultAsync();

                if (entrada == null)
                    return NotFound("Entrada no encontrada.");

                return Ok(new
                {
                    EntradaId = entrada.EntradaId,
                    Estado = entrada.Estado
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al verificar el estado de la entrada: {ex.Message}");
            }
        }

        /// <summary>
        /// Verifica el estado de una entrada usando su código QR (Solo para Admin) y marca la entrada como usada si es "Activa".
        /// </summary>
        [HttpPost("admin/confirmar-uso/{codigoQr}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ConfirmarUsoEntrada(string codigoQr)
        {
            try
            {
                // Verificar si el código QR existe en la base de datos
                var entrada = await _context.Entradas
                    .Where(e => e.CodigoQR == codigoQr)
                    .FirstOrDefaultAsync();

                if (entrada == null)
                    return NotFound("Entrada no encontrada.");

                // Si la entrada está en estado "Activa", ejecutar el procedimiento para marcarla como "Usada"
                if (entrada.Estado == "Activa")
                {
                    var parametros = new[]
                    {
                new SqlParameter("@CodigoQR", codigoQr)
            };

                    // Ejecutar el procedimiento almacenado
                    var result = await _context.Database.ExecuteSqlRawAsync("EXEC sp_ConfirmarUsoEntrada @CodigoQR", parametros);

                    // Si el procedimiento se ejecuta correctamente, el estado de la entrada ha cambiado a 'Usada'
                    return Ok(new { mensaje = "La entrada se ha marcado como usada correctamente." });
                }
                else
                {
                    // Si la entrada no está activa, devolver un mensaje con el estado actual
                    return BadRequest(new
                    {
                        error = $"La entrada no está activa. Estado actual: {entrada.Estado}. Revise el estado de la entrada."
                    });
                }
            }
            catch (SqlException ex)
            {
                // Si ocurre un error en la base de datos, se maneja y se lanza una respuesta de error
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al ejecutar el procedimiento almacenado: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Manejo general de excepciones
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error inesperado: {ex.Message}");
            }
        }



        // Obtener los detalles de una entrada solo para los roles User y Admin
        [HttpGet("entradas/{entradaId}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetEntradaDetails(int entradaId)
        {
            // Obtener el ID del usuario desde los claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("No se pudo identificar al usuario.");

            // Convertir el ID de usuario a entero
            var userId = int.Parse(userIdClaim.Value);

            try
            {
                // Obtener la entrada por ID y verificar si pertenece al usuario
                var entrada = await _context.Entradas
                    .Include(e => e.Evento)
                    .FirstOrDefaultAsync(e => e.EntradaId == entradaId && e.UsuarioId == userId);

                // Verificar si la entrada existe
                if (entrada == null)
                    return NotFound("Entrada no encontrada para el usuario especificado.");

                // Crear el DTO para la respuesta
                var entradaDto = new EntradaUserDto
                {
                    EntradaId = entrada.EntradaId,
                    EventoNombre = entrada.Evento.Nombre,
                    FechaCreacion = entrada.FechaCreacion,
                    Estado = entrada.Estado,
                    CodigoQR = entrada.CodigoQR
                };

                return Ok(entradaDto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener la entrada: {ex.Message}");
            }
        }


        // Comprar una entrada para un evento (Para usuario autenticado)
        [HttpPost("user/comprar/{eventoId}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> ComprarEntrada(int eventoId, [FromBody] ComprarEntradaRequest request)
        {
            // Obtener el ID del usuario autenticado
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("No se pudo identificar al usuario.");

            var userId = int.Parse(userIdClaim.Value);

            try
            {
                // Intentar realizar la compra/reserva de la entrada
                var entrada = await _ticketService.ComprarEntradaAsync(userId, eventoId, request.Monto, request.MetodoPago);

                if (entrada == null)
                    return BadRequest("No se pudo completar la reserva de la entrada. Verifique si hay entradas disponibles o si ya tiene una entrada reservada para este evento.");

                // Responder con la información de la entrada reservada
                return Ok(new
                {
                    EntradaId = entrada.EntradaId,
                    EventoId = entrada.EventoId,
                    Estado = entrada.Estado,
                    FechaCreacion = entrada.FechaCreacion
                });
            }
            catch (Exception ex)
            {
                // Manejo de errores
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al reservar la entrada: {ex.Message}");
            }
        }







        // Método para obtener el userId del token JWT
        private int? GetUserIdFromToken()
        {
            var userIdClaim = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            return null;
        }

    }
}
