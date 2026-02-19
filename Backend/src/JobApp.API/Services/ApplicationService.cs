using Microsoft.EntityFrameworkCore;
using JobApp.API.DTOs;
using JobApp.API.Entities;
using JobApp.API.Interfaces;
using JobApp.API.Data;
using JobApp.API.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualBasic.CompilerServices;

namespace JobApp.API.Services;

public class ApplicationService : IApplicationService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<ApplicationHub> _hubContext;

    public ApplicationService(AppDbContext context, IHubContext<ApplicationHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task<ApplicationResponseDto> SubmitApplicationAsync(string slug, SubmitApplicationDto dto)
    {
        ApplicationForm? form = await _context.ApplicationForms.FirstOrDefaultAsync(f => f.Slug == slug && f.IsActive);

        if (form is null)
        {
            throw new KeyNotFoundException($"No active form found with slug '{slug}'");
        }

        Application application = new Application
        {
            ApplicationFormId = form.Id,
            ApplicantName = dto.ApplicantName,
            ApplicantEmail = dto.ApplicantEmail,
            CoverLetter = dto.CoverLetter
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        ApplicationResponseDto response = MapToResponse(application);

        // Notify clients that a new application has been received
        await _hubContext.Clients
            .Group($"form-{form.Id}")
            .SendAsync("NewApplication", response);

        return response;
    }

    public async Task<List<ApplicationResponseDto>> GetApplicationsAsync(Guid userId, Guid formId)
    {
        bool formExists = await _context.ApplicationForms.AnyAsync(f => f.Id == formId && f.UserId == userId);

        if (!formExists)
        {
            throw new UnauthorizedAccessException("Form not found or access denied");
        }

        return await _context.Applications
            .Where(a => a.ApplicationFormId == formId)
            .OrderByDescending(a => a.SubmittedAt)
            .Select(a => new ApplicationResponseDto(
                a.Id,
                a.ApplicantName,
                a.ApplicantEmail,
                a.CoverLetter,
                a.Status.ToString(),
                a.SubmittedAt))
            .ToListAsync();
    }

    public async Task<ApplicationResponseDto?> UpdateStatusAsync(Guid userId, Guid ApplicationId,
        ApplicationStatus newStatus)
    {
        Application? application = await _context.Applications
            .Include(a => a.ApplicationForm)
            .FirstOrDefaultAsync(a => a.Id == ApplicationId && a.ApplicationForm.UserId == userId);

        if (application is null)
        {
            return null;
        }

        application.Status = newStatus;
        await _context.SaveChangesAsync();

        return MapToResponse(application);
    }

    private static ApplicationResponseDto MapToResponse(Application app)
    {
        return new ApplicationResponseDto(
            app.Id,
            app.ApplicantName,
            app.ApplicantEmail,
            app.CoverLetter,
            app.Status.ToString(),
            app.SubmittedAt
        );
    }
}