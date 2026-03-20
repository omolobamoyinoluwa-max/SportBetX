//! # Type Definitions for SportBetX Contracts
//! 
//! This module defines all data types used across SportBetX smart contracts.

use soroban_sdk::{
    contracttype, Address, Bytes, Symbol, String, Vec, Map, u64, u128, i128, u32, u8, bool, Env,
};

/// Sports event structure
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SportsEvent {
    /// Unique event identifier
    pub id: Bytes,
    /// Event title
    pub title: String,
    /// Sport type (football, basketball, tennis, etc.)
    pub sport: String,
    /// Home team name
    pub home_team: String,
    /// Away team name
    pub away_team: String,
    /// Event start timestamp
    pub start_time: u64,
    /// Event end timestamp
    pub end_time: u64,
    /// Event status
    pub status: EventStatus,
    /// Event outcome
    pub outcome: EventOutcome,
    /// Event metadata
    pub metadata: Bytes,
}

/// Event status enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum EventStatus {
    Upcoming,    // Event is scheduled
    Live,        // Event is in progress
    Finished,     // Event has concluded
    Canceled,    // Event was canceled
    Postponed,   // Event was postponed
}

/// Event outcome enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum EventOutcome {
    Pending,     // Outcome not yet determined
    HomeWin,     // Home team won
    AwayWin,     // Away team won
    Draw,        // Event ended in draw
    Canceled,    // Event was canceled
    Postponed,   // Event was postponed
}

/// Bet structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Bet {
    /// Unique bet identifier
    pub id: Bytes,
    /// Bettor address
    pub bettor: Address,
    /// Event ID
    pub event_id: Bytes,
    /// Bet type
    pub bet_type: BetType,
    /// Bet selection
    pub selection: BetSelection,
    /// Bet amount
    pub amount: u64,
    /// Odds at time of bet
    pub odds: u64,
    /// Predicted outcome
    pub outcome: EventOutcome,
    /// Bet timestamp
    pub timestamp: u64,
    /// Bet status
    pub status: BetStatus,
    /// Payout amount
    pub payout: u64,
    /// Bet metadata
    pub metadata: Bytes,
}

/// Bet type enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BetType {
    Moneyline,    // Simple win/lose bet
    Spread,       // Point spread bet
    Total,        // Over/under bet
    Parlay,       // Multiple bet combination
    Prop,         // Proposition bet
    Live,         // In-game live bet
}

/// Bet selection structure
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BetSelection {
    /// Event ID
    pub event_id: Bytes,
    /// Selection type
    pub selection_type: String,
    /// Selection value
    pub selection_value: String,
    /// Odds for this selection
    pub odds: u64,
}

/// Bet status enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BetStatus {
    Pending,      // Bet is waiting for event outcome
    Won,          // Bet was successful
    Lost,         // Bet was unsuccessful
    Refunded,     // Bet was refunded
    Canceled,     // Bet was canceled
}

/// Betting market structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct BettingMarket {
    /// Unique market identifier
    pub id: Bytes,
    /// Associated event ID
    pub event_id: Bytes,
    /// Market type
    pub market_type: String,
    /// Market title
    pub title: String,
    /// Current odds
    pub current_odds: Map<String, u64>,
    /// Total volume
    pub total_volume: u64,
    /// Market status
    pub status: MarketStatus,
    /// Liquidity pool ID
    pub liquidity_pool_id: Bytes,
    /// Market metadata
    pub metadata: Bytes,
}

/// Market status enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MarketStatus {
    Open,         // Market is open for betting
    Closed,        // Market is closed
    Suspended,     // Market is temporarily suspended
    Settled,      // Market has been settled
}

