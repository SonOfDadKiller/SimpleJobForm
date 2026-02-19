namespace JobApp.API.DTOs;

public record SubmitApplicationDto(
    string ApplicantName,
    string ApplicantEmail,
    string CoverLetter
);

public record ApplicationResponseDto(
    Guid Id, 
    string ApplicantName,
    string ApplicantEmail,
    string CoverLetter,
    string Status,
    DateTime SubmittedAt
);

public record CreateFormDto(
    string Title
);

public record FormResponseDto(
    Guid Id,
    string Title,
    string Slug,
    bool IsActive,
    DateTime CreatedAt,
    int ApplicationCount
);

public record UpdateStatusDto(
    string Status
);