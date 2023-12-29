namespace Paidit.Dtos
{
    public class AccountDto
    {
        public List<AccountInputsDto>? Inputs { get; set; }
        public string? ColourHex { get; set; } = "#000000";
    }
}
