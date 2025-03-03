use anchor_lang::prelude::*;
use anchor_spl::{
    metadata::{MasterEditionAccount, Metadata, MetadataAccount},
    token::{Mint, Token, TokenAccount},
};

use crate::error::ErrorCode;
use crate::state::*;

#[derive(Accounts)]
pub struct VerifyMembership<'info> {
    #[account(mut)]
    pub member: Signer<'info>,
    pub space_account: Account<'info, SpaceAccount>,
    pub mint_account: Account<'info, Mint>,
    #[account(
        associated_token::mint = mint_account,
        associated_token::authority = member,
         constraint = membership_token_ata.owner == member.key(),
         constraint = membership_token_ata.mint == space_account.membership_mint,
         constraint = membership_token_ata.amount >= 1,
    )]
    pub membership_token_ata: Account<'info, TokenAccount>,
    #[account(
      seeds = [
        b"metadata",
        metadata_program.key().as_ref(),
        mint_account.key().as_ref(),
      ],
      seeds::program = metadata_program.key(),
      bump
    )]
    pub metadata: Account<'info, MetadataAccount>,
    #[account(
      seeds = [
        b"metadata",
        metadata_program.key().as_ref(),
        mint_account.key().as_ref(),
        b"edition",
      ],
      seeds::program = metadata_program.key(),
      bump
    )]
    pub master_edition: Account<'info, MasterEditionAccount>,
    pub token_program: Program<'info, Token>,
    pub metadata_program: Program<'info, Metadata>,
}

impl<'info> VerifyMembership<'info> {
    pub fn verify_member(&mut self) -> Result<()> {
        let membership_mint = self.space_account.membership_mint;
        let membership_token = &self.membership_token_ata;

        if membership_token.amount < 1 {
            return Err(ErrorCode::MissingMembershipBadge.into());
        }

        if membership_token.mint != membership_mint {
            return Err(ErrorCode::InvalidMembershipMint.into());
        }
        Ok(())
    }
}