/// Order structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Order {
    /// Unique order identifier
    pub id: Bytes,
    /// Order creator
    pub creator: Address,
    /// Market ID
    pub market_id: Bytes,
    /// Order type
    pub order_type: OrderType,
    /// Bet amount
    pub amount: u64,
    /// Odds offered/requested
    pub odds: u64,
    /// Order timestamp
    pub timestamp: u64,
    /// Order status
    pub status: OrderStatus,
    /// Filled amount
    pub filled_amount: u64,
    /// Remaining amount
    pub remaining_amount: u64,
}

/// Order type enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum OrderType {
    Back,         // Betting for an outcome
    Lay,          // Betting against an outcome
}

/// Order status enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum OrderStatus {
    Open,         // Order is open
    Partial,       // Order is partially filled
    Filled,       // Order is completely filled
    Canceled,     // Order is canceled
}

/// Liquidity pool structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct LiquidityPool {
    /// Unique pool identifier
    pub id: Bytes,
    /// Pool name
    pub name: String,
    /// Pool type
    pub pool_type: PoolType,
    /// Associated market/event IDs
    pub market_ids: Vec<Bytes>,
    /// Total liquidity
    pub total_liquidity: u64,
    /// Provider shares
    pub provider_shares: Map<Address, u64>,
    /// Total provider shares
    pub total_provider_shares: u64,
    /// Pool fees collected
    pub fees_collected: u64,
    /// Pool status
    pub status: PoolStatus,
    /// Creation timestamp
    pub created_at: u64,
    /// Pool metadata
    pub metadata: Bytes,
}

/// Pool type enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PoolType {
    Event,        // Event-specific pool
    Sport,        // Sport-specific pool
    Parlay,       // Parlay betting pool
    Insurance,     // Insurance pool for large payouts
}

/// Pool status enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PoolStatus {
    Active,       // Pool is active
    Inactive,     // Pool is inactive
    Frozen,       // Pool is frozen
    Liquidating,  // Pool is being liquidated
}

/// Liquidity position structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct LiquidityPosition {
    /// Unique position identifier
    pub id: Bytes,
    /// Liquidity provider address
    pub provider: Address,
    /// Pool ID
    pub pool_id: Bytes,
    /// Amount provided
    pub amount: u64,
    /// Shares received
    pub shares: u64,
    /// Rewards earned
    pub rewards: u64,
    /// Creation timestamp
    pub created_at: u64,
    /// Last reward claim timestamp
    pub last_claimed_at: u64,
    /// Position metadata
    pub metadata: Bytes,
}

/// Oracle structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Oracle {
    /// Unique oracle identifier
    pub id: Bytes,
    /// Oracle provider address
    pub provider: Address,
    /// Oracle name
    pub name: String,
    /// Oracle type
    pub oracle_type: OracleType,
    /// Oracle status
    pub status: OracleStatus,
    /// Confidence score
    pub confidence_score: u32,
    /// Total reports
    pub total_reports: u32,
    /// Successful reports
    pub successful_reports: u32,
    /// Creation timestamp
    pub created_at: u64,
    /// Last activity timestamp
    pub last_activity: u64,
    /// Oracle metadata
    pub metadata: Bytes,
}

/// Oracle type enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum OracleType {
    SportsData,    // Sports data provider
    PriceFeed,     // Price feed provider
    Weather,       // Weather data provider
    Custom,         // Custom oracle
}

/// Oracle status enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum OracleStatus {
    Active,        // Oracle is active
    Inactive,      // Oracle is inactive
    Suspended,     // Oracle is suspended
    Blacklisted,   // Oracle is blacklisted
}

/// Oracle report structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct OracleReport {
    /// Unique report identifier
    pub id: Bytes,
    /// Oracle provider
    pub oracle_id: Bytes,
    /// Event ID
    pub event_id: Bytes,
    /// Reported outcome
    pub outcome: EventOutcome,
    /// Report timestamp
    pub timestamp: u64,
    /// Report signature
    pub signature: Bytes,
    /// Report metadata
    pub metadata: Bytes,
}

