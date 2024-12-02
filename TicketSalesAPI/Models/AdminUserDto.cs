namespace TicketSalesAPI.Models
{
    public class AdminUserDto
    {
        public int UsuarioId { get; set; } // ID del usuario
        public string Nombre { get; set; } // Nombre del usuario
        public string Correo { get; set; } // Correo del usuario
        public string NroCelular { get; set; } // Número de celular del usuario
        public DateTime FechaRegistro { get; set; } // Fecha de registro
        public string Estado { get; set; } // Estado (activo/inactivo)
        public string Rol { get; set; } // Rol (Admin/User)
    }
}
