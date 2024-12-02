using TicketSalesAPI.Data;
using TicketSalesAPI.Models;
using TicketSalesAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace TicketSalesAPI.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly DataContext _context;

        public UserService(DataContext context)
        {
            _context = context;
        }

        // Método para obtener un usuario por correo electrónico
        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Correo == email);
        }

        // Método para obtener un usuario por su ID
        public async Task<User> GetByIdAsync(int userId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.UsuarioId == userId);
        }

        // Método para registrar un nuevo usuario
        public async Task<User> RegisterAsync(UserDto userDto)
        {
            var existingUser = await GetByEmailAsync(userDto.Correo);
            if (existingUser != null)
            {
                return null; // El usuario ya existe
            }

            // Hashear la contraseña antes de guardarla
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Clave);

            var user = new User
            {
                Nombre = userDto.Nombre,
                Correo = userDto.Correo,
                Clave = hashedPassword,  // Guardar la contraseña hasheada
                NroCelular = userDto.NroCelular,
                FechaRegistro = DateTime.UtcNow,  // Asignar la fecha de registro
                Estado = "Activo",  // Estado inicial
                Rol = userDto.Rol ?? "User"  // Asignar rol (si no se proporciona, asignar "User")
            };

            // Guardar el usuario en la base de datos
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user; // Retornar el usuario creado
        }

        // Método para iniciar sesión
        public async Task<User> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Correo == loginDto.EmailOrPhone || u.NroCelular == loginDto.EmailOrPhone);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Clave, user.Clave))
                return null;

            return user;
        }

        // Método para obtener todos los usuarios
        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();  // Obtener todos los usuarios
        }

        // Método para actualizar los datos del usuario
        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
