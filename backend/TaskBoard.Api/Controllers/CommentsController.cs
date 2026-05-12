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
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly TaskBoardDbContext _context;

        public CommentsController(TaskBoardDbContext context)
        {
            _context = context;
        }

        // GET: api/comments?taskId={taskId}
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskComment>>> GetComments([FromQuery] Guid taskId)
        {
            return await _context.TaskComments
                .Where(c => c.TaskId == taskId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        // POST: api/comments
        [HttpPost]
        public async Task<ActionResult<TaskComment>> CreateComment([FromBody] TaskComment comment)
        {
            comment.Id = Guid.NewGuid();
            comment.CreatedAt = DateTime.UtcNow;

            _context.TaskComments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComments), new { taskId = comment.TaskId }, comment);
        }

        // DELETE: api/comments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(Guid id)
        {
            var comment = await _context.TaskComments.FindAsync(id);

            if (comment == null)
                return NotFound();

            _context.TaskComments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
