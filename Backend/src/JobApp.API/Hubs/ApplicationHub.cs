using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace JobApp.API.Hubs;

[Authorize]
public class ApplicationHub : Hub
{
    // When a user opens a form's applications, they join a group
    // so they only receive updates for that form
    public async Task WatchForm(string formId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"form-{formId}");
    }

    public async Task StopWatchingForm(string formId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"form-{formId}");
    }
}