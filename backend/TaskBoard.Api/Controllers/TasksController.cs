using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskBoard.Api.Helpers;
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
    public class TasksController : ControllerBase
    {
        private readonly TaskBoardDbContext _context;

        public TasksController(TaskBoardDbContext context)
        {
            _context = context;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks(
            [FromQuery] Guid? companyId,
            [FromQuery] Guid? teamId,
            [FromQuery] Guid? assigneeId)
        {
            var query = _context.Tasks.AsQueryable();

            if (companyId.HasValue)
                query = query.Where(t => t.CompanyId == companyId);

            if (teamId.HasValue)
                query = query.Where(t => t.TeamId == teamId);

            if (assigneeId.HasValue)
                query = query.Where(t => t.AssigneeId == assigneeId);

            return await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
        }

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(Guid id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return NotFound();

            return task;
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask([FromBody] TaskItem task)
        {
            task.Id = Guid.NewGuid();
            task.CreatedAt = DateTime.UtcNow;
            task.UpdatedAt = DateTime.UtcNow;
            task.Status = "backlog";
            task.Priority = "medium";
            task.DueDate = DateTimeHelper.ToUtcForPostgreSql(task.DueDate);

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(Guid id, [FromBody] TaskItem task)
        {
            var existingTask = await _context.Tasks.FindAsync(id);

            if (existingTask == null)
                return NotFound();

            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.Status = task.Status;
            existingTask.Priority = task.Priority;
            existingTask.AssigneeId = task.AssigneeId;
            existingTask.DueDate = DateTimeHelper.ToUtcForPostgreSql(task.DueDate);
            existingTask.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
