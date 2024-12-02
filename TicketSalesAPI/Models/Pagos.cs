using System;

namespace TicketSalesAPI.Models
{
    public class Pago
    {
        public int PagoId { get; set; }
        public int UsuarioId { get; set; }
        public int EventoId { get; set; }
        public int? EntradaId { get; set; }  // Agregar el campo EntradaId
        public decimal Monto { get; set; }
        public DateTime FechaPago { get; set; }
        public string MetodoPago { get; set; }
        public string Estado { get; set; }

        // Relación con las entidades
        public User Usuario { get; set; }
        public Evento Evento { get; set; }
        public Entrada Entrada { get; set; }  // Relación con la entidad Entrada
    }
}
