using Microsoft.EntityFrameworkCore;
using JobApp.API.Entities;

namespace JobApp.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<ApplicationForm> ApplicationForms => Set<ApplicationForm>();
    public DbSet<Application> Applications => Set<Application>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<ApplicationForm>(entity =>
        {
            entity.HasIndex(f => f.Slug).IsUnique();
            entity.HasOne(f => f.User)
                .WithMany(u => u.ApplicationForms)
                .HasForeignKey(f => f.UserId);
        });

        modelBuilder.Entity<Application>(entity =>
        {
            entity.HasOne(a => a.ApplicationForm)
                .WithMany(f => f.Applications)
                .HasForeignKey(a => a.ApplicationFormId);
        });
    }
}