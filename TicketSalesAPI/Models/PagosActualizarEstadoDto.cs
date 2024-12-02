namespace TicketSalesAPI.Models
{
    public class ActualizarEstadoPagoDto
    {
        public int PagoId { get; set; }
        public string NuevoEstado { get; set; } // "Completado" o "Cancelado"
    }

}