/// Governance proposal structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct GovernanceProposal {
    /// Unique proposal identifier
    pub id: Bytes,
    /// Proposal creator
    pub proposer: Address,
    /// Proposal type
    pub proposal_type: ProposalType,
    /// Proposal title
    pub title: String,
    /// Proposal description
    pub description: String,
    /// Target contract address
    pub target_contract: Address,
    /// Target function
    pub target_function: String,
    /// Call data
    pub call_data: Bytes,
    /// Voting start timestamp
    pub voting_start: u64,
    /// Voting end timestamp
    pub voting_end: u64,
    /// Votes for
    pub votes_for: u32,
    /// Votes against
    pub votes_against: u32,
    /// Votes abstain
    pub votes_abstain: u32,
    /// Proposal status
    pub status: ProposalStatus,
    /// Execution timestamp
    pub executed_at: Option<u64>,
    /// Execution result
    pub result: Option<ProposalResult>,
}

/// Proposal type enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ProposalType {
    ParameterChange,    // Change platform parameters
    FeeAdjustment,    // Adjust platform fees
    FeatureUpgrade,   // Add new features
    EmergencyAction,   // Emergency actions
    TreasuryManagement, // Manage treasury funds
    ContractUpgrade,   // Upgrade smart contracts
    OracleManagement,  // Manage oracle providers
}

/// Proposal status enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ProposalStatus {
    Active,       // Currently voting
    Passed,       // Voting completed successfully
    Failed,       // Voting failed
    Executed,     // Proposal executed
    Expired,      // Voting period ended
    Cancelled,    // Proposal cancelled
}

/// Proposal execution result
#[contracttype]
#[derive(Clone, Debug)]
pub struct ProposalResult {
    /// Success status
    pub success: bool,
    /// Return data
    pub data: Bytes,
    /// Error message
    pub error: Option<String>,
}

/// Vote structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Vote {
    /// Voter address
    pub voter: Address,
    /// Proposal ID
    pub proposal_id: Bytes,
    /// Vote choice
    pub choice: VoteChoice,
    /// Voting power
    pub power: u128,
    /// Vote timestamp
    pub timestamp: u64,
}

/// Vote choice enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum VoteChoice {
    For,     // Vote in favor
    Against, // Vote against
    Abstain, // Abstain from voting
}

/// User profile structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct UserProfile {
    /// User address
    pub address: Address,
    /// User name
    pub name: String,
    /// User avatar IPFS hash
    pub avatar: Bytes,
    /// User statistics
    pub stats: UserStats,
    /// User preferences
    pub preferences: UserPreferences,
    /// User verification status
    pub verified: bool,
    /// User reputation score
    pub reputation: u32,
    /// Creation timestamp
    pub created_at: u64,
    /// Last updated timestamp
    pub updated_at: u64,
}

/// User statistics structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct UserStats {
    /// Total bets placed
    pub total_bets: u32,
    /// Total amount bet
    pub total_bet_amount: u64,
    /// Total winnings
    pub total_winnings: u64,
    /// Win rate
    pub win_rate: u32,
    /// Total liquidity provided
    pub total_liquidity_provided: u64,
    /// Total liquidity rewards
    pub total_liquidity_rewards: u64,
    /// Total governance votes
    pub total_governance_votes: u32,
    /// Last activity timestamp
    pub last_activity: u64,
}

/// User preferences structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct UserPreferences {
    /// Preferred odds format
    pub odds_format: String,
    /// Preferred currency
    pub preferred_currency: String,
    /// Notification settings
    pub notifications: NotificationSettings,
    /// Risk tolerance level
    pub risk_tolerance: String,
    /// Auto-betting settings
    pub auto_betting: AutoBettingSettings,
}

/// Notification settings structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct NotificationSettings {
    /// Email notifications
    pub email: bool,
    /// Push notifications
    pub push: bool,
    /// Bet notifications
    pub bet_notifications: bool,
    /// Event notifications
    pub event_notifications: bool,
    /// Liquidity notifications
    pub liquidity_notifications: bool,
    /// Governance notifications
    pub governance_notifications: bool,
}

