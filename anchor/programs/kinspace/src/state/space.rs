use anchor_lang::prelude::*;

pub const NAME_LENGTH: usize = 32;
pub const DESCRIPTION_LENGTH: usize = 256;

#[account]
pub struct SpaceAccount {
    pub creator: Pubkey,
    pub name: String,        // max 32 bytes
    pub description: String, // max 256 bytes
    pub membership_mint: Pubkey,
    pub treasury_bump: u8,
    pub bump: u8,
}

impl Space for SpaceAccount {
    const INIT_SPACE: usize = 32 + (4 + 32) + (4 + 256) + 32 + 1 + 1;
}
