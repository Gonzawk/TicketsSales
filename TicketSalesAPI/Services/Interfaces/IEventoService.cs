using TicketSalesAPI.Models;

namespace TicketSalesAPI.Services.Interfaces
{
    public interface IEventoService
    {
        Task<List<Evento>> GetAllEventsAsync();
        Task<Evento> GetEventoByIdAsync(int id); // Obtener un evento por ID
        Task<Evento> CreateEventoAsync(EventoDto eventoDto);
        Task<Evento> UpdateEventoAsync(int id, EventoDto eventoDto); // Actualizar un evento

        Task<IEnumerable<EventoDto>> BuscarEventosAsync(string? nombre, string? lugar, DateTime? fecha);
    }
}

