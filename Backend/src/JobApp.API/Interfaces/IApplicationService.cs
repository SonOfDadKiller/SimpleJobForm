using JobApp.API.DTOs;
using JobApp.API.Entities;

namespace JobApp.API.Interfaces;

public interface IApplicationService
{
    Task<ApplicationResponseDto> SubmitApplicationAsync(string slug, SubmitApplicationDto dto);
    Task<List<ApplicationResponseDto>> GetApplicationsAsync(Guid userId, Guid formId);
    Task<ApplicationResponseDto?> UpdateStatusAsync(Guid userId, Guid applicationId, ApplicationStatus status);
}