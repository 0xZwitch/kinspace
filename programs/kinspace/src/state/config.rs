use anchor_lang::prelude::*;

#[account]
pub struct Config {
    pub seed: u64,
    pub authority: Option<Pubkey>,
    pub withdraw_fee: u16, // in basis point
    pub treasury_bump: u8,
    pub bump: u8,
}

impl Space for Config {
    const INIT_SPACE: usize = 8 + 8 + (1 + 32) + 2 + 1 + 1;
}
