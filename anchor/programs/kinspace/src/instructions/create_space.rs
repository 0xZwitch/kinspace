use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::state::*;

#[derive(Accounts)]
#[instruction(name: String, description: String)]
pub struct CreateSpace<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        init,
        payer = creator,
        space = 8 + SpaceAccount::INIT_SPACE,
        seeds = [b"space", creator.key().as_ref(), name.as_bytes()],
        bump,
    )]
    pub space_account: Account<'info, SpaceAccount>,
    #[account(
        seeds = [b"treasury", space_account.key().as_ref(), name.as_bytes()],
        bump,
    )]
    pub space_treasury: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateSpace<'info> {
    pub fn init_space(
        &mut self,
        name: String,
        description: String,
        bumps: CreateSpaceBumps,
    ) -> Result<()> {
        require!(name.as_bytes().len() <= NAME_LENGTH, ErrorCode::NameTooLong);

        require!(
            description.as_bytes().len() <= DESCRIPTION_LENGTH,
            ErrorCode::DescriptionTooLong
        );

        self.space_account.set_inner(SpaceAccount {
            creator: self.creator.key(),
            name,
            description,
            membership_mint: Pubkey::default(),
            treasury_bump: bumps.space_treasury,
            bump: bumps.space_account,
        });
        Ok(())
    }
}
