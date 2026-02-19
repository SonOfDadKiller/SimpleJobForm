namespace JobApp.API.Entities;

public class Application
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ApplicationFormId { get; set; }
    public string ApplicantName { get; set; } = string.Empty;
    public string ApplicantEmail { get; set; } = string.Empty;
    public string CoverLetter { get; set; } = string.Empty;
    public string? ResumeUrl { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.New;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    
    public ApplicationForm ApplicationForm { get; set; } = null!;
}

public enum ApplicationStatus
{
    New,
    Reviewed,
    Shortlisted,
    Rejected
}