use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    #[account(
        init,
        payer = initializer,
        space = Config::INIT_SPACE, 
        seeds = [b"config", seed.to_le_bytes().as_ref()], 
        bump
    )]
    pub config : Account<'info, Config>,
    #[account(
        seeds = [b"treasury", config.key().as_ref()], 
        bump
    )]
    pub treasury: SystemAccount<'info>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info>Initialize<'info> {
    pub fn init(&mut self, bumps: InitializeBumps, seed: u64, withdraw_fee: u16, authority: Option<Pubkey>) -> Result<()> {
        self.config.set_inner(Config {
            seed,
            authority,
            withdraw_fee,
            treasury_bump: bumps.treasury,
            bump: bumps.config,
        });
        Ok(())
    }
}
