using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobApp.API.DTOs;
using JobApp.API.Interfaces;

namespace JobApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FormsController : ControllerBase
{
    private readonly IFormService _formService;

    public FormsController(IFormService formService)
    {
        _formService = formService;
    }
    
    // POST api/forms
    // Creates a new application form (requires login)
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<FormResponseDto>> CreateForm(CreateFormDto dto)
    {
        var userId = GetCurrentUserId();
        var form = await _formService.CreateFormAsync(userId, dto);
        return CreatedAtAction(nameof(GetFormBySlug), new { slug = form.Slug }, form);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<FormResponseDto>>> GetMyForms()
    {
        var userId = GetCurrentUserId();
        var forms = await _formService.GetUserFormsAsync(userId);
        return Ok(forms);
    }
    
    // Get api/forms/{slug}
    // Gets a form by its public slug (no login required - applicants use this)
    [HttpGet("{slug}")]
    public async Task<ActionResult> GetFormBySlug(string slug)
    {
        var form = await _formService.GetFormBySlugAsync(slug);
        if (form is null)
        {
            return NotFound();
        }

        return Ok(new { form.Title, form.Slug });
    }

    private Guid GetCurrentUserId()
    {
        // Reads the user ID from the JWT token claims
        // We'll implement this properly when we add authentication
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException();
        return Guid.Parse(claim);
    }
}