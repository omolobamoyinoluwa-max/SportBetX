//! # SportBetX Shared Library
//! 
//! This library provides shared types, errors, events, and utilities
//! used across all SportBetX smart contracts.

pub mod types;
pub mod errors;
pub mod events;
pub mod utils;
pub mod constants;

// Re-export commonly used items
pub use types::*;
pub use errors::*;
pub use events::*;
pub use constants::*;

use soroban_sdk::{contracttype, Address, Bytes, Env, Symbol};

/// Contract state structure for shared functionality
#[contracttype]
pub struct ContractState {
    /// Contract administrator
    pub admin: Address,
    /// Contract paused status
    pub paused: bool,
    /// Configuration settings
    pub config: PlatformConfig,
}

/// Platform configuration structure
#[contracttype]
pub struct PlatformConfig {
    /// Platform fee percentage (basis points)
    pub platform_fee_percentage: u32,
    /// Minimum bet amount (in stroops)
    pub min_bet_amount: u64,
    /// Maximum bet amount (in stroops)
    pub max_bet_amount: u64,
    /// Platform fee collector
    pub fee_collector: Address,
    /// Emergency pause status
    pub emergency_pause: bool,
    /// Oracle provider address
    pub oracle_provider: Address,
}

impl ContractState {
    /// Create new contract state
    pub fn new(admin: Address) -> Self {
        Self {
            admin,
            paused: false,
            config: PlatformConfig {
                platform_fee_percentage: 200, // 2%
                min_bet_amount: 1000000, // 0.1 XLM
                max_bet_amount: 1000000000, // 100 XLM
                fee_collector: admin.clone(),
                emergency_pause: false,
                oracle_provider: admin.clone(),
            },
        }
    }
}

impl PlatformConfig {
    /// Validate configuration values
    pub fn validate(&self) -> Result<(), ContractError> {
        if self.platform_fee_percentage > 1000 { // 10%
            return Err(ContractError::InvalidConfiguration);
        }
        if self.min_bet_amount == 0 || self.max_bet_amount == 0 {
            return Err(ContractError::InvalidConfiguration);
        }
        if self.min_bet_amount >= self.max_bet_amount {
            return Err(ContractError::InvalidConfiguration);
        }
        Ok(())
    }
}

/// Utility functions for contract operations
pub mod utils {
    use super::*;
    use soroban_sdk::{Env, Address, Bytes};

    /// Calculate betting odds
    pub fn calculate_odds(
        total_amount_for: u64,
        total_amount_against: u64,
    ) -> (u64, u64) {
        if total_amount_for == 0 && total_amount_against == 0 {
            return (10000, 10000); // 1:1 odds
        }
        
        let total_amount = total_amount_for + total_amount_against;
        
        let odds_for = if total_amount_for == 0 {
            100000 // 10:1 against
        } else {
            (total_amount * 10000) / total_amount_for
        };
        
        let odds_against = if total_amount_against == 0 {
            100000 // 10:1 for
        } else {
            (total_amount * 10000) / total_amount_against
        };
        
        (odds_for, odds_against)
    }

    /// Calculate potential payout
    pub fn calculate_payout(
        bet_amount: u64,
        odds: u64,
        platform_fee: u32,
    ) -> u64 {
        let gross_payout = (bet_amount * odds) / 10000;
        let platform_cut = (gross_payout * u64::from(platform_fee)) / 10000;
        gross_payout - platform_cut
    }

    /// Calculate liquidity rewards
    pub fn calculate_liquidity_rewards(
        liquidity_provided: u64,
        total_liquidity: u64,
        platform_fees_collected: u64,
        liquidity_provider_share: u32,
    ) -> u64 {
        if total_liquidity == 0 {
            return 0;
        }
        
        let provider_share = (liquidity_provided * 10000) / total_liquidity;
        let rewards = (platform_fees_collected * u64::from(liquidity_provider_share)) / 10000;
        (rewards * provider_share) / 10000
    }

    /// Validate address format
    pub fn validate_address(address: &Address) -> bool {
        !address.is_zero()
    }

