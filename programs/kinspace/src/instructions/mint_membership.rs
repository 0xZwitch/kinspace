use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::state::*;

#[derive(Accounts)]
pub struct MintMembership<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
      mut,
        seeds = [b"space", creator.key().as_ref(), space_account.name.as_bytes()],
        bump = space_account.bump,
    )]
    pub space_account: Account<'info, SpaceAccount>,
    pub system_program: Program<'info, System>,
}

impl<'info> MintMembership<'info> {
    pub fn mint_membership(&mut self, membership_mint: Pubkey) -> Result<()> {
        let space = &mut self.space_account;

        require_keys_eq!(space.creator, self.creator.key(), ErrorCode::Unauthorized);

        space.membership_mint = membership_mint;
        Ok(())
    }
}
