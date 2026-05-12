using System;

namespace TaskBoard.Models
{
    public class TaskItem
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
        public Guid? TeamId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Status { get; set; } = null!; // backlog, in_progress, review, done
        public string Priority { get; set; } = null!; // low, medium, high, critical
        public Guid? AssigneeId { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
