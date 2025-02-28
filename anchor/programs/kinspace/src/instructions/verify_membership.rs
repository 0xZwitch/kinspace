use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

use crate::error::ErrorCode;
use crate::state::*;

#[derive(Accounts)]
pub struct VerifyMembership<'info> {
    #[account(mut)]
    pub member: Signer<'info>,
    pub space_account: Account<'info, SpaceAccount>,
    #[account(
         constraint = membership_token.owner == member.key(),
         constraint = membership_token.mint == space_account.membership_mint,
         constraint = membership_token.amount >= 1,
    )]
    pub membership_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

impl<'info> VerifyMembership<'info> {
    pub fn verify_member(&mut self) -> Result<()> {
        let membership_mint = self.space_account.membership_mint;
        let membership_token = &self.membership_token;

        if membership_token.amount < 1 {
            return Err(ErrorCode::MissingMembershipBadge.into());
        }

        if membership_token.mint != membership_mint {
            return Err(ErrorCode::InvalidMembershipMint.into());
        }
        Ok(())
    }
}
