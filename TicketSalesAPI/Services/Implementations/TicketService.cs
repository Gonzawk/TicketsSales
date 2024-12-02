// TicketService.cs
using TicketSalesAPI.Data;
using TicketSalesAPI.Models;
using TicketSalesAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace TicketSalesAPI.Services.Implementations
{
    public class TicketService : ITicketService
    {
        private readonly DataContext _context;

        public TicketService(DataContext context)
        {
            _context = context;
        }

        // Obtener entradas de un usuario específico
        public async Task<List<Entrada>> GetTicketsByUserIdAsync(int userId)
        {
            return await _context.Entradas
                .Where(t => t.UsuarioId == userId)
                .ToListAsync();
        }

        // Obtener detalles de una entrada específica de un usuario
        public async Task<Entrada> GetEntradaDetailsByIdAsync(int entradaId, int userId)
        {
            return await _context.Entradas
                .FirstOrDefaultAsync(e => e.EntradaId == entradaId && e.UsuarioId == userId);
        }

        // Confirmar el uso de una entrada por su código QR
        public async Task<Entrada> ConfirmarUsoEntradaAsync(string codigoQr)
        {
            var entrada = await _context.Entradas
                .FirstOrDefaultAsync(e => e.CodigoQR == codigoQr);

            if (entrada == null || entrada.Estado != "Activa")
                return null;

            // Cambiar el estado de la entrada a "Usada"
            entrada.Estado = "Usada";
            _context.Entradas.Update(entrada);
            await _context.SaveChangesAsync();

            return entrada;
        }

        public async Task<Entrada> ComprarEntradaAsync(int userId, int eventoId, decimal monto, string metodoPago)
        {
            // Iniciar la transacción para asegurar que ambas operaciones sean atómicas
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Llamar al procedimiento almacenado para reservar la entrada
                    var parametroMonto = new SqlParameter("@Monto", monto);
                    var parametroMetodoPago = new SqlParameter("@MetodoPago", metodoPago);
                    var parametroUserId = new SqlParameter("@UsuarioId", userId);
                    var parametroEventoId = new SqlParameter("@EventoId", eventoId);

                    // Ejecutar el procedimiento almacenado para reservar la entrada
                    await _context.Database.ExecuteSqlRawAsync("EXEC sp_ReservarEntrada @UsuarioId, @EventoId, @Monto, @MetodoPago",
                        parametroUserId, parametroEventoId, parametroMonto, parametroMetodoPago);

                    // Obtener la entrada recién reservada para devolverla
                    var entrada = await _context.Entradas
                        .FirstOrDefaultAsync(e => e.UsuarioId == userId && e.EventoId == eventoId && e.Estado == "Reservada");

                    // Si no se encontró la entrada, lanzamos una excepción
                    if (entrada == null)
                    {
                        throw new Exception("No se pudo reservar la entrada.");
                    }

                    // Confirmar la transacción si todo fue exitoso
                    await transaction.CommitAsync();

                    return entrada; // Retorna la entrada reservada
                }
                catch (Exception)
                {
                    // En caso de error, hacer rollback de la transacción
                    await transaction.RollbackAsync();
                    throw; // Propagar el error
                }
            }
        }

    }



}

