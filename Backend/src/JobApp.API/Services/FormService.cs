using Microsoft.EntityFrameworkCore;
using JobApp.API.DTOs;
using JobApp.API.Entities;
using JobApp.API.Interfaces;
using JobApp.API.Data;

namespace JobApp.API.Services;

public class FormService : IFormService
{
    private readonly AppDbContext _context;

    public FormService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<FormResponseDto> CreateFormAsync(Guid userId, CreateFormDto dto)
    {
        // Generate URL friendly slug from title
        // "Senior Developer" -> "senior-developer"
        string baseSlug = dto.Title.ToLower().Replace(" ", "-").Replace("--", "-").Trim("-").ToString();
        
        // Append random chars to ensure uniqueness
        var slug = baseSlug;
        while (await _context.ApplicationForms.AnyAsync(f => f.Slug == slug))
        {
            slug = $"{ baseSlug }-{ Guid.NewGuid().ToString()[..6] }";
        }

        var form = new ApplicationForm
        {
            UserId = userId,
            Title = dto.Title,
            Slug = slug
        };

        _context.ApplicationForms.Add(form);
        await _context.SaveChangesAsync();

        return MapToResponse(form);
    }

    public async Task<List<FormResponseDto>> GetUserFormsAsync(Guid userId)
    {
        return await _context.ApplicationForms
            .Where(f => f.UserId == userId)
            .Select(f => new FormResponseDto(
                f.Id,
                f.Title,
                f.Slug,
                f.IsActive,
                f.CreatedAt,
                f.Applications.Count
            ))
            .ToListAsync<FormResponseDto>();
    }

    public async Task<ApplicationForm?> GetFormBySlugAsync(string slug)
    {
        return await _context.ApplicationForms
            .Include(f => f.User)
            .FirstOrDefaultAsync(f => f.Slug == slug && f.IsActive);
    }

    private static FormResponseDto MapToResponse(ApplicationForm form)
    {
        return new FormResponseDto(
            form.Id,
            form.Title,
            form.Slug,
            form.IsActive,
            form.CreatedAt,
            form.Applications?.Count ?? 0
        );
    }
}