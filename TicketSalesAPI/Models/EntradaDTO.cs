namespace TicketSalesAPI.Models
{
    public class EntradaDto
    {
        public int UsuarioId { get; set; }  // ID del usuario que está comprando la entrada
        public int EventoId { get; set; }   // ID del evento al que pertenece la entrada
       
    }
}
