using System.ComponentModel.DataAnnotations;

namespace server
{
   
public class EmailModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
}
}
