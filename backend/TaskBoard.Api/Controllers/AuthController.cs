using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TaskBoard.Data;
using TaskBoard.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace TaskBoard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly TaskBoardDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(TaskBoardDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<dynamic>> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.FullName))
                return BadRequest("Email, password, and full name are required");

            var email = request.Email.Trim().ToLowerInvariant();
            if (request.Password.Length < 6)
                return BadRequest("Password must be at least 6 characters");

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existingUser != null)
                return BadRequest("User with this email already exists");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = email,
                FullName = request.FullName.Trim(),
                PasswordHash = PasswordHasher.Hash(request.Password),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { id = user.Id, email = user.Email, fullName = user.FullName, token = GenerateJwtToken(user) });
        }

        [HttpPost("login")]
        public async Task<ActionResult<dynamic>> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("Email and password are required");

            var email = request.Email.Trim().ToLowerInvariant();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !PasswordHasher.Verify(request.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password");

            return Ok(new { id = user.Id, email = user.Email, fullName = user.FullName, token = GenerateJwtToken(user) });
        }

        [HttpGet("me/{userId}")]
        public async Task<ActionResult<dynamic>> GetCurrentUser(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

            return Ok(new { id = user.Id, email = user.Email, fullName = user.FullName, avatarUrl = user.AvatarUrl });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is not configured.");
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "TaskBoardApi";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "TaskBoardClient";

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Name, user.FullName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class RegisterRequest
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? FullName { get; set; }
    }

    public class LoginRequest
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}
