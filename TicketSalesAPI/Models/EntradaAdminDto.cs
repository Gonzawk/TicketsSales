namespace TicketSalesAPI.Models
{
    public class EntradaAdminDto
    {
        public int EntradaId { get; set; }
        public int EventoId { get; set; }
        public string EventoNombre { get; set; }
        public int UsuarioId { get; set; }
        public string UsuarioNombre { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string Estado { get; set; }
    }
}
