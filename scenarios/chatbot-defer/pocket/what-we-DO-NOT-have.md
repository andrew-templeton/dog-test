# Open Data Gaps Before Chatbot Scoping

**Author:** Jamie Okafor, Director of Support
**Date:** 2026-05-12
**Status:** Internal working note, shared with VPCX and Lin Saito

Before we commit to Helprite or any other chatbot vendor, here's an honest list of what we'd need to actually estimate impact. I'm flagging this now because the conversation has been moving toward signing and I don't think we can defend the spend with what we currently know.

## What we have NOT measured or do NOT have

- We have **not** categorized our inbound tickets by topic in the last 18 months. The Zendesk tags exist but they're free-form and the senior agents stopped enforcing the taxonomy in late 2024. Any "X% of tickets are about Y" claim from us right now is a guess.
- We have **not** segmented tickets by "could be answered from KB" vs "requires human escalation vs requires engineering escalation." This is the core variable for deflection economics and we don't have it.
- We have **not** measured time-to-resolution by ticket category, only the aggregate (median 4h first response, median 26h full resolution). Without category-level data we can't say which categories the bot would help with.
- We do **not** have an agreed dollar-per-deflected-ticket estimate. The finance team has loaded support-agent cost but we've never converted that to a per-ticket marginal cost we'd be willing to defend.
- Our knowledge base has ~340 articles. The last comprehensive audit and update was 2024-Q3. A non-trivial fraction is stale, and the chatbot's deflection rate is upper-bounded by KB coverage and KB freshness.
- We do **not** have a baseline measurement of self-service success on our existing help center (search-to-resolution rate). The Zendesk Guide reporting is on but no one has looked at it in over a year.

## Recommendation

We should probably do at least the first two before signing the Helprite contract. A 4-to-6-week internal data exercise - tagging a sample of recent tickets and labeling them as KB-answerable vs not - would let us bracket the deflection ceiling for our specific ticket mix, not Helprite's "comparable customers." Otherwise we are buying a 42% number that may or may not apply to us.

I'm not opposed to the chatbot. I'm opposed to the order of operations.
