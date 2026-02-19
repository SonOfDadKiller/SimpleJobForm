using JobApp.API.DTOs;
using JobApp.API.Entities;

namespace JobApp.API.Interfaces;

public interface IFormService
{
    Task<FormResponseDto> CreateFormAsync(Guid userId, CreateFormDto dto);
    Task<List<FormResponseDto>> GetUserFormsAsync(Guid userId);
    Task<ApplicationForm?> GetFormBySlugAsync(string slug);
}