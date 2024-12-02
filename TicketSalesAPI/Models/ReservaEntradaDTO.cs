namespace TicketSalesAPI.Models
{
    public class ReservaEntradaDTO
    {
        public int UsuarioId { get; set; }
        public int EventoId { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; }
    }

}
