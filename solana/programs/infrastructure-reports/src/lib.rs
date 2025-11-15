// lib.rs
use anchor_lang::prelude::*;

// ⚠️ IMPORTANT: Replace with your program ID after first `anchor deploy`
declare_id!("11111111111111111111111111111111");

#[program]
pub mod infrastructure_reports {
    use super::*;

    /// Creates a new infrastructure report PDA.
    // Uklonjeni description i photo_url argumenti
    pub fn create_report(
        ctx: Context<CreateReport>,
        report_seed: String, // report_seed je sada drugi argument
    ) -> Result<()> {
        let report_account = &mut ctx.accounts.report_account;

        // Uklonjene provere dužine (DescriptionTooLong i UrlTooLong)

        // Initialize
        report_account.creator = ctx.accounts.user.key();
        report_account.upvotes = 0;
        report_account.downvotes = 0;
        // Uklonjene linije za description i photo_url
        report_account.bump = ctx.bumps.report_account;

        msg!("Report created by: {}", report_account.creator);

        Ok(())
    }

    /// Allows a user to upvote or downvote a report.
    pub fn vote(ctx: Context<Vote>, vote_type: u8) -> Result<()> {
        let report_account = &mut ctx.accounts.report_account;
        let vote_record = &mut ctx.accounts.vote_record;

        // Only 1 or 2 allowed
        require!(
            vote_type == 1 || vote_type == 2,
            ReportError::InvalidVoteType
        );

        // Handle previous vote
        match vote_record.vote_type {
            0 => { /* first vote */ }
            1 => {
                if vote_type == 2 {
                    report_account.upvotes = report_account.upvotes.saturating_sub(1);
                } else {
                    msg!("Already upvoted, no change.");
                    return Ok(());
                }
            }
            2 => {
                if vote_type == 1 {
                    report_account.downvotes = report_account.downvotes.saturating_sub(1);
                } else {
                    msg!("Already downvoted, no change.");
                    return Ok(());
                }
            }
            _ => return err!(ReportError::InvalidVoteRecordState),
        }

        // Apply new vote
        if vote_type == 1 {
            report_account.upvotes = report_account.upvotes.checked_add(1).unwrap();
        } else {
            report_account.downvotes = report_account.downvotes.checked_add(1).unwrap();
        }

        // Update vote record
        vote_record.voter = ctx.accounts.user.key();
        vote_record.report = report_account.key();
        vote_record.vote_type = vote_type;
        vote_record.bump = ctx.bumps.vote_record;

        Ok(())
    }
}

// ----------------------------------------------------------------------
// --- Contexts for Instructions ---
// ----------------------------------------------------------------------

#[derive(Accounts)]
#[instruction(report_seed: String)]
pub struct CreateReport<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Report::INIT_SPACE,
        seeds = [b"report", report_seed.as_bytes()],
        bump
    )]
    pub report_account: Account<'info, Report>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,

    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub report_account: Account<'info, Report>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + VoteRecord::INIT_SPACE,
        seeds = [b"vote", user.key().as_ref(), report_account.key().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,

    pub rent: Sysvar<'info, Rent>,
}

// ----------------------------------------------------------------------
// --- Account Structures ---
// ----------------------------------------------------------------------

#[account]
#[derive(Default)]
pub struct Report {
    pub creator: Pubkey,
    pub upvotes: u64,
    pub downvotes: u64,
    // Uklonjena polja description i photo_url
    pub bump: u8,
}

impl Report {
    // Uklonjene MAX_LENGTH konstante
    pub const INIT_SPACE: usize =
        32 + // creator
        8 + // upvotes
        8 + // downvotes
        // Uklonjen prostor za description i photo_url
        1; // bump
}

#[account]
#[derive(Default)]
pub struct VoteRecord {
    pub voter: Pubkey,
    pub report: Pubkey,
    pub vote_type: u8, // 1 = upvote, 2 = downvote, 0 = none
    pub bump: u8,
}

impl VoteRecord {
    pub const INIT_SPACE: usize =
        32 + // voter
        32 + // report
        1 + // vote_type
        1; // bump
}

// ----------------------------------------------------------------------
// --- Errors ---
// ----------------------------------------------------------------------

#[error_code]
pub enum ReportError {
    // Uklonjeni DescriptionTooLong i UrlTooLong
    #[msg("Invalid vote type. Use 1 (upvote) or 2 (downvote).")]
    InvalidVoteType,
    #[msg("Vote record is in an invalid state.")]
    InvalidVoteRecordState,
}
