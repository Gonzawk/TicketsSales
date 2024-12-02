using Microsoft.EntityFrameworkCore; // Para usar EF Core
using TicketSalesAPI.Data;
using TicketSalesAPI.Services.Implementations;
using TicketSalesAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configuración para el servicio de usuarios
builder.Services.AddScoped<IUserService, UserService>();

// Configuración para el servicio de eventos
builder.Services.AddScoped<IEventoService, EventoService>();

// Configuración para el servicio de tickets
builder.Services.AddScoped<ITicketService, TicketService>();

// Configuración para el servicio de autenticación (JWT)
builder.Services.AddScoped<IAuthService, AuthService>();



// Configuración del DataContext para conectar con la base de datos
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Configuración para la autenticación JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
        };
    });

// Configuración para habilitar CORS (Cross-Origin Resource Sharing)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost", "http://localhost:3000", "http://192.168.0.155:3000")  // Aquí agregas la IP de tu celular
              .AllowAnyHeader()  // Permitir cualquier cabecera
              .AllowAnyMethod()  // Permitir cualquier método (GET, POST, PUT, DELETE)
              .AllowCredentials();  // Permitir credenciales (como cookies, autenticación)
    });
});

// Agregar controladores de API y configuración de JSON para evitar ciclos de referencia
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });


// Habilitar Swagger para documentación de API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración del pipeline de solicitudes HTTP
var app = builder.Build();

// Configuración del pipeline de solicitudes HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // Asegura que las solicitudes se redirijan a HTTPS

// Habilitar CORS
app.UseCors("AllowSpecificOrigins"); // Usamos la política de CORS definida

// Habilitar autenticación y autorización
app.UseAuthentication(); // Esta línea debe ir antes de UseAuthorization
app.UseAuthorization();  // Habilitar la autorización

// Mapea las rutas de los controladores
app.MapControllers();

// Inicia la aplicación
app.Run();
