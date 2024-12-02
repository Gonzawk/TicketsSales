using System;

namespace TicketSalesAPI.Models
{
    public class Evento
    {
        public int EventoId { get; set; }         // Llave primaria
        public string Nombre { get; set; }        // Nombre del evento
        public string Descripcion { get; set; }   // Descripción del evento
        public DateTime Fecha { get; set; }       // Fecha del evento
        public string Ubicacion { get; set; }     // Ubicación del evento
        public decimal Precio { get; set; }       // Precio de la entrada
        public int EntradasDisponibles { get; set; } // Cantidad de entradas disponibles
        public string Estado { get; set; }        // Estado del evento (activo, cancelado, etc.)

        // Relaciones
        public ICollection<Entrada> Entradas { get; set; } // Relación uno a muchos con Ticket
        public ICollection<Pago> Pagos { get; set; } // Relación uno a muchos con Pago
    }
}
