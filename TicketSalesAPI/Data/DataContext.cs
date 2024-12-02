using Microsoft.EntityFrameworkCore;
using TicketSalesAPI.Models;

namespace TicketSalesAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        // Definición de DbSets para las entidades
        public DbSet<User> Users { get; set; }
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Pago> Pagos { get; set; }
        public DbSet<Entrada> Entradas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar tablas explícitamente (opcional)
            modelBuilder.Entity<User>().ToTable("Usuarios");
            modelBuilder.Entity<Evento>().ToTable("Eventos");
            modelBuilder.Entity<Pago>().ToTable("Pagos");
            modelBuilder.Entity<Entrada>().ToTable("Entradas");

            // Configurar claves primarias
            modelBuilder.Entity<User>()
                .HasKey(u => u.UsuarioId);

            modelBuilder.Entity<Evento>()
                .HasKey(e => e.EventoId);

            modelBuilder.Entity<Pago>()
                .HasKey(p => p.PagoId);

            modelBuilder.Entity<Entrada>()
                .HasKey(e => e.EntradaId);

            // Configuración de relaciones
            // Relación Usuario - Entrada: Un usuario puede tener muchas entradas
            modelBuilder.Entity<Entrada>()
                .HasOne(e => e.Usuario) // Relación con User
                .WithMany(u => u.Entradas) // Un usuario tiene muchas entradas
                .HasForeignKey(e => e.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade); // Si se elimina un usuario, se eliminan sus entradas

            // Relación Evento - Entrada: Un evento puede tener muchas entradas
            modelBuilder.Entity<Entrada>()
                .HasOne(e => e.Evento) // Relación con Evento
                .WithMany(ev => ev.Entradas) // Un evento tiene muchas entradas
                .HasForeignKey(e => e.EventoId)
                .OnDelete(DeleteBehavior.Cascade); // Si se elimina un evento, se eliminan sus entradas

            // Relación Usuario - Pago: Un usuario puede tener muchos pagos
            modelBuilder.Entity<Pago>()
                .HasOne(p => p.Usuario) // Relación con User
                .WithMany(u => u.Pagos) // Un usuario tiene muchos pagos
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade); // Si se elimina un usuario, se eliminan sus pagos

            // Relación Evento - Pago: Un evento puede estar asociado a muchos pagos
            modelBuilder.Entity<Pago>()
                .HasOne(p => p.Evento) // Relación con Evento
                .WithMany(ev => ev.Pagos) // Un evento tiene muchos pagos
                .HasForeignKey(p => p.EventoId)
                .OnDelete(DeleteBehavior.Cascade); // Si se elimina un evento, se eliminan sus pagos

            // Relación Entrada - Pago: Un pago está asociado con una entrada
            modelBuilder.Entity<Pago>()
                .HasOne(p => p.Entrada) // Relación con Entrada
                .WithMany() // No es necesario definir una propiedad de navegación en Entrada para Pago
                .HasForeignKey(p => p.EntradaId)
                .OnDelete(DeleteBehavior.Cascade); // Si se elimina una entrada, se eliminan sus pagos

            // Configuración de restricciones únicas
            // Un usuario puede tener solo una entrada para un evento
            modelBuilder.Entity<Entrada>()
                .HasIndex(e => new { e.UsuarioId, e.EventoId })
                .IsUnique();

            // Configurar propiedades adicionales (si es necesario)
            modelBuilder.Entity<User>()
                .Property(u => u.Clave)
                .HasMaxLength(200)
                .IsRequired();
        }
    }
}
