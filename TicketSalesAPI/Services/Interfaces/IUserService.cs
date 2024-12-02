using TicketSalesAPI.Models;

namespace TicketSalesAPI.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> GetByIdAsync(int userId);  // Obtener un usuario por su ID
        Task<User> GetByEmailAsync(string email);  // Obtener un usuario por su email
        Task<User> RegisterAsync(UserDto userDto);  // Registrar un nuevo usuario
        Task UpdateAsync(User user);  // Actualizar un usuario
        Task<List<User>> GetAllUsersAsync();  // Obtener todos los usuarios
        Task<User> LoginAsync(LoginDto loginDto);  // Iniciar sesión
    }
}