    /// Generate unique bet ID
    pub fn generate_bet_id(env: &Env, bettor: &Address, event_id: &Bytes) -> Bytes {
        let timestamp = env.ledger().timestamp();
        let random_bytes = env.prng().gen::<[u8; 16]>();
        let mut id_bytes = bettor.to_bytes();
        id_bytes.extend_from_slice(&event_id);
        id_bytes.extend_from_slice(&timestamp.to_be_bytes());
        id_bytes.extend_from_slice(&random_bytes);
        Bytes::from_slice(&id_bytes)
    }

    /// Calculate parlay odds
    pub fn calculate_parlay_odds(individual_odds: &[u64]) -> u64 {
        individual_odds.iter().fold(10000, |acc, &odds| {
            (acc * odds) / 10000
        })
    }

    /// Validate parlay bet
    pub fn validate_parlay_bet(
        selections: &[BetSelection],
        max_parlay_size: u32,
    ) -> bool {
        if selections.is_empty() || selections.len() > max_parlay_size as usize {
            return false;
        }
        
        // Check for duplicate events in parlay
        let mut event_ids = std::collections::HashSet::new();
        for selection in selections {
            if !event_ids.insert(&selection.event_id) {
                return false; // Duplicate event found
            }
        }
        
        true
    }

    /// Calculate house edge
    pub fn calculate_house_edge(
        true_odds: u64,
        offered_odds: u64,
    ) -> u32 {
        if true_odds == 0 {
            return 0;
        }
        
        let house_edge = ((true_odds - offered_odds) * 10000) / true_odds;
        house_edge as u32
    }

    /// Validate bet amount
    pub fn validate_bet_amount(
        amount: u64,
        min_amount: u64,
        max_amount: u64,
    ) -> bool {
        amount >= min_amount && amount <= max_amount
    }

    /// Calculate time-based odds adjustment
    pub fn calculate_time_adjustment(
        base_odds: u64,
        time_until_event: u64,
        max_adjustment: u32,
    ) -> u64 {
        if time_until_event == 0 {
            return base_odds;
        }
        
        // Adjust odds based on time until event (closer = more adjustment)
        let adjustment_factor = std::cmp::min(
            (3600 - time_until_event) * 100 / 3600, // Convert to percentage
            max_adjustment as u64,
        );
        
        base_odds + (base_odds * adjustment_factor) / 10000
    }

    /// Check if contract is paused
    pub fn is_paused(env: &Env) -> bool {
        let state: ContractState = env.storage().instance().get(&Symbol::new(&env, "STATE")).unwrap();
        state.paused
    }

    /// Calculate oracle confidence score
    pub fn calculate_oracle_confidence(
        oracle_votes: &[(Address, bool)],
        threshold: u32,
    ) -> u32 {
        if oracle_votes.is_empty() {
            return 0;
        }
        
        let true_votes = oracle_votes.iter().filter(|(_, vote)| *vote).count() as u32;
        let total_votes = oracle_votes.len() as u32;
        
        if total_votes < threshold {
            return 0;
        }
        
        (true_votes * 100) / total_votes
    }

    /// Validate event outcome
    pub fn validate_event_outcome(outcome: &EventOutcome) -> bool {
        match outcome {
            EventOutcome::Pending => true,
            EventOutcome::HomeWin => true,
            EventOutcome::AwayWin => true,
            EventOutcome::Draw => true,
            EventOutcome::Canceled => true,
            EventOutcome::Postponed => true,
        }
    }

    /// Calculate market depth
    pub fn calculate_market_depth(
        orders_for: &[Order],
        orders_against: &[Order],
    ) -> (u64, u64) {
        let depth_for = orders_for.iter().map(|order| order.amount).sum();
        let depth_against = orders_against.iter().map(|order| order.amount).sum();
        (depth_for, depth_against)
    }

    /// Calculate implied probability
    pub fn calculate_implied_probability(odds: u64) -> u32 {
        if odds == 0 {
            return 0;
        }
        
        // Convert odds to implied probability (in basis points)
        (10000 * 10000) / odds
    }