/// Auto-betting settings structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct AutoBettingSettings {
    /// Auto-betting enabled
    pub enabled: bool,
    /// Maximum auto-bet amount
    pub max_bet_amount: u64,
    /// Auto-bet conditions
    pub conditions: Vec<String>,
    /// Auto-bet cooldown period
    pub cooldown_period: u64,
}

/// Platform statistics structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct PlatformStats {
    /// Total events
    pub total_events: u32,
    /// Total bets
    pub total_bets: u32,
    /// Total volume (24h)
    pub volume_24h: u64,
    /// Total volume (7d)
    pub volume_7d: u64,
    /// Total liquidity
    pub total_liquidity: u64,
    /// Total users
    pub total_users: u32,
    /// Active users (24h)
    pub active_users_24h: u32,
    /// Platform revenue (24h)
    pub revenue_24h: u64,
    /// Platform revenue (7d)
    pub revenue_7d: u64,
    /// Last updated timestamp
    pub last_updated: u64,
}

/// Risk management structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct RiskManagement {
    /// Maximum exposure per event
    pub max_exposure_per_event: u64,
    /// Maximum exposure per user
    pub max_exposure_per_user: u64,
    /// Current total exposure
    pub current_total_exposure: u64,
    /// Risk level
    pub risk_level: RiskLevel,
    /// Emergency pause status
    pub emergency_pause: bool,
    /// Last risk assessment timestamp
    pub last_assessment: u64,
}

/// Risk level enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum RiskLevel {
    Low,      // Low risk level
    Medium,   // Medium risk level
    High,      // High risk level
    Critical,  // Critical risk level
}

/// Settlement structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Settlement {
    /// Unique settlement identifier
    pub id: Bytes,
    /// Event ID
    pub event_id: Bytes,
    /// Final outcome
    pub outcome: EventOutcome,
    /// Settlement timestamp
    pub settled_at: u64,
    /// Total bets settled
    pub total_bets_settled: u32,
    /// Total amount paid out
    pub total_payout: u64,
    /// Platform fees collected
    pub platform_fees: u64,
    /// Settlement metadata
    pub metadata: Bytes,
}

// Implementations for type conversions and validation
impl SportsEvent {
    /// Create new sports event
    pub fn new(
        id: Bytes,
        title: String,
        sport: String,
        home_team: String,
        away_team: String,
        start_time: u64,
        end_time: u64,
        metadata: Bytes,
    ) -> Self {
        Self {
            id,
            title,
            sport,
            home_team,
            away_team,
            start_time,
            end_time,
            status: EventStatus::Upcoming,
            outcome: EventOutcome::Pending,
            metadata,
        }
    }
    
    /// Validate event data
    pub fn validate(&self) -> bool {
        !self.title.is_empty() && 
        !self.sport.is_empty() && 
        !self.home_team.is_empty() && 
        !self.away_team.is_empty() &&
        self.start_time > 0 &&
        self.end_time > self.start_time &&
        (self.end_time - self.start_time) <= 86400 * 30 // Max 30 days
    }
    
    /// Check if event is live
    pub fn is_live(&self, current_time: u64) -> bool {
        matches!(self.status, EventStatus::Live) &&
        current_time >= self.start_time &&
        current_time <= self.end_time
    }
    
    /// Check if betting is allowed
    pub fn is_betting_allowed(&self, current_time: u64) -> bool {
        matches!(self.status, EventStatus::Upcoming) &&
        current_time < self.start_time &&
        (self.start_time - current_time) > 3600 // At least 1 hour before start
    }
}

impl Bet {
    /// Calculate potential payout
    pub fn potential_payout(&self, platform_fee: u32) -> u64 {
        calculate_payout(self.amount, self.odds, platform_fee)
    }
    
