using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobApp.API.DTOs;
using JobApp.API.Interfaces;
using Microsoft.JSInterop.Infrastructure;

using JobApp.API.Entities;
using JobApp.API.Interfaces;

namespace JobApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }
    
    // POST api/applications/{slug}
    [HttpPost("{slug}")]
    public async Task<ActionResult<ApplicationResponseDto>> Submit(string slug, SubmitApplicationDto dto)
    {
        try
        {
            var result = await _applicationService.SubmitApplicationAsync(slug, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Application form not found or inactive");
        }
    }
    
    // GET api/applications/form/{formId}
    // Get all applications for a specific form (requires login)
    [Authorize]
    [HttpGet("form/{formId:guid}")]
    public async Task<ActionResult<List<ApplicationResponseDto>>> GetApplications(Guid formId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var applications = await _applicationService.GetApplicationsAsync(userId, formId);
            return Ok(applications);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
    
    // PATCH api/applications/{id}/status
    // Update an application's status (requires login)
    [Authorize]
    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApplicationResponseDto>> UpdateStatus(Guid id, [FromBody] UpdateStatusDto dto)
    {
        var userId = GetCurrentUserId();

        if (!Enum.TryParse<ApplicationStatus>(dto.Status, out var status))
        {
            return BadRequest("Invalid status value");
        }

        var result = await _applicationService.UpdateStatusAsync(userId, id, status);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException();
        return Guid.Parse(claim);
    }
}