namespace TicketSalesAPI.Models
{
    public class EntradaUserDto
    {
        public int EntradaId { get; set; }
        public string EventoNombre { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string Estado { get; set; }

        public string CodigoQR { get; set; }

    }
}
