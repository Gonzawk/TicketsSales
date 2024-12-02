namespace TicketSalesAPI.Models
{
    public class EntradaDetailsDto
    {
        public int EntradaId { get; set; }
        public string EventoNombre { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string Estado { get; set; }
        public string CodigoQr { get; set; }  // La URL o imagen del código QR
    }

}
