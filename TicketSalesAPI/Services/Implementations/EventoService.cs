using Microsoft.EntityFrameworkCore;
using TicketSalesAPI.Data;
using TicketSalesAPI.Models;
using TicketSalesAPI.Services.Interfaces;

namespace TicketSalesAPI.Services.Implementations
{
    public class EventoService : IEventoService
    {
        private readonly DataContext _context;

        public EventoService(DataContext context)
        {
            _context = context;
        }

        // Obtener todos los eventos
        public async Task<List<Evento>> GetAllEventsAsync()
        {
            return await _context.Eventos.ToListAsync();
        }

        // Obtener un evento por ID
        public async Task<Evento> GetEventoByIdAsync(int id)
        {
            return await _context.Eventos.FirstOrDefaultAsync(e => e.EventoId == id);
        }

        // Crear un nuevo evento
        public async Task<Evento> CreateEventoAsync(EventoDto eventoDto)
        {
            var evento = new Evento
            {
                Nombre = eventoDto.Nombre,
                Descripcion = eventoDto.Descripcion,
                Fecha = eventoDto.Fecha,
                Ubicacion = eventoDto.Ubicacion,
                Precio = eventoDto.Precio,
                EntradasDisponibles = eventoDto.EntradasDisponibles,
                Estado = "Activo"
            };

            _context.Eventos.Add(evento);
            await _context.SaveChangesAsync();
            return evento;
        }

        // Actualizar un evento
        public async Task<Evento> UpdateEventoAsync(int id, EventoDto eventoDto)
        {
            var evento = await _context.Eventos.FirstOrDefaultAsync(e => e.EventoId == id);
            if (evento == null)
            {
                return null;
            }

            // Actualizar los detalles del evento
            evento.Nombre = eventoDto.Nombre;
            evento.Descripcion = eventoDto.Descripcion;
            evento.Fecha = eventoDto.Fecha;
            evento.Ubicacion = eventoDto.Ubicacion;
            evento.Precio = eventoDto.Precio;
            evento.EntradasDisponibles = eventoDto.EntradasDisponibles;

            _context.Eventos.Update(evento);
            await _context.SaveChangesAsync();
            return evento;
        }

        // Buscar eventos por nombre, lugar o fecha
        public async Task<IEnumerable<EventoDto>> BuscarEventosAsync(string? nombre, string? lugar, DateTime? fecha)
        {
            var query = _context.Eventos.AsQueryable();

            if (!string.IsNullOrEmpty(nombre))
            {
                query = query.Where(e => EF.Functions.Like(e.Nombre, $"%{nombre}%"));
            }

            if (!string.IsNullOrEmpty(lugar))
            {
                query = query.Where(e => EF.Functions.Like(e.Ubicacion, $"%{lugar}%"));
            }

            if (fecha.HasValue)
            {
                query = query.Where(e => e.Fecha.Date == fecha.Value.Date);
            }

            return await query
                .Select(e => new EventoDto
                {
                    Nombre = e.Nombre,
                    Descripcion = e.Descripcion,  // Incluir descripción
                    Fecha = e.Fecha,
                    Ubicacion = e.Ubicacion,
                    Precio = e.Precio,  // Incluir precio
                    EntradasDisponibles = e.EntradasDisponibles  // Incluir entradas disponibles
                })
                .ToListAsync();
        }
    }
}



