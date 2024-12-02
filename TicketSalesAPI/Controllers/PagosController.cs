using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using TicketSalesAPI.Models;
using TicketSalesAPI.Data;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace TicketSalesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagosController : ControllerBase
    {
        private readonly DataContext _context;

        public PagosController(DataContext context)
        {
            _context = context;
        }

        // 1. Listar todos los pagos
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult ListarPagos()
        {
            var pagos = _context.Pagos
                .Select(p => new PagoListDto
                {
                    PagoId = p.PagoId,
                    UsuarioId = p.UsuarioId,
                    UsuarioNombre = p.Usuario != null ? p.Usuario.Nombre : "Usuario no asignado", // Nombre del usuario
                    EventoId = p.EventoId,
                    EventoNombre = p.Evento != null ? p.Evento.Nombre : "Evento no asignado",    // Nombre del evento
                    EntradaId = p.EntradaId ?? (int?)null, // Asignar null si EntradaId es null
                    Monto = p.Monto,
                    MetodoPago = p.MetodoPago,
                    Estado = p.Estado
                }).ToList();

            return Ok(pagos);
        }
        

        // 2. Buscar un pago por ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult BuscarPagoPorId(int id)
        {
            var pago = _context.Pagos
                .Where(p => p.PagoId == id)
                .Select(p => new PagoDto
                {
                    PagoId = p.PagoId,
                    UsuarioId = p.UsuarioId,
                    EventoId = p.EventoId,
                    EntradaId = p.EntradaId ?? (int?)null, // Asignar null si EntradaId es null
                    Monto = p.Monto,
                    MetodoPago = p.MetodoPago,
                    Estado = p.Estado
                })
                .FirstOrDefault();

            if (pago == null)
                return NotFound($"El pago con ID {id} no fue encontrado.");

            return Ok(pago);
        }

        // 3. Confirmar el pago (utilizando el procedimiento almacenado)
        [HttpPost("confirmar-pago")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ConfirmarPago([FromBody] ConfirmarPagoDTO confirmacion)
        {
            if (confirmacion == null || confirmacion.PagoId <= 0)
                return BadRequest("Los datos de confirmación son obligatorios y el ID del pago debe ser válido.");

            try
            {
                // Ejecutar el procedimiento almacenado para confirmar el pago
                var parametros = new[]
                {
                    new SqlParameter("@PagoId", confirmacion.PagoId)
                };

                await _context.Database.ExecuteSqlRawAsync("EXEC sp_ConfirmarPago @PagoId", parametros);

                return Ok($"Pago con ID {confirmacion.PagoId} confirmado y entrada activada.");
            }
            catch (SqlException ex)
            {
                return StatusCode(500, $"Error al ejecutar el procedimiento almacenado: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error inesperado: {ex.Message}");
            }
        }

        // 1. Listar pagos pendientes
        [HttpGet("pendientes")]
        [Authorize(Roles = "Admin")]
        public IActionResult ListarPagosPendientes()
        {
            var pagosPendientes = _context.Pagos
                .Where(p => p.Estado.ToLower() == "pendiente")
                .Select(p => new PagoDto
                {
                    PagoId = p.PagoId,
                    UsuarioId = p.UsuarioId,
                    EventoId = p.EventoId,
                    Monto = p.Monto,
                    MetodoPago = p.MetodoPago,
                    Estado = p.Estado,
                    EntradaId = p.EntradaId ?? (int?)null, // Asignar null si EntradaId es null
                    EventoNombre = p.Evento != null ? p.Evento.Nombre : "Evento no asignado",
                    UsuarioNombre = p.Usuario != null ? p.Usuario.Nombre : "Usuario no asignado" // Aquí agregamos el nombre del usuario
                })
                .ToList();

            return Ok(pagosPendientes);
        }





        // 4. Cambiar el estado de un pago manualmente
        [HttpPut("cambiar-estado")]
        [Authorize(Roles = "Admin")]
        public IActionResult CambiarEstadoPago([FromBody] ActualizarEstadoPagoDto request)
        {
            var pago = _context.Pagos.Find(request.PagoId);

            if (pago == null)
                return NotFound($"El pago con ID {request.PagoId} no fue encontrado.");

            if (request.NuevoEstado != "Completado" && request.NuevoEstado != "Cancelado")
                return BadRequest("El nuevo estado debe ser 'Completado' o 'Cancelado'.");

            using var transaction = _context.Database.BeginTransaction();

            try
            {
                // Actualizar el estado del pago
                pago.Estado = request.NuevoEstado;
                _context.SaveChanges();

                if (request.NuevoEstado == "Completado")
                {
                    // Confirmar la entrada asociada
                    var entrada = _context.Entradas
                        .FirstOrDefault(e => e.UsuarioId == pago.UsuarioId && e.EventoId == pago.EventoId && e.Estado == "Reservada");

                    if (entrada != null)
                    {
                        entrada.Estado = "Activa";
                        entrada.CodigoQR = Guid.NewGuid().ToString();
                        _context.SaveChanges();
                    }
                }
                else if (request.NuevoEstado == "Cancelado")
                {
                    // Cancelar la entrada asociada
                    var entrada = _context.Entradas
                        .FirstOrDefault(e => e.UsuarioId == pago.UsuarioId && e.EventoId == pago.EventoId && e.Estado == "Reservada");

                    if (entrada != null)
                    {
                        entrada.Estado = "Cancelada";
                        _context.SaveChanges();

                        // Devolver la entrada al stock del evento
                        var evento = _context.Eventos.Find(pago.EventoId);
                        if (evento != null)
                        {
                            evento.EntradasDisponibles += 1;
                            _context.SaveChanges();
                        }
                    }
                }

                transaction.Commit();
                return Ok($"El estado del pago con ID {request.PagoId} fue actualizado a {request.NuevoEstado}.");
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return StatusCode(500, $"Error al actualizar el estado del pago: {ex.Message}");
            }
        }




        // 5. Listar pagos del usuario logueado
        [HttpGet("user/mis-pagos")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetPagosUsuario()
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

                // Obtener los pagos del usuario
                var pagos = await _context.Pagos
                    .Include(p => p.Evento)
                    .Include(p => p.Entrada)
                    .Where(p => p.UsuarioId == userId)
                    .Select(p => new PagoDto
                    {
                        PagoId = p.PagoId,
                        UsuarioId = p.UsuarioId,
                        EventoId = p.EventoId,
                        EntradaId = p.EntradaId ?? (int?)null, // Asignar null si EntradaId es null
                        Monto = p.Monto,
                        MetodoPago = p.MetodoPago,
                        Estado = p.Estado,
                        EventoNombre = p.Evento != null ? p.Evento.Nombre : "Evento no asignado",
                        //EntradaEstado = p.Entrada != null ? p.Entrada.Estado : "Entrada no asignada"
                    })
                    .ToListAsync();

                // Verificar si hay pagos
                if (!pagos.Any())
                    return NotFound("No tienes pagos registrados.");

                return Ok(pagos);
            }
            catch (Exception ex)
            {
                // Registrar el error en el log
                Console.Error.WriteLine($"Error en GetPagosUsuario: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error interno en el servidor.");
            }
        }


        // 4. Cancelar el pago (utilizando el procedimiento almacenado)
        [HttpPost("cancelar-pago")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CancelarPago([FromBody] CancelarPagoDto cancelacion)
        {
            if (cancelacion == null || cancelacion.PagoId <= 0)
                return BadRequest("Los datos de cancelación son obligatorios y el ID del pago debe ser válido.");

            try
            {
                // Obtener el ID de la entrada asociada al pago
                var pago = await _context.Pagos
                    .Where(p => p.PagoId == cancelacion.PagoId)
                    .FirstOrDefaultAsync();

                if (pago == null)
                    return NotFound($"Pago con ID {cancelacion.PagoId} no encontrado.");

                // Si el estado del pago ya es 'Cancelado', no hacer nada
                if (pago.Estado == "Cancelado")
                    return BadRequest("Este pago ya está cancelado.");

                // Obtener el ID de la entrada asociada al pago
                var entradaId = pago.EntradaId;

                // Ejecutar el procedimiento almacenado para cancelar la entrada
                var parametros = new[] {
            new SqlParameter("@EntradaId", entradaId)
        };

                await _context.Database.ExecuteSqlRawAsync("EXEC sp_CancelarEntrada @EntradaId", parametros);

                // Actualizar el estado del pago
                pago.Estado = "Cancelado";
                _context.Pagos.Update(pago);
                await _context.SaveChangesAsync();

                return Ok($"Pago con ID {cancelacion.PagoId} cancelado y entrada desactivada.");
            }
            catch (SqlException ex)
            {
                return StatusCode(500, $"Error al ejecutar el procedimiento almacenado: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error inesperado: {ex.Message}");
            }
        }




    }

}