    /// Validate odds format
    pub fn validate_odds_format(odds: u64) -> bool {
        odds >= 1000 && odds <= 1000000 // 0.1x to 100x
    }

    /// Calculate bet settlement amount
    pub fn calculate_settlement_amount(
        bet: &Bet,
        actual_outcome: &EventOutcome,
        platform_fee: u32,
    ) -> u64 {
        if bet.outcome == *actual_outcome {
            calculate_payout(bet.amount, bet.odds, platform_fee)
        } else {
            0 // Losing bet
        }
    }

    /// Generate unique event ID
    pub fn generate_event_id(env: &Env, sport: &str, teams: &str) -> Bytes {
        let timestamp = env.ledger().timestamp();
        let random_bytes = env.prng().gen::<[u8; 16]>();
        let mut id_bytes = sport.as_bytes().to_vec();
        id_bytes.extend_from_slice(teams.as_bytes());
        id_bytes.extend_from_slice(&timestamp.to_be_bytes());
        id_bytes.extend_from_slice(&random_bytes);
        Bytes::from_slice(&id_bytes)
    }

    /// Calculate liquidity provider token value
    pub fn calculate_lp_token_value(
        total_lp_tokens: u64,
        total_liquidity: u64,
        user_lp_tokens: u64,
    ) -> u64 {
        if total_lp_tokens == 0 {
            return 0;
        }
        
        (user_lp_tokens * total_liquidity) / total_lp_tokens
    }
}

/// Constants used across contracts
pub mod constants {
    use soroban_sdk::Symbol;

    /// Storage keys
    pub const STATE_KEY: Symbol = Symbol::new(&"STATE");
    pub const ADMIN_KEY: Symbol = Symbol::new(&"ADMIN");
    pub const CONFIG_KEY: Symbol = Symbol::new(&"CONFIG");

    /// Platform constants
    pub const MIN_PLATFORM_FEE: u32 = 50; // 0.5%
    pub const MAX_PLATFORM_FEE: u32 = 1000; // 10%
    pub const DEFAULT_PLATFORM_FEE: u32 = 200; // 2%
    pub const MIN_BET_AMOUNT: u64 = 1000000; // 0.1 XLM
    pub const MAX_BET_AMOUNT: u64 = 1000000000; // 100 XLM
    pub const DEFAULT_MIN_BET_AMOUNT: u64 = 1000000; // 0.1 XLM
    pub const DEFAULT_MAX_BET_AMOUNT: u64 = 100000000; // 10 XLM

    /// Betting market constants
    pub const MAX_PARLAY_SIZE: u32 = 10; // Maximum 10 selections in parlay
    pub const MIN_ODDS: u64 = 1000; // 0.1x minimum odds
    pub const MAX_ODDS: u64 = 1000000; // 100x maximum odds
    pub const DEFAULT_MAX_PARLAY_SIZE: u32 = 8; // Default 8 selections
    pub const MAX_TIME_ADJUSTMENT: u32 = 500; // 5% maximum time adjustment

    /// Liquidity pool constants
    pub const MIN_LIQUIDITY: u64 = 10000000; // 1 XLM minimum liquidity
    pub const MAX_LIQUIDITY: u64 = 10000000000; // 1000 XLM maximum liquidity
    pub const DEFAULT_LIQUIDITY_PROVIDER_SHARE: u32 = 7000; // 70% to liquidity providers
    pub const PLATFORM_LIQUIDITY_SHARE: u32 = 3000; // 30% to platform

    /// Oracle constants
    pub const MIN_ORACLE_VOTES: u32 = 3; // Minimum 3 oracle votes
    pub const DEFAULT_ORACLE_THRESHOLD: u32 = 66; // 66% consensus threshold
    pub const ORACLE_VOTING_PERIOD: u64 = 3600; // 1 hour voting period
    pub const MAX_ORACLE_PROVIDERS: u32 = 10; // Maximum 10 oracle providers

