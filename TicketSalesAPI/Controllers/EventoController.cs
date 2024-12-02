using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketSalesAPI.Models;
using TicketSalesAPI.Services.Interfaces;

namespace TicketSalesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        private readonly IEventoService _eventoService;

        public EventoController(IEventoService eventoService)
        {
            _eventoService = eventoService;
        }

        // Obtener todos los eventos (Roles: Admin, User)
        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetEventos()
        {
            var eventos = await _eventoService.GetAllEventsAsync();
            return Ok(eventos);
        }

        // Obtener un evento por ID (Roles: Admin, User)
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetEventoById(int id)
        {
            var evento = await _eventoService.GetEventoByIdAsync(id);
            if (evento == null)
            {
                return NotFound(new { message = "Evento no encontrado" });
            }
            return Ok(evento);
        }

        // Crear un evento (Rol: Admin)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateEvento([FromBody] EventoDto eventoDto)
        {
            var evento = await _eventoService.CreateEventoAsync(eventoDto);
            return Ok(evento);
        }

        // Modificar un evento (Rol: Admin)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEvento(int id, [FromBody] EventoDto eventoDto)
        {
            var eventoActualizado = await _eventoService.UpdateEventoAsync(id, eventoDto);
            if (eventoActualizado == null)
            {
                return NotFound(new { message = "Evento no encontrado para actualizar" });
            }
            return Ok(eventoActualizado);
        }

        // Buscar eventos por nombre, lugar o fecha (Roles: Admin, User)
        [HttpGet("buscar")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> BuscarEventos(
     [FromQuery] string? nombre = null,
     [FromQuery] string? lugar = null,
     [FromQuery] DateTime? fecha = null)
        {
            try
            {
                // Validar parámetros
                if (string.IsNullOrWhiteSpace(nombre) && string.IsNullOrWhiteSpace(lugar) && fecha == null)
                {
                    return BadRequest(new { message = "Debe proporcionar al menos un criterio de búsqueda." });
                }

                var eventos = await _eventoService.BuscarEventosAsync(nombre, lugar, fecha);

                if (eventos == null || !eventos.Any())
                {
                    return NotFound(new { message = "No se encontraron eventos con los criterios especificados." });
                }

                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al buscar eventos: {ex.Message}");
            }
        }



    }
}


