using Microsoft.AspNetCore.Mvc;
using TicketSalesAPI.Models;
using TicketSalesAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Security.Claims;

namespace TicketSalesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IEventoService _eventService;
        private readonly ITicketService _ticketService;
        private readonly IAuthService _authService;

        public UserController(IUserService userService, IEventoService eventService, ITicketService ticketService, IAuthService authService)
        {
            _userService = userService;
            _eventService = eventService;
            _ticketService = ticketService;
            _authService = authService;
        }

        // Ruta pública de registro (sin autenticación, rol por defecto: User)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto userDto)
        {
            var existingUser = await _userService.GetByEmailAsync(userDto.Correo);
            if (existingUser != null)
                return BadRequest("El usuario ya existe.");

            // Asignar el rol 'User' por defecto
            userDto.Rol = "User";

            // Usar el método RegisterAsync
            var user = await _userService.RegisterAsync(userDto);
            if (user == null)
                return BadRequest("Hubo un error al registrar al usuario.");

            return Ok(userDto); // Retornar el usuario registrado (con rol User)
        }

        // Ruta para el registro de usuarios solo para Admins (Admin puede asignar roles)
        [Authorize(Roles = "Admin")]
        [HttpPost("register/admin")]
        public async Task<IActionResult> RegisterByAdmin([FromBody] UserDto userDto)
        {
            var existingUser = await _userService.GetByEmailAsync(userDto.Correo);
            if (existingUser != null)
                return BadRequest("El usuario ya existe.");

            // El Admin puede asignar el rol aquí, no se asigna automáticamente
            var user = await _userService.RegisterAsync(userDto);
            if (user == null)
                return BadRequest("Hubo un error al registrar al usuario.");

            return Ok(userDto); // Retornar el usuario registrado (con el rol asignado por el Admin)
        }

        // Login del usuario
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userService.LoginAsync(loginDto);
            if (user == null)
                return Unauthorized("Credenciales incorrectas.");

            var token = _authService.GenerateJwtToken(user);
            return Ok(new { token });
        }

        // Obtener todos los usuarios (Solo Admin puede ver todos los usuarios)
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();

            // Si no se encuentran usuarios, se devuelve un error
            if (users == null || !users.Any())
                return NotFound("No se encontraron usuarios.");

            // Mapeamos los usuarios a AdminUserDto (para eliminar la clave)
            var usersToReturn = users.Select(user => new AdminUserDto
            {
                UsuarioId = user.UsuarioId,
                Nombre = user.Nombre,
                Correo = user.Correo,
                NroCelular = user.NroCelular,
                FechaRegistro = user.FechaRegistro,
                Estado = user.Estado,
                Rol = user.Rol
            }).ToList();

            return Ok(usersToReturn);
        }

        // Obtener los datos del usuario logueado
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyData()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized("No se pudo obtener el ID de usuario.");

            var user = await _userService.GetByIdAsync(userId.Value);
            if (user == null)
                return NotFound("Usuario no encontrado.");

            var userDto = new UserGetPutDto
            {
                Nombre = user.Nombre,
                Correo = user.Correo,
                NroCelular = user.NroCelular
            };

            return Ok(userDto);
        }

        // Actualizar los datos del usuario logueado
        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyData([FromBody] UserGetPutDto userDto)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized("No se pudo obtener el ID de usuario.");

            var user = await _userService.GetByIdAsync(userId.Value);
            if (user == null)
                return NotFound("Usuario no encontrado.");

            user.Nombre = userDto.Nombre;
            user.NroCelular = userDto.NroCelular;

            await _userService.UpdateAsync(user);
            return Ok(user); // O devolver el DTO con la respuesta si prefieres
        }

        private int? GetUserIdFromToken()
        {
            var userIdClaim = User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim != null && int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            return null; // Si no se puede obtener el userId o es inválido
        }

    }
}


