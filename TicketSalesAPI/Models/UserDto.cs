namespace TicketSalesAPI.Models
{
    public class UserDto
    {
        public string Nombre { get; set; }
        public string Correo { get; set; }
        public string Clave { get; set; }
        public string NroCelular { get; set; }

        public string Rol { get; set; }  // Nueva propiedad Rol
    }
}
