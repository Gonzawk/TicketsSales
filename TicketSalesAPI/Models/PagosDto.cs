using System;

namespace TicketSalesAPI.Models
{
    public class PagoDto
    {
        public int PagoId { get; set; }
        public int UsuarioId { get; set; }
        public int EventoId { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; }
        public string Estado { get; set; }
        public int? EntradaId { get; set; }
        public string EventoNombre { get; set; } 
        public string UsuarioNombre { get; set; }
    }
}