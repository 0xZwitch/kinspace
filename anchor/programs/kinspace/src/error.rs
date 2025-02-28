use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Cannot initialize space, name too long")]
    NameTooLong,
    #[msg("Cannot initialize space, description too long")]
    DescriptionTooLong,
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("User does not own the required membership badge.")]
    MissingMembershipBadge,
    #[msg("The membership NFT mint does not match the expected membership mint.")]
    InvalidMembershipMint,
}
