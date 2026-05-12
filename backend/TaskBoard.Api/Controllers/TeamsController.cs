using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskBoard.Data;
using TaskBoard.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskBoard.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class TeamsController : ControllerBase
    {
        private readonly TaskBoardDbContext _context;

        public TeamsController(TaskBoardDbContext context)
        {
            _context = context;
        }

        // GET: api/teams
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeams([FromQuery] Guid? companyId)
        {
            var query = _context.Teams.AsQueryable();

            if (companyId.HasValue)
                query = query.Where(t => t.CompanyId == companyId);

            return await query.ToListAsync();
        }

        // GET: api/teams/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetTeam(Guid id)
        {
            var team = await _context.Teams.FindAsync(id);

            if (team == null)
                return NotFound();

            return team;
        }

        // POST: api/teams
        [HttpPost]
        public async Task<ActionResult<Team>> CreateTeam([FromBody] Team team)
        {
            team.Id = Guid.NewGuid();
            team.CreatedAt = DateTime.UtcNow;
            team.UpdatedAt = DateTime.UtcNow;

            _context.Teams.Add(team);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTeam), new { id = team.Id }, team);
        }

        // PUT: api/teams/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeam(Guid id, [FromBody] Team team)
        {
            var existingTeam = await _context.Teams.FindAsync(id);

            if (existingTeam == null)
                return NotFound();

            existingTeam.Name = team.Name;
            existingTeam.Description = team.Description;
            existingTeam.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/teams/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeam(Guid id)
        {
            var team = await _context.Teams.FindAsync(id);

            if (team == null)
                return NotFound();

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