    /// Check if bet is winning
    pub fn is_winning(&self, actual_outcome: &EventOutcome) -> bool {
        self.outcome == *actual_outcome
    }
}

impl LiquidityPool {
    /// Calculate provider share value
    pub fn calculate_share_value(&self, provider_shares: u64) -> u64 {
        if self.total_provider_shares == 0 {
            return 0;
        }
        
        (provider_shares * self.total_liquidity) / self.total_provider_shares
    }
    
    /// Add liquidity
    pub fn add_liquidity(&mut self, provider: &Address, amount: u64) -> u64 {
        let new_shares = if self.total_provider_shares == 0 {
            amount
        } else {
            (amount * self.total_provider_shares) / self.total_liquidity
        };
        
        self.total_liquidity += amount;
        self.total_provider_shares += new_shares;
        
        let current_shares = self.provider_shares.get(provider).unwrap_or(0);
        self.provider_shares.set(provider.clone(), current_shares + new_shares);
        
        new_shares
    }
    
    /// Remove liquidity
    pub fn remove_liquidity(&mut self, provider: &Address, shares: u64) -> u64 {
        let current_shares = self.provider_shares.get(provider).unwrap_or(0);
        if current_shares < shares {
            return 0;
        }
        
        let amount = (shares * self.total_liquidity) / self.total_provider_shares;
        
        self.total_liquidity -= amount;
        self.total_provider_shares -= shares;
        self.provider_shares.set(provider.clone(), current_shares - shares);
        
        amount
    }
}

impl Oracle {
    /// Calculate confidence score
    pub fn calculate_confidence(&self) -> u32 {
        if self.total_reports == 0 {
            return 0;
        }
        
        (self.successful_reports * 10000) / self.total_reports
    }
    
    /// Update confidence score
    pub fn update_confidence(&mut self, successful: bool) {
        self.total_reports += 1;
        if successful {
            self.successful_reports += 1;
        }
        
        self.confidence_score = self.calculate_confidence();
    }
}

impl GovernanceProposal {
    /// Check if proposal is executable
    pub fn is_executable(&self) -> bool {
        matches!(self.status, ProposalStatus::Passed) && 
        self.voting_end < env::ledger().timestamp()
    }
    
    /// Calculate voting progress
    pub fn get_voting_progress(&self) -> u32 {
        let total_votes = self.votes_for + self.votes_against + self.votes_abstain;
        if total_votes == 0 {
            return 0;
        }
        (self.votes_for * 100) / total_votes
    }
}

impl UserProfile {
    /// Update user statistics
    pub fn update_stats(&mut self, bet_amount: u64, won: bool, payout: u64) {
        self.stats.total_bets += 1;
        self.stats.total_bet_amount += bet_amount;
        
        if won {
            self.stats.total_winnings += payout;
        }
        
        self.stats.win_rate = (self.stats.total_winnings * 10000) / self.stats.total_bet_amount;
        self.stats.last_activity = env::ledger().timestamp();
    }
    
    /// Calculate user level based on activity
    pub fn calculate_level(&self) -> u32 {
        let activity_score = self.stats.total_bets + 
            (self.stats.total_liquidity_provided / 1000000) + // 1 point per XLM liquidity
            (self.stats.total_governance_votes / 10); // 1 point per 10 votes
        
        // Level calculation (simplified)
        if activity_score < 10 { return 1; }
        if activity_score < 50 { return 2; }
        if activity_score < 200 { return 3; }
        if activity_score < 1000 { return 4; }
        5
    }
}

// Utility functions
pub fn calculate_payout(bet_amount: u64, odds: u64, platform_fee: u32) -> u64 {
    let gross_payout = (bet_amount * odds) / 10000;
    let platform_cut = (gross_payout * u64::from(platform_fee)) / 10000;
    gross_payout - platform_cut
}

pub fn calculate_odds(total_amount_for: u64, total_amount_against: u64) -> (u64, u64) {
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
