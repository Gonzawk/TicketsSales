using System;

namespace TicketSalesAPI.Models
{
    public class User
    {
        public int UsuarioId { get; set; }       // Llave primaria
        public string Nombre { get; set; }        // Nombre del usuario
        public string Correo { get; set; }        // Correo del usuario
        public string Clave { get; set; }         // Clave cifrada del usuario
        public string NroCelular { get; set; }    // Número de celular (opcional)
        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow; // Fecha de registro del usuario
        public string Estado { get; set; }        // Estado del usuario (activo, inactivo, etc.)

        public string Rol { get; set; } 

        // Relaciones
        public ICollection<Entrada> Entradas { get; set; } // Relación uno a muchos con Ticket
        public ICollection<Pago> Pagos { get; set; } // Relación uno a muchos con Pago
    }
}
