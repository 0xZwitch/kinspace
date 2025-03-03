use anchor_lang::prelude::*;
use anchor_spl::{
    metadata::{MasterEditionAccount, Metadata, MetadataAccount},
    token::{Mint, Token, TokenAccount},
};

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
    pub mint_account: Account<'info, Mint>,
    #[account(
        mut,
      associated_token::mint = mint_account,
      associated_token::authority = space_account,
    )]
    pub mint_ata: Account<'info, TokenAccount>,
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
    pub metadata_program: Program<'info, Metadata>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

impl<'info> MintMembership<'info> {
    pub fn mint_membership(&mut self, membership_mint: Pubkey) -> Result<()> {
        let space = &mut self.space_account;

        require_keys_eq!(space.creator, self.creator.key(), ErrorCode::Unauthorized);

        space.membership_mint = membership_mint;
        Ok(())
    }
}