    /// Governance constants
    pub const VOTING_PERIOD: u64 = 604800; // 7 days
    pub const QUORUM_REQUIREMENT: u32 = 1000; // 10% of total supply
    pub const PROPOSAL_THRESHOLD: u32 = 500; // 5% of total supply
    pub const MIN_VOTING_POWER: u128 = 1000; // Minimum tokens to vote
    pub const GOVERNANCE_TOKEN_SUPPLY: u128 = 10000000000; // 10M tokens total

    /// Event constants
    pub const MIN_EVENT_DURATION: u64 = 3600; // 1 hour minimum
    pub const MAX_EVENT_DURATION: u64 = 86400 * 30; // 30 days maximum
    pub const DEFAULT_EVENT_DURATION: u64 = 86400 * 2; // 2 days default
    pub const MAX_BETTING_PERIOD: u64 = 3600; // 1 hour before event start
    pub const SETTLEMENT_DELAY: u64 = 3600; // 1 hour after event end

    /// Amount constants (in stroops)
    pub const ONE_XLM: u128 = 10000000; // 1 XLM
    pub const MIN_DEPOSIT_AMOUNT: u128 = 1000000; // 0.1 XLM
    pub const MAX_DEPOSIT_AMOUNT: u128 = 10000000000; // 1000 XLM

    /// Fee constants
    pub const PLATFORM_FEE_SHARE: u32 = 5000; // 50%
    pub const LIQUIDITY_PROVIDER_SHARE: u32 = 4000; // 40%
    pub const TREASURY_SHARE: u32 = 1000; // 10%

    /// Risk management constants
    pub const MAX_EXPOSURE_PER_EVENT: u64 = 100000000; // 100 XLM max exposure
    pub const MAX_EXPOSURE_PER_USER: u64 = 10000000; // 10 XLM max user exposure
    pub const DEFAULT_MAX_EXPOSURE_PER_EVENT: u64 = 50000000; // 50 XLM default
    pub const DEFAULT_MAX_EXPOSURE_PER_USER: u64 = 5000000; // 5 XLM default

    /// Quality constants
    pub const ORACLE_QUALITY_THRESHOLD: u32 = 8000; // 80% quality threshold
    pub const LIQUIDITY_QUALITY_SCORE: u32 = 10000; // 100% maximum quality score
    pub const MIN_QUALITY_SCORE: u32 = 0; // 0% minimum quality score

    /// Market constants
    pub const MIN_MARKET_DEPTH: u64 = 1000000; // 0.1 XLM minimum market depth
    pub const MAX_MARKET_SPREAD: u32 = 500; // 5% maximum market spread
    pub const DEFAULT_MARKET_SPREAD: u32 = 200; // 2% default market spread

    /// Time constants
    pub const SECONDS_PER_MINUTE: u64 = 60;
    pub const SECONDS_PER_HOUR: u64 = 3600;
    pub const SECONDS_PER_DAY: u64 = 86400;
    pub const SECONDS_PER_WEEK: u64 = 604800;

    /// Sport types
    pub const SPORT_FOOTBALL: &str = "football";
    pub const SPORT_BASKETBALL: &str = "basketball";
    pub const SPORT_TENNIS: &str = "tennis";
    pub const SPORT_BASEBALL: &str = "baseball";
    pub const SPORT_HOCKEY: &str = "hockey";
    pub const SPORT_SOCCER: &str = "soccer";
    pub const SPORT_ESPORTS: &str = "esports";

    /// Bet types
    pub const BET_TYPE_MONEYLINE: &str = "moneyline";
    pub const BET_TYPE_SPREAD: &str = "spread";
    pub const BET_TYPE_TOTAL: &str = "total";
    pub const BET_TYPE_PARLAY: &str = "parlay";
    pub const BET_TYPE_PROP: &str = "prop";

    /// Event status
    pub const EVENT_STATUS_UPCOMING: &str = "upcoming";
    pub const EVENT_STATUS_LIVE: &str = "live";
    pub const EVENT_STATUS_FINISHED: &str = "finished";
    pub const EVENT_STATUS_CANCELED: &str = "canceled";
    pub const EVENT_STATUS_POSTPONED: &str = "postponed";
}
