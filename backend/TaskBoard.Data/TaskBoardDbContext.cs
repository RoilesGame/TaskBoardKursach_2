using Microsoft.EntityFrameworkCore;
using TaskBoard.Models;

namespace TaskBoard.Data
{
    public class TaskBoardDbContext : DbContext
    {
        public TaskBoardDbContext(DbContextOptions<TaskBoardDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Company> Companies { get; set; } = null!;
        public DbSet<Team> Teams { get; set; } = null!;
        public DbSet<TaskItem> Tasks { get; set; } = null!;
        public DbSet<TaskComment> TaskComments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Users
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.AvatarUrl).HasMaxLength(500);
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Companies
            modelBuilder.Entity<Company>(entity =>
            {
                entity.ToTable("companies");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.Property(e => e.LogoUrl).HasMaxLength(500);
                entity.HasIndex(e => e.OwnerId);
            });

            // Teams
            modelBuilder.Entity<Team>(entity =>
            {
                entity.ToTable("teams");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => e.CompanyId);
            });

            // Tasks
            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.ToTable("tasks");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Priority).IsRequired().HasMaxLength(20);
                entity.HasIndex(e => e.CompanyId);
                entity.HasIndex(e => e.TeamId);
                entity.HasIndex(e => e.AssigneeId);
                entity.HasIndex(e => e.CreatedBy);
                entity.HasIndex(e => e.Status);
            });

            // TaskComments
            modelBuilder.Entity<TaskComment>(entity =>
            {
                entity.ToTable("task_comments");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Content).IsRequired();
                entity.HasIndex(e => e.TaskId);
                entity.HasIndex(e => e.AuthorId);
            });
        }
    }
}
