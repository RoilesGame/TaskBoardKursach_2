using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskBoard.Data;
using TaskBoard.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TaskBoard.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly TaskBoardDbContext _context;

        public CompaniesController(TaskBoardDbContext context)
        {
            _context = context;
        }

        // GET: api/companies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompanies()
        {
            return await _context.Companies.ToListAsync();
        }

        // GET: api/companies/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Company>> GetCompany(Guid id)
        {
            var company = await _context.Companies.FindAsync(id);

            if (company == null)
                return NotFound();

            return company;
        }

        // POST: api/companies
        [HttpPost]
        public async Task<ActionResult<Company>> CreateCompany([FromBody] Company company)
        {
            company.Id = Guid.NewGuid();
            company.CreatedAt = DateTime.UtcNow;
            company.UpdatedAt = DateTime.UtcNow;

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCompany), new { id = company.Id }, company);
        }

        // PUT: api/companies/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompany(Guid id, [FromBody] Company company)
        {
            var existingCompany = await _context.Companies.FindAsync(id);

            if (existingCompany == null)
                return NotFound();

            existingCompany.Name = company.Name;
            existingCompany.Description = company.Description;
            existingCompany.LogoUrl = company.LogoUrl;
            existingCompany.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/companies/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(Guid id)
        {
            var company = await _context.Companies.FindAsync(id);

            if (company == null)
                return NotFound();

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
