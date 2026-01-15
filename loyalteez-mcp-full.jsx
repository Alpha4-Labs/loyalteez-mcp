import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Terminal, Zap, Users, Trophy, Gift, Shield, MessageSquare, Clock, Star, Layers, Code, Bot, Sparkles, Wand2, Database, FileCode, Lightbulb, PenTool, Settings, Play, Check, Copy, Plus } from 'lucide-react';

const LoyalteezMCP = () => {
  const [activeTab, setActiveTab] = useState('magic');
  const [expandedTools, setExpandedTools] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState('discord');
  const [designerStep, setDesignerStep] = useState(0);
  const [copied, setCopied] = useState(null);

  const toggleTool = (toolId) => {
    setExpandedTools(prev => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs = [
    { id: 'magic', label: 'The Magic', icon: Wand2 },
    { id: 'designer', label: 'Program Designer', icon: PenTool },
    { id: 'tools', label: 'MCP Tools', icon: Terminal },
    { id: 'events', label: 'Event System', icon: Zap },
    { id: 'knowledge', label: 'Knowledge Base', icon: Database },
    { id: 'examples', label: 'Vibe Examples', icon: Sparkles },
  ];

  // The core insight: events are infinitely flexible
  const eventExamples = {
    discord: [
      { id: 'discord_daily_gm', name: 'Daily GM', desc: 'First "gm" message each day', reward: 10, category: 'engagement' },
      { id: 'discord_voice_30min', name: 'Voice Participation', desc: '30 minutes in voice channels', reward: 15, category: 'engagement' },
      { id: 'discord_helpful_answer', name: 'Helpful Answer', desc: 'Mod-recognized helpful response', reward: 50, category: 'quality' },
      { id: 'discord_bug_report', name: 'Bug Report', desc: 'Valid bug report with repro steps', reward: 100, category: 'quality' },
      { id: 'discord_meme_contest_win', name: 'Meme Contest Winner', desc: 'Weekly meme contest winner', reward: 500, category: 'creative' },
      { id: 'discord_ama_attendance', name: 'AMA Attendance', desc: 'Attended monthly AMA session', reward: 75, category: 'engagement' },
      { id: 'discord_onboarding_complete', name: 'Onboarding Complete', desc: 'Completed all onboarding steps', reward: 100, category: 'onboarding' },
      { id: 'discord_referral_joined', name: 'Referral Joined', desc: 'Referred user joined and verified', reward: 200, category: 'growth' },
    ],
    telegram: [
      { id: 'telegram_daily_checkin', name: 'Daily Check-in', desc: 'Daily /checkin command', reward: 10, category: 'engagement' },
      { id: 'telegram_group_message', name: 'Quality Message', desc: 'Meaningful contribution to chat', reward: 5, category: 'engagement' },
      { id: 'telegram_sticker_reaction', name: 'Sticker Reaction', desc: 'Reacted with brand sticker pack', reward: 3, category: 'fun' },
      { id: 'telegram_mini_app_play', name: 'Mini App Session', desc: 'Played Telegram mini app', reward: 20, category: 'engagement' },
      { id: 'telegram_poll_vote', name: 'Poll Participation', desc: 'Voted in community poll', reward: 5, category: 'engagement' },
      { id: 'telegram_video_chat_join', name: 'Video Chat Join', desc: 'Joined video chat session', reward: 25, category: 'engagement' },
      { id: 'telegram_premium_gift', name: 'Premium Gifted', desc: 'Gifted Telegram Premium to member', reward: 500, category: 'premium' },
      { id: 'telegram_channel_boost', name: 'Channel Boost', desc: 'Boosted the channel', reward: 300, category: 'premium' },
    ],
    web: [
      { id: 'web_account_created', name: 'Account Created', desc: 'New user registration', reward: 100, category: 'onboarding' },
      { id: 'web_profile_complete', name: 'Profile Complete', desc: 'Filled out all profile fields', reward: 50, category: 'onboarding' },
      { id: 'web_newsletter_subscribe', name: 'Newsletter Subscribe', desc: 'Subscribed to newsletter', reward: 25, category: 'engagement' },
      { id: 'web_product_review', name: 'Product Review', desc: 'Left a product review', reward: 75, category: 'quality' },
      { id: 'web_social_share', name: 'Social Share', desc: 'Shared content on social media', reward: 30, category: 'growth' },
      { id: 'web_referral_purchase', name: 'Referral Purchase', desc: 'Referred user made purchase', reward: 500, category: 'growth' },
      { id: 'web_first_purchase', name: 'First Purchase', desc: 'Completed first purchase', reward: 200, category: 'commerce' },
      { id: 'web_repeat_purchase', name: 'Repeat Purchase', desc: 'Returned customer purchase', reward: 100, category: 'commerce' },
    ],
    gaming: [
      { id: 'game_first_win', name: 'First Victory', desc: 'Won first match/game', reward: 50, category: 'achievement' },
      { id: 'game_daily_quest', name: 'Daily Quest', desc: 'Completed daily quest', reward: 15, category: 'engagement' },
      { id: 'game_level_up', name: 'Level Up', desc: 'Gained a level (per level)', reward: 10, category: 'progression' },
      { id: 'game_tournament_entry', name: 'Tournament Entry', desc: 'Entered a tournament', reward: 25, category: 'competitive' },
      { id: 'game_tournament_win', name: 'Tournament Win', desc: 'Won a tournament', reward: 1000, category: 'competitive' },
      { id: 'game_achievement_unlock', name: 'Achievement Unlock', desc: 'Unlocked rare achievement', reward: 100, category: 'achievement' },
      { id: 'game_guild_contribution', name: 'Guild Contribution', desc: 'Contributed to guild goal', reward: 20, category: 'social' },
      { id: 'game_streamer_collab', name: 'Streamer Collab', desc: 'Played with partnered streamer', reward: 200, category: 'special' },
    ],
  };

  const tools = {
    program: {
      label: 'Program Design',
      icon: Wand2,
      color: 'violet',
      desc: 'Design entire loyalty programs from natural language',
      items: [
        {
          id: 'design_program',
          name: 'loyalteez_design_program',
          desc: 'Design a complete loyalty program from context. AI analyzes your app/community and generates optimal event structure.',
          phase: 'core',
          params: `{
  brandId: string,           // Your brand wallet address
  context: {
    appType: string,         // "discord_community" | "telegram_group" | "ecommerce" | "gaming" | "saas"
    goals: string[],         // ["increase_engagement", "drive_purchases", "reward_quality"]
    platforms: string[],     // ["discord", "telegram", "web"]
    budget?: {
      monthly_ltz: number,   // Monthly LTZ budget
      avg_reward: number     // Target average reward
    },
    audience?: string,       // "developers" | "gamers" | "shoppers" | etc.
    existingEvents?: string[] // Events you already have
  }
}`,
          returns: `{
  program: {
    name: string,
    philosophy: string,
    events: CustomEvent[],     // Full event definitions
    tiers: TierConfig[],       // Role/tier structure
    streakConfig: object,      // Recommended streak settings
    estimatedBudget: object
  },
  implementation: {
    discord?: string,          // Discord bot code
    telegram?: string,         // Telegram bot code
    web?: string,              // Web SDK code
    webhooks?: string          // Backend webhook code
  }
}`,
          example: `// "Design a loyalty program for my developer Discord"
const program = await loyalteez_design_program({
  brandId: "0x1234...abcd",
  context: {
    appType: "discord_community",
    goals: ["reward_quality", "increase_engagement", "reduce_churn"],
    platforms: ["discord"],
    audience: "developers",
    budget: { monthly_ltz: 50000, avg_reward: 25 }
  }
});

// Returns: Complete program with events like:
// - daily_checkin, helpful_answer, bug_report, code_review
// - tutorial_created, ama_attendance, streak_milestone
// Plus full implementation code for Discord bot`
        },
      ]
    },
    events: {
      label: 'Event Management',
      icon: Zap,
      color: 'amber',
      desc: 'Create and manage infinitely flexible custom events',
      items: [
        {
          id: 'create_event',
          name: 'loyalteez_create_event',
          desc: 'Create a custom event. Events can be ANYTHING - the system is infinitely flexible. Once created, the backend handles: fire event → check auth → reward from balance.',
          phase: 'core',
          params: `{
  brandId: string,
  event: {
    name: string,              // Human-readable name
    eventType: string,         // Unique identifier (auto-generated if not provided)
    description: string,       // What triggers this event
    category: string,          // "engagement" | "quality" | "growth" | "commerce" | custom
    defaultReward: number,     // LTZ amount
    maxClaimsPerUser: number,  // 1 for one-time, higher for repeatable
    cooldownHours?: number,    // Time between claims (0 = no cooldown)
    requiresEmail: boolean,    // Usually true
    detectionMethods?: [{      // How event is triggered
      method: "webhook" | "discord_interaction" | "url_pattern" | "form_submission" | "css_selector",
      config: object
    }],
    metadata?: object          // Any additional config
  }
}`,
          returns: `{
  success: boolean,
  event: {
    id: string,                // Format: custom_{brandId}_{timestamp}
    eventType: string,
    ...eventConfig
  },
  trackingCode: string,        // Ready-to-use code snippet
  webhookEndpoint: string      // API endpoint for this event
}`,
          example: `// Create a "Helpful Answer" event for Discord
const event = await loyalteez_create_event({
  brandId: "0x1234...abcd",
  event: {
    name: "Helpful Answer",
    description: "Recognized by mod for helping another member",
    category: "quality",
    defaultReward: 50,
    maxClaimsPerUser: 100,  // Can earn multiple times
    cooldownHours: 1,       // Max once per hour
    requiresEmail: false,   // Discord ID is enough
    detectionMethods: [{
      method: "discord_interaction",
      config: { command: "/reward helpful_answer" }
    }]
  }
});

// Now anyone can trigger: POST /manual-event with eventType`
        },
        {
          id: 'create_events_batch',
          name: 'loyalteez_create_events_batch',
          desc: 'Create multiple events at once. Perfect for setting up entire programs.',
          phase: 'core',
          params: `{
  brandId: string,
  events: EventDefinition[],  // Array of events
  platform: string            // "discord" | "telegram" | "web" | etc.
}`,
          returns: `{
  created: Event[],
  failed: { event: string, error: string }[],
  implementationCode: string   // Ready-to-use code for the platform
}`,
          example: `// Set up a complete Discord program
const result = await loyalteez_create_events_batch({
  brandId: "0x1234...abcd",
  platform: "discord",
  events: [
    { name: "Daily GM", reward: 10, maxClaims: 1, cooldown: 24 },
    { name: "Voice 30min", reward: 15, maxClaims: 10, cooldown: 0 },
    { name: "Helpful Answer", reward: 50, maxClaims: 100, cooldown: 1 },
    { name: "Bug Report", reward: 100, maxClaims: 50, cooldown: 0 },
    { name: "AMA Attendance", reward: 75, maxClaims: 1, cooldown: 168 }
  ]
});

// Returns all events + Discord bot implementation code`
        },
        {
          id: 'track_event',
          name: 'loyalteez_track_event',
          desc: 'Fire any event. Works for ANY event type - predefined or custom.',
          phase: 'core',
          params: `{
  brandId: string,
  eventType: string,           // Any event type string
  userIdentifier: {
    email?: string,            // User email
    platform?: string,         // "discord" | "telegram" | etc.
    platformUserId?: string    // Platform-specific ID
  },
  metadata?: object            // Additional data
}`,
          returns: `{
  success: boolean,
  reward: number,
  newBalance: number,
  eventId: string,
  cooldownRemaining?: number   // If on cooldown
}`,
          example: `// Track a custom event
await loyalteez_track_event({
  brandId: "0x1234...abcd",
  eventType: "helpful_answer",  // Your custom event
  userIdentifier: {
    platform: "discord",
    platformUserId: "123456789"
  },
  metadata: {
    channel: "support",
    helped_user: "987654321"
  }
})`
        },
      ]
    },
    identity: {
      label: 'User Identity',
      icon: Users,
      color: 'blue',
      desc: 'Resolve platform identities to Loyalteez wallets',
      items: [
        {
          id: 'resolve_user',
          name: 'loyalteez_resolve_user',
          desc: 'Convert any platform identity to a Loyalteez wallet. Creates wallet if needed.',
          phase: 'core',
          params: `{
  brandId: string,
  platform: "discord" | "telegram" | "twitter" | "farcaster" | "github" | "google" | "email",
  platformUserId: string,
  platformUsername?: string    // For display
}`,
          returns: `{
  loyalteezEmail: string,      // "{platform}_{id}@loyalteez.app"
  walletAddress: string,       // "0x..."
  isNew: boolean,              // First time seeing this user
  balance: number              // Current LTZ balance
}`,
          example: `// Resolve Discord user to wallet
const user = await loyalteez_resolve_user({
  brandId: "0x1234...abcd",
  platform: "discord",
  platformUserId: "123456789012345678",
  platformUsername: "alice#1234"
});

// Returns: { 
//   loyalteezEmail: "discord_123456789012345678@loyalteez.app",
//   walletAddress: "0xabc...",
//   isNew: false,
//   balance: 1250
// }`
        },
      ]
    },
    engagement: {
      label: 'Engagement Services',
      icon: Star,
      color: 'green',
      desc: 'Streaks, leaderboards, achievements - all platform-agnostic',
      items: [
        {
          id: 'streak_checkin',
          name: 'loyalteez_streak_checkin',
          desc: 'Process a streak check-in with automatic multipliers and milestones.',
          phase: 'core',
          params: `{
  brandId: string,
  userId: string,              // Platform user ID
  platform: string
}`,
          returns: `{
  success: boolean,
  streak: {
    current: number,
    longest: number,
    multiplier: number,        // 1.0, 1.1, 1.25, 1.5, 2.0
    graceUsed: boolean
  },
  reward: {
    base: number,
    final: number,             // After multiplier
    milestone?: number         // Bonus if milestone hit
  },
  nextMilestone: {
    days: number,
    bonus: number
  }
}`,
          example: `// Daily streak check-in
const result = await loyalteez_streak_checkin({
  brandId: "0x1234...abcd",
  userId: "discord_123456789",
  platform: "discord"
});

// Day 7: { streak: { current: 7, multiplier: 1.25 }, 
//          reward: { base: 10, final: 12, milestone: 50 } }`
        },
        {
          id: 'get_leaderboard',
          name: 'loyalteez_get_leaderboard',
          desc: 'Get ranked leaderboards by any metric.',
          phase: 'core',
          params: `{
  brandId: string,
  metric: "ltz_earned" | "streak" | "events_completed" | "referrals" | string,
  period: "daily" | "weekly" | "monthly" | "all_time",
  platform?: string,           // Filter by platform
  limit?: number               // Default 10
}`,
          returns: `{
  rankings: [{
    rank: number,
    userId: string,
    username: string,
    value: number,
    change: number             // +/- since last period
  }],
  userRank?: object            // Requesting user's position
}`,
          example: `// Weekly LTZ leaderboard
const board = await loyalteez_get_leaderboard({
  brandId: "0x1234...abcd",
  metric: "ltz_earned",
  period: "weekly",
  limit: 10
})`
        },
      ]
    },
  };

  const knowledgeBase = [
    {
      category: 'Architecture',
      items: [
        { name: 'Event Flow', desc: 'Fire event → Check auth (brandId) → Check eligibility → Reward from balance', uri: 'loyalteez://docs/architecture' },
        { name: 'User Identity', desc: '{platform}_{userId}@loyalteez.app → Deterministic wallet', uri: 'loyalteez://docs/identity' },
        { name: 'On-Chain', desc: 'LTZ (ERC-20) + Perks (ERC-1155) on Soneium', uri: 'loyalteez://docs/blockchain' },
      ]
    },
    {
      category: 'Event System',
      items: [
        { name: 'Custom Events', desc: 'ANY event type works. Format: custom_{brandId}_{timestamp} or any string', uri: 'loyalteez://docs/custom-events' },
        { name: 'Detection Methods', desc: 'Discord commands, webhooks, URL patterns, form submissions, CSS selectors', uri: 'loyalteez://docs/detection' },
        { name: 'Cooldowns & Limits', desc: 'Per-user max claims, time-based cooldowns, total supply caps', uri: 'loyalteez://docs/limits' },
      ]
    },
    {
      category: 'Platform Guides',
      items: [
        { name: 'Discord Integration', desc: 'Full bot with streaks, voice rewards, role multipliers, reaction drops', uri: 'loyalteez://docs/discord' },
        { name: 'Telegram Integration', desc: 'Bot commands, mini apps, stickers, premium features', uri: 'loyalteez://docs/telegram' },
        { name: 'Web/SDK Integration', desc: 'JavaScript SDK, automatic detection, webhooks', uri: 'loyalteez://docs/web-sdk' },
        { name: 'Shopify Integration', desc: 'Purchase rewards, review rewards, referral programs', uri: 'loyalteez://docs/shopify' },
      ]
    },
    {
      category: 'Shared Services',
      items: [
        { name: 'Streak Service', desc: 'Platform-agnostic streak tracking with multipliers', uri: 'loyalteez://docs/streaks' },
        { name: 'Leaderboard Service', desc: 'Real-time rankings by any metric', uri: 'loyalteez://docs/leaderboards' },
        { name: 'Achievement Service', desc: 'Unlockable achievements with NFT rewards', uri: 'loyalteez://docs/achievements' },
        { name: 'Perks Service', desc: 'Browse, check eligibility, claim perks', uri: 'loyalteez://docs/perks' },
      ]
    },
    {
      category: 'Best Practices',
      items: [
        { name: 'Reward Amounts', desc: 'Low (10-50 LTZ): daily actions. Mid (50-200): quality contributions. High (200+): referrals, purchases', uri: 'loyalteez://docs/rewards' },
        { name: 'Abuse Prevention', desc: 'Cooldowns, daily caps, mod-gated events, minimum account age', uri: 'loyalteez://docs/abuse' },
        { name: 'Program Design', desc: 'Balance engagement vs quality, create progression, clear value proposition', uri: 'loyalteez://docs/design' },
      ]
    },
  ];

  const vibeExamples = [
    {
      prompt: "Create a loyalty program for my developer Discord with 10 events focused on quality contributions",
      platform: "discord",
      response: `// I'll design a quality-focused developer community program

const program = await loyalteez_design_program({
  brandId: process.env.BRAND_ID,
  context: {
    appType: "discord_community",
    goals: ["reward_quality", "encourage_helping", "build_expertise"],
    platforms: ["discord"],
    audience: "developers"
  }
});

// Creating 10 quality-focused events:

const events = await loyalteez_create_events_batch({
  brandId: process.env.BRAND_ID,
  platform: "discord",
  events: [
    // Daily Engagement (low barrier)
    { name: "Daily GM", eventType: "daily_gm", reward: 5, maxClaims: 1, cooldownHours: 24, 
      description: "First gm message each day" },
    
    // Quality Contributions (mod-gated)
    { name: "Helpful Answer", eventType: "helpful_answer", reward: 50, maxClaims: 100, cooldownHours: 1,
      description: "Recognized for helping another member" },
    { name: "Code Review", eventType: "code_review", reward: 75, maxClaims: 50, cooldownHours: 2,
      description: "Provided valuable code review feedback" },
    { name: "Bug Report", eventType: "bug_report", reward: 100, maxClaims: 25, cooldownHours: 0,
      description: "Submitted valid bug report with repro steps" },
    
    // Content Creation (high value)
    { name: "Tutorial Created", eventType: "tutorial_created", reward: 500, maxClaims: 10, cooldownHours: 168,
      description: "Created helpful tutorial or guide" },
    { name: "OSS Contribution", eventType: "oss_contribution", reward: 200, maxClaims: 20, cooldownHours: 24,
      description: "Contributed to project open source" },
    
    // Community Building
    { name: "AMA Participation", eventType: "ama_participation", reward: 50, maxClaims: 4, cooldownHours: 168,
      description: "Asked question during AMA" },
    { name: "Onboarding Helper", eventType: "onboarding_helper", reward: 100, maxClaims: 20, cooldownHours: 24,
      description: "Helped onboard a new member" },
    
    // Milestones
    { name: "First PR Merged", eventType: "first_pr_merged", reward: 300, maxClaims: 1, cooldownHours: 0,
      description: "First pull request merged to project" },
    { name: "30 Day Streak", eventType: "streak_30_milestone", reward: 500, maxClaims: 1, cooldownHours: 0,
      description: "Maintained 30-day activity streak" }
  ]
});

// Generated Discord bot commands:
// /daily - Daily check-in with streak
// /reward helpful_answer @user - Mod command
// /reward code_review @user - Mod command  
// /drop bug_report - Create claim button
// /leaderboard weekly - Show top contributors`
    },
    {
      prompt: "Set up Telegram rewards for my trading community - daily check-ins, signal reactions, and premium features",
      platform: "telegram",
      response: `// I'll create a trading community program for Telegram

const events = await loyalteez_create_events_batch({
  brandId: process.env.BRAND_ID,
  platform: "telegram",
  events: [
    // Daily Engagement
    { name: "Daily Check-in", eventType: "tg_daily_checkin", reward: 10, maxClaims: 1, cooldownHours: 24,
      description: "Daily /checkin command" },
    { name: "GM Streak", eventType: "tg_gm_streak", reward: 5, maxClaims: 1, cooldownHours: 24,
      description: "Posted GM in chat (streak tracked)" },
    
    // Signal Engagement
    { name: "Signal Reaction", eventType: "tg_signal_reaction", reward: 3, maxClaims: 20, cooldownHours: 0,
      description: "Reacted to trading signal post" },
    { name: "Trade Result Shared", eventType: "tg_trade_shared", reward: 25, maxClaims: 5, cooldownHours: 24,
      description: "Shared trade result with screenshot" },
    { name: "Analysis Post", eventType: "tg_analysis_post", reward: 100, maxClaims: 3, cooldownHours: 24,
      description: "Posted quality market analysis" },
    
    // Premium Actions
    { name: "Channel Boost", eventType: "tg_channel_boost", reward: 500, maxClaims: 1, cooldownHours: 0,
      description: "Boosted the Telegram channel" },
    { name: "Premium Gift", eventType: "tg_premium_gift", reward: 1000, maxClaims: 10, cooldownHours: 0,
      description: "Gifted Telegram Premium to member" },
    
    // Community
    { name: "Referral Joined", eventType: "tg_referral", reward: 200, maxClaims: 50, cooldownHours: 0,
      description: "Referred user who joined and verified" },
    { name: "Voice Chat Join", eventType: "tg_voice_join", reward: 30, maxClaims: 2, cooldownHours: 12,
      description: "Joined voice chat session" }
  ]
});

// Telegram bot implementation:
bot.command('checkin', async (ctx) => {
  const result = await loyalteez_streak_checkin({
    brandId: process.env.BRAND_ID,
    userId: \`telegram_\${ctx.from.id}\`,
    platform: "telegram"
  });
  
  await ctx.reply(
    \`✅ Check-in complete!\\n\` +
    \`🔥 Streak: \${result.streak.current} days (\${result.streak.multiplier}x)\\n\` +
    \`💰 Earned: \${result.reward.final} LTZ\`
  );
});

// Signal reaction tracking
bot.on('message_reaction', async (ctx) => {
  if (isSignalChannel(ctx.chat.id)) {
    await loyalteez_track_event({
      brandId: process.env.BRAND_ID,
      eventType: "tg_signal_reaction",
      userIdentifier: {
        platform: "telegram",
        platformUserId: ctx.from.id.toString()
      }
    });
  }
});`
    },
    {
      prompt: "I need 5 events for my Shopify store: purchases, reviews, referrals, social shares, and repeat customers",
      platform: "web",
      response: `// I'll create an e-commerce loyalty program for Shopify

const events = await loyalteez_create_events_batch({
  brandId: process.env.BRAND_ID,
  platform: "shopify",
  events: [
    // Purchase Events
    { 
      name: "First Purchase", 
      eventType: "shopify_first_purchase", 
      reward: 200, 
      maxClaims: 1, 
      cooldownHours: 0,
      description: "Customer's first order",
      detectionMethods: [{ method: "webhook", config: { trigger: "orders/create", condition: "first_order" }}]
    },
    { 
      name: "Repeat Purchase", 
      eventType: "shopify_repeat_purchase", 
      reward: 50, 
      maxClaims: 100, 
      cooldownHours: 0,
      description: "Returning customer order",
      metadata: { bonus_per_100_spent: 10 } // +10 LTZ per $100
    },
    
    // Engagement Events
    { 
      name: "Product Review", 
      eventType: "shopify_product_review", 
      reward: 75, 
      maxClaims: 20, 
      cooldownHours: 168, // Once per week
      description: "Left a product review",
      detectionMethods: [{ method: "webhook", config: { trigger: "review_submitted" }}]
    },
    { 
      name: "Social Share", 
      eventType: "shopify_social_share", 
      reward: 30, 
      maxClaims: 10, 
      cooldownHours: 24,
      description: "Shared product on social media",
      detectionMethods: [{ method: "css_selector", config: { selector: ".share-button-clicked" }}]
    },
    
    // Growth Events
    { 
      name: "Referral Purchase", 
      eventType: "shopify_referral_purchase", 
      reward: 500, 
      maxClaims: 50, 
      cooldownHours: 0,
      description: "Referred friend made a purchase",
      metadata: { referred_user_bonus: 100 } // New customer also gets 100 LTZ
    }
  ]
});

// Shopify webhook handler (Node.js)
app.post('/webhooks/shopify/order-created', async (req, res) => {
  const order = req.body;
  const customerEmail = order.customer.email;
  const isFirstOrder = order.customer.orders_count === 1;
  
  // Track purchase event
  await loyalteez_track_event({
    brandId: process.env.BRAND_ID,
    eventType: isFirstOrder ? "shopify_first_purchase" : "shopify_repeat_purchase",
    userIdentifier: { email: customerEmail },
    metadata: {
      order_id: order.id,
      total: order.total_price,
      items: order.line_items.length
    }
  });
  
  // Bonus LTZ based on order value
  const bonusLTZ = Math.floor(parseFloat(order.total_price) / 100) * 10;
  if (bonusLTZ > 0) {
    await loyalteez_track_event({
      brandId: process.env.BRAND_ID,
      eventType: "shopify_spend_bonus",
      userIdentifier: { email: customerEmail },
      metadata: { bonus_amount: bonusLTZ }
    });
  }
  
  res.status(200).send('OK');
});`
    },
    {
      prompt: "Make me a gaming rewards system with daily quests, achievements, tournament rewards, and guild contributions",
      platform: "gaming",
      response: `// I'll create a comprehensive gaming loyalty program

const events = await loyalteez_create_events_batch({
  brandId: process.env.BRAND_ID,
  platform: "gaming",
  events: [
    // Daily Engagement
    { name: "Daily Login", eventType: "game_daily_login", reward: 5, maxClaims: 1, cooldownHours: 24,
      description: "Logged into game today" },
    { name: "Daily Quest Complete", eventType: "game_daily_quest", reward: 20, maxClaims: 3, cooldownHours: 24,
      description: "Completed a daily quest" },
    { name: "Weekly Challenge", eventType: "game_weekly_challenge", reward: 100, maxClaims: 1, cooldownHours: 168,
      description: "Completed weekly challenge" },
    
    // Achievements
    { name: "Achievement Unlock", eventType: "game_achievement", reward: 50, maxClaims: 100, cooldownHours: 0,
      description: "Unlocked an achievement", metadata: { rare_multiplier: 3 } },
    { name: "Level Up", eventType: "game_level_up", reward: 10, maxClaims: 100, cooldownHours: 0,
      description: "Gained a level (10 LTZ per level)" },
    { name: "First Victory", eventType: "game_first_win", reward: 100, maxClaims: 1, cooldownHours: 0,
      description: "Won first match" },
    
    // Competitive
    { name: "Tournament Entry", eventType: "game_tournament_entry", reward: 25, maxClaims: 10, cooldownHours: 24,
      description: "Entered a tournament" },
    { name: "Tournament Top 10", eventType: "game_tournament_top10", reward: 200, maxClaims: 10, cooldownHours: 0,
      description: "Finished in top 10" },
    { name: "Tournament Win", eventType: "game_tournament_win", reward: 1000, maxClaims: 10, cooldownHours: 0,
      description: "Won a tournament" },
    
    // Social/Guild
    { name: "Guild Contribution", eventType: "game_guild_contribution", reward: 15, maxClaims: 5, cooldownHours: 24,
      description: "Contributed to guild goal" },
    { name: "Guild Quest Complete", eventType: "game_guild_quest", reward: 75, maxClaims: 3, cooldownHours: 24,
      description: "Completed guild quest" },
    { name: "Helped Teammate", eventType: "game_teammate_help", reward: 30, maxClaims: 10, cooldownHours: 24,
      description: "Assisted teammate in match" }
  ]
});

// Game server integration (example Unity C# webhook)
/*
public async Task TrackAchievement(string odingId, string achievementId, bool isRare) {
    var reward = isRare ? 150 : 50; // 3x for rare achievements
    
    await httpClient.PostAsync("https://api.loyalteez.app/loyalteez-api/manual-event", 
        new StringContent(JsonConvert.SerializeObject(new {
            brandId = BRAND_ID,
            eventType = "game_achievement",
            userEmail = odingId + "@loyalteez.app",
            metadata = new { achievement_id = achievementId, is_rare = isRare }
        })));
}
*/

// Node.js game server example
gameServer.on('achievement_unlocked', async (playerId, achievement) => {
  const multiplier = achievement.rarity === 'legendary' ? 5 : 
                     achievement.rarity === 'epic' ? 3 : 
                     achievement.rarity === 'rare' ? 2 : 1;
  
  await loyalteez_track_event({
    brandId: process.env.BRAND_ID,
    eventType: "game_achievement",
    userIdentifier: { 
      platform: "game",
      platformUserId: playerId 
    },
    metadata: {
      achievement_id: achievement.id,
      rarity: achievement.rarity,
      reward_multiplier: multiplier
    }
  });
});`
    }
  ];

  const colorClasses = {
    violet: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Wand2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Loyalteez MCP Server</h1>
              <p className="text-slate-400 text-sm">The AI-Native Loyalty Substrate</p>
            </div>
          </div>
          <p className="text-slate-300 max-w-3xl">
            Design entire loyalty programs through natural conversation. Events are <span className="text-violet-400 font-semibold">infinitely flexible</span> - 
            create any event for any platform, and the system just works.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/30 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* The Magic Tab */}
        {activeTab === 'magic' && (
          <div className="space-y-8">
            {/* Core Concept */}
            <div className="bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/30 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">The Magic: Events Are Anything</h2>
                  <p className="text-slate-300 text-lg">
                    Unlike traditional loyalty systems with fixed event types, Loyalteez treats events as <span className="text-violet-400 font-semibold">infinitely flexible strings</span>. 
                    Any action you can imagine becomes a rewardable event.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900/50 rounded-xl p-5">
                  <div className="text-3xl mb-3">1️⃣</div>
                  <h3 className="font-semibold text-lg mb-2">Define Any Event</h3>
                  <p className="text-slate-400 text-sm">
                    "helpful_discord_answer", "telegram_sticker_reaction", "played_mini_game_5min" - any string works
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-5">
                  <div className="text-3xl mb-3">2️⃣</div>
                  <h3 className="font-semibold text-lg mb-2">Configure Rewards</h3>
                  <p className="text-slate-400 text-sm">
                    Set reward amount, max claims, cooldowns. Store in Supabase via Partner Portal or API.
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-5">
                  <div className="text-3xl mb-3">3️⃣</div>
                  <h3 className="font-semibold text-lg mb-2">Fire & Reward</h3>
                  <p className="text-slate-400 text-sm">
                    Backend handles: fire event → check auth (brandId) → check eligibility → reward from balance
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-5 font-mono text-sm">
                <div className="text-slate-500 mb-3">// The flow is beautifully simple:</div>
                <div className="text-green-400">POST /loyalteez-api/manual-event</div>
                <div className="text-slate-300 mt-2">{'{'}</div>
                <div className="text-slate-300 ml-4">"brandId": "0x1234...abcd",</div>
                <div className="text-slate-300 ml-4">"eventType": <span className="text-amber-400">"literally_any_string_you_want"</span>,</div>
                <div className="text-slate-300 ml-4">"userEmail": "discord_123@loyalteez.app"</div>
                <div className="text-slate-300">{'}'}</div>
                <div className="text-slate-500 mt-3">// → Backend checks brandId auth</div>
                <div className="text-slate-500">// → Looks up event config in Supabase</div>
                <div className="text-slate-500">// → Validates eligibility (cooldowns, limits)</div>
                <div className="text-slate-500">// → Transfers LTZ from brand balance to user</div>
              </div>
            </div>

            {/* What This Enables */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">What This Enables for AI</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <PenTool className="w-5 h-5 text-violet-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Design Programs</div>
                    <div className="text-slate-400 text-sm">"Make me a loyalty program for my gaming Discord" → AI creates 15 custom events</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <Plus className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Create Events On-Demand</div>
                    <div className="text-slate-400 text-sm">"Add a bug report reward" → AI creates and configures the event</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <Code className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Generate Implementation</div>
                    <div className="text-slate-400 text-sm">Full bot code, webhook handlers, SDK integration - ready to deploy</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <Layers className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Cross-Platform</div>
                    <div className="text-slate-400 text-sm">Same user earns across Discord, Telegram, web - unified balance</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Access */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Open Access</h3>
                  <p className="text-slate-300">
                    Anyone with a valid <code className="text-green-400 bg-slate-800 px-2 py-0.5 rounded">brandId</code> (created in Partner Portal) can use this MCP freely. 
                    No API keys, no secrets in the MCP. The brandId is your public identifier - rewards come from your brand's LTZ balance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Program Designer Tab */}
        {activeTab === 'designer' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-violet-400" />
                AI-Powered Program Design
              </h2>
              <p className="text-slate-300 mb-6">
                Tell Claude what you're building and it will design a complete loyalty program with custom events, 
                implementation code, and best practices.
              </p>

              {/* Example Prompts */}
              <div className="space-y-4">
                <h3 className="text-sm text-slate-500 uppercase tracking-wide">Example prompts that just work:</h3>
                
                {[
                  { prompt: "Design a loyalty program for my developer Discord with events for quality contributions", platform: "Discord" },
                  { prompt: "Create 8 events for my Telegram trading community - engagement, signals, and premium", platform: "Telegram" },
                  { prompt: "Set up Shopify loyalty rewards for purchases, reviews, and referrals", platform: "Shopify" },
                  { prompt: "Make a gaming rewards system with daily quests, achievements, and tournaments", platform: "Gaming" },
                  { prompt: "Build a newsletter loyalty program - signups, opens, clicks, referrals", platform: "Web" },
                ].map((ex, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-violet-400 flex-shrink-0" />
                      <span className="text-slate-200">"{ex.prompt}"</span>
                    </div>
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-400">{ex.platform}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Event Templates */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold">Event Templates by Platform</h3>
                <div className="flex gap-2">
                  {Object.keys(eventExamples).map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlatform(p)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                        selectedPlatform === p
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="grid gap-3">
                  {eventExamples[selectedPlatform].map(event => (
                    <div key={event.id} className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-200">{event.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            event.category === 'quality' ? 'bg-green-500/20 text-green-400' :
                            event.category === 'engagement' ? 'bg-blue-500/20 text-blue-400' :
                            event.category === 'growth' ? 'bg-purple-500/20 text-purple-400' :
                            event.category === 'commerce' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-slate-700 text-slate-400'
                          }`}>
                            {event.category}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{event.desc}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-violet-400">{event.reward}</div>
                        <div className="text-xs text-slate-500">LTZ</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-slate-500 text-sm mt-4">
                  These are just templates. You can create <span className="text-violet-400">any event</span> you imagine.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            {Object.entries(tools).map(([categoryId, category]) => (
              <div key={categoryId} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className={`px-5 py-4 border-b border-slate-800 ${colorClasses[category.color]}`}>
                  <div className="flex items-center gap-3">
                    <category.icon className="w-5 h-5" />
                    <span className="font-semibold text-lg">{category.label}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{category.desc}</p>
                </div>
                <div className="divide-y divide-slate-800">
                  {category.items.map(tool => (
                    <div key={tool.id} className="p-4">
                      <button
                        onClick={() => toggleTool(tool.id)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          {expandedTools[tool.id] ? (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          )}
                          <code className="text-violet-400 font-mono text-sm">{tool.name}</code>
                          <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                            {tool.phase}
                          </span>
                        </div>
                      </button>
                      <p className="text-slate-400 text-sm mt-2 ml-7">{tool.desc}</p>
                      
                      {expandedTools[tool.id] && (
                        <div className="mt-4 ml-7 space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-500 uppercase tracking-wide">Parameters</span>
                              <button 
                                onClick={() => copyToClipboard(tool.params, `${tool.id}-params`)}
                                className="text-slate-500 hover:text-slate-300"
                              >
                                {copied === `${tool.id}-params` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <pre className="bg-slate-950 p-4 rounded-lg text-xs overflow-x-auto text-slate-300 leading-relaxed">
                              {tool.params}
                            </pre>
                          </div>
                          
                          <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Returns</div>
                            <pre className="bg-slate-950 p-4 rounded-lg text-xs overflow-x-auto text-slate-300 leading-relaxed">
                              {tool.returns}
                            </pre>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-500 uppercase tracking-wide">Example</span>
                              <button 
                                onClick={() => copyToClipboard(tool.example, `${tool.id}-example`)}
                                className="text-slate-500 hover:text-slate-300"
                              >
                                {copied === `${tool.id}-example` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <pre className="bg-slate-950 p-4 rounded-lg text-xs overflow-x-auto text-green-300 leading-relaxed">
                              {tool.example}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Event System Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                The Event System
              </h2>
              <p className="text-slate-300">
                Events are the core primitive. Any string can be an event. The system is designed for infinite flexibility.
              </p>
            </div>

            {/* Event Anatomy */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Anatomy of an Event</h3>
              <pre className="bg-slate-950 p-5 rounded-lg text-sm overflow-x-auto">
                <code className="text-slate-300">{`interface LoyalteezEvent {
  // Identity
  id: string;                    // "custom_{brandId}_{timestamp}" or any unique string
  eventType: string;             // "helpful_answer", "daily_gm", ANYTHING
  name: string;                  // Human-readable: "Helpful Answer"
  description: string;           // "Recognized for helping another member"
  
  // Rewards
  defaultReward: number;         // LTZ amount (e.g., 50)
  
  // Limits
  maxClaimsPerUser: number;      // 1 = one-time, 100 = repeatable
  cooldownHours: number;         // 0 = no cooldown, 24 = daily
  maxTotalClaims?: number;       // Optional total supply
  
  // Detection (how to trigger)
  detectionMethods: [{
    method: "webhook" | "discord_interaction" | "url_pattern" | 
            "form_submission" | "css_selector",
    config: object
  }];
  
  // Metadata
  brandId: string;               // Owner brand
  category: string;              // For organization
  isCustom: boolean;             // true for user-created
  createdAt: string;
}`}</code>
              </pre>
            </div>

            {/* Detection Methods */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Detection Methods</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { method: 'webhook', icon: '🔗', desc: 'POST from your backend or third-party service', example: 'Order completed, API call, Zapier' },
                  { method: 'discord_interaction', icon: '🤖', desc: 'Discord slash commands or bot interactions', example: '/drop, /reward, /daily' },
                  { method: 'url_pattern', icon: '🌐', desc: 'User visits specific URL patterns', example: '/thank-you, /success, /download-complete' },
                  { method: 'form_submission', icon: '📝', desc: 'Form submitted with email capture', example: '#contact-form, .newsletter-signup' },
                  { method: 'css_selector', icon: '🎯', desc: 'Element clicked or becomes visible', example: '.download-button, #signup-complete' },
                ].map(method => (
                  <div key={method.method} className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{method.icon}</span>
                      <code className="text-amber-400 font-mono text-sm">{method.method}</code>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{method.desc}</p>
                    <p className="text-slate-500 text-xs">Examples: {method.example}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* The Flow */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4">The Event Flow</h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                {[
                  { step: '1', label: 'Fire Event', desc: 'POST /manual-event with brandId, eventType, userEmail' },
                  { step: '2', label: 'Check Auth', desc: 'Validate brandId exists and has balance' },
                  { step: '3', label: 'Check Eligibility', desc: 'Cooldowns, max claims, event enabled' },
                  { step: '4', label: 'Transfer Reward', desc: 'Move LTZ from brand to user wallet' },
                ].map((item, i) => (
                  <React.Fragment key={item.step}>
                    <div className="flex-1 p-4 bg-slate-800/50 rounded-lg">
                      <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-violet-400 font-bold">
                        {item.step}
                      </div>
                      <div className="font-medium text-slate-200">{item.label}</div>
                      <div className="text-slate-500 text-xs mt-1">{item.desc}</div>
                    </div>
                    {i < 3 && <div className="text-slate-600 text-2xl hidden md:block">→</div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                MCP Knowledge Base
              </h2>
              <p className="text-slate-400">
                All Loyalteez documentation converted to MCP resources. AI has full context to design and implement programs.
              </p>
            </div>

            {knowledgeBase.map(section => (
              <div key={section.category} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/50">
                  <h3 className="font-semibold">{section.category}</h3>
                </div>
                <div className="divide-y divide-slate-800">
                  {section.items.map(item => (
                    <div key={item.uri} className="p-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium text-slate-200">{item.name}</div>
                        <div className="text-slate-400 text-sm">{item.desc}</div>
                      </div>
                      <code className="text-cyan-400 text-xs bg-slate-800 px-2 py-1 rounded flex-shrink-0">
                        {item.uri}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vibe Examples Tab */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Vibe Coding in Action
              </h2>
              <p className="text-slate-300">
                Real examples of what happens when you ask Claude to build loyalty programs. 
                Full implementation code generated from natural language.
              </p>
            </div>

            {vibeExamples.map((example, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800 bg-slate-800/30">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-violet-400" />
                    <span className="text-slate-400">Developer:</span>
                  </div>
                  <p className="text-slate-200 text-lg italic">"{example.prompt}"</p>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-slate-400">Claude generates:</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(example.response, `example-${i}`)}
                      className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-sm"
                    >
                      {copied === `example-${i}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      Copy
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-lg text-xs overflow-x-auto text-green-300 leading-relaxed max-h-96 overflow-y-auto">
                    {example.response}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wand2 className="w-5 h-5 text-violet-400" />
            <span className="font-semibold">@loyalteez/mcp-server</span>
          </div>
          <p className="text-slate-500 text-sm">
            The AI-Native Loyalty Substrate • Events are infinite • Built for the vibe coding era
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoyalteezMCP;
