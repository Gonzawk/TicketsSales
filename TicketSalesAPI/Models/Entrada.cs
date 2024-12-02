namespace TicketSalesAPI.Models
{
    public class Entrada
    {
        public int EntradaId { get; set; }
        public int EventoId { get; set; }
        public int UsuarioId { get; set; }
        public string CodigoQR { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string Estado { get; set; }

        public Evento Evento { get; set; }
        public User Usuario { get; set; }
    }

}
