using System;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private static DateTime LastValidRequest = DateTime.Now.AddSeconds(-3);
        private static readonly object LockObject = new object();

        [HttpPost]
        public IActionResult SendEmail([FromBody] EmailModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            lock (LockObject)
            {
                var currentTime = DateTime.Now;
                if (LastValidRequest.AddSeconds(3) >= currentTime)
                {
                    return StatusCode(429, new { lastValidRequest = LastValidRequest });
                }
                else
                {
                    LastValidRequest = currentTime;
                    return Ok(new { email = model.Email, receivedAt = currentTime });
                }
            }
        }
    }
}
