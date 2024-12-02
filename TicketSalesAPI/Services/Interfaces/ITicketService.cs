// ITicketService.cs
using TicketSalesAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TicketSalesAPI.Services.Interfaces
{
    public interface ITicketService
    {
        Task<List<Entrada>> GetTicketsByUserIdAsync(int userId); // Obtener tickets de un usuario
        Task<Entrada> GetEntradaDetailsByIdAsync(int entradaId, int userId); // Obtener detalles de una entrada por su ID
        Task<Entrada> ConfirmarUsoEntradaAsync(string codigoQr); // Confirmar el uso de una entrada

        // Método para realizar una compra de entrada
        Task<Entrada> ComprarEntradaAsync(int userId, int eventoId, decimal monto, string metodoPago);
    }
}
