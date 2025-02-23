pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("5F771jf2aRUjedimPbXZEVXTTRfXv4yh5gEdbvqTgG7A");

#[program]
pub mod kinspace {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        seed: u64,
        withdraw_fee: u16,
        authority: Option<Pubkey>,
    ) -> Result<()> {
        ctx.accounts.init(ctx.bumps, seed, withdraw_fee, authority)
    }

    pub fn create_space(
        ctx: Context<CreateSpace>,
        name: String,
        description: String,
    ) -> Result<()> {
        ctx.accounts.init_space(name, description, ctx.bumps)
    }

    pub fn mint_membership(ctx: Context<MintMembership>, membership_mint: Pubkey) -> Result<()> {
        ctx.accounts.mint_membership(membership_mint)
    }
}
