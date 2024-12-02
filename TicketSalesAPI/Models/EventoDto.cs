namespace TicketSalesAPI.Models
{
    public class EventoDto
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public DateTime Fecha { get; set; }
        public string Ubicacion { get; set; }
        public decimal Precio { get; set; }
        public int EntradasDisponibles { get; set; }
    }
}
