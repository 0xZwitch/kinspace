use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Cannot initialize space, name too long")]
    NameTooLong,
    #[msg("Cannot initialize space, description too long")]
    DescriptionTooLong,
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
}
