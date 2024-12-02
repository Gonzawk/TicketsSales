namespace TicketSalesAPI.Models
{
    public class PagoListDto
    {
        public int PagoId { get; set; }
        public int UsuarioId { get; set; }
        public string UsuarioNombre { get; set; } // Nueva propiedad
        public int EventoId { get; set; }
        public string EventoNombre { get; set; } // Nueva propiedad
        public int? EntradaId { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; }
        public string Estado { get; set; }
    }

}
