## 🚀 Release v1.1.0 - Enhanced Endpoint Coverage & Stability

This release completes endpoint coverage and improves stability with comprehensive fallback strategies.

### ✨ What's New

#### Enhanced Endpoint Coverage
- **getUserBalance**: Now includes blockchain query guidance when API endpoint unavailable
  - Provides LTZ token contract address and network details
  - Instructions for direct `balanceOf()` queries on Soneium Mainnet
- **checkEligibility**: Composite fallback using event configuration
  - Automatically fetches event config to provide partial eligibility info
  - Guidance for manual eligibility determination
- **getUserStats**: Composite aggregation from individual services
  - Falls back to individual service calls (streaks, leaderboards) when aggregation endpoint unavailable
  - Provides partial stats with guidance for complete data retrieval

#### Test Suite Improvements
- **136 tests passing** (up from 109 in v1.0.0)
- Fixed webhook validation tests
- Fixed code generation tests
- All test assertions now properly handle optional `isError` field

#### Bug Fixes
- Fixed webhook signature validation to handle empty/invalid signatures gracefully
- Fixed TypeScript errors in diagnostics, program-design, and webhooks handlers
- Fixed `brandId` parameter passing in code generation functions
- Improved error handling in composite endpoint fallbacks

### 📊 Metrics

- **Tools**: 30 (no change, all covered)
- **Resources**: 11 (no change)
- **API Coverage**: ~98% (improved from ~96%)
  - 3 endpoints now have robust fallback strategies
- **Test Coverage**: 136 tests, all passing ✅

### 🔧 Technical Improvements

#### Endpoint Fallback Strategies
All three "needs verification" endpoints now provide helpful fallback guidance:
- Clear error messages explaining when endpoints are unavailable
- Step-by-step instructions for alternative approaches
- References to relevant documentation resources

#### Code Quality
- Enhanced error handling in composite operations
- Better TypeScript type safety
- Improved validation logic for webhook signatures

### 📦 Installation

```bash
npm install -g @alpha4-labs/mcp-server
# or for specific version:
npm install -g @alpha4-labs/mcp-server@1.1.0
```

### 🔗 Links

- [npm Package](https://www.npmjs.com/package/@alpha4-labs/mcp-server)
- [Documentation](https://docs.loyalteez.app/integrations/mcp)
- [GitHub Repository](https://github.com/Alpha4-Labs/loyalteez-mcp)

### 🧪 Testing

All 136 tests passing, including:
- Brand ID validation (8 tests)
- API client methods (28 tests)
- Resource loading (15 tests)
- Tool handlers (26 tests)
- Webhook tools (10 tests)
- Code generation (7 tests)
- Integration tests (7 tests)
- SDK resources (10 tests)
- Validation utilities (13 tests)
- Tool registration (12 tests)

### 📝 Migration Notes

**No breaking changes** - This is a minor version bump with improvements and fixes.

If you're using any of the three endpoints with fallback strategies (`getUserBalance`, `checkEligibility`, `getUserStats`), you may see more informative error messages when endpoints are unavailable. The functionality remains the same, but error messages now include helpful guidance.

### 🙏 Thanks

Thank you for using Loyalteez MCP Server! Your feedback helps us improve.

---

**Full Changelog**: See [GitHub Releases](https://github.com/Alpha4-Labs/loyalteez-mcp/releases) for detailed commit history.
