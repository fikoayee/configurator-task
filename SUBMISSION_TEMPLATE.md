# Submission: Filip Dziubek

## Time Spent

Total time: **4.5 hours** (approximate)

## Ticket Triage

### Tickets I Addressed

List the ticket numbers you worked on, in the order you addressed them:

1.  **CFG-142**: Fixed the price hook. It compared a timestamp with a request counter, so it never saved the price. Now it ignores responses for old options, and the loading state can't be turned off by an old request.
2.  **CFG-148**: Fixed the crash when turning off "Include Packaging". Add-ons that depend on an option are now removed when that option changes, for every option type. Before committing I ran `pnpm lint`: the component had 4 existing lint errors that the pre-commit hook would block, so the same commit also fixes them.
3.  **CFG-145**: Added Ctrl+Enter (Cmd+Enter on Mac) for Quick Add, with a hint on the button. It doesn't run while typing in a text field, when a modal is open, or while the price is loading.
4.  **CFG-152**: Made the color swatches and the Drafts / Share modals usable with the keyboard. The swatches have one tab stop and arrow keys move between colors. Swatches show a focus outline. Focus moves into a modal when it opens, so Escape closes it, and focus goes back to the button that opened it.
5.  **CFG-149**: Covered by CFG-142, no extra changes. The loading state (dimmed price, "Calculating..." on "Add to Cart") already existed, the price bug was hiding it.

### Tickets I Deprioritized

List tickets you intentionally skipped and why:

| Ticket  | Reason                                                                                                                                                                                                                                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CFG-143 | Only appears after 15-20 minutes of use, so it's unlikely to show up in a short demo. It's also hard to reproduce. Worth looking at after the demo, starting with Marcus's note about the resize handler in `CONTEXT.md`.                                                                                     |
| CFG-144 | On hold. The newer CFG-145 says TechStyle needs Quick Add for the demo, so removing it now would hurt the demo. See "Stopped to Ask".                                                                                                                                                                         |
| CFG-146 | Skipped for now. In my time zone the "Last saved" time is correct, and the demo runs on our side, so it won't show up there. The fix is probably small (time zones when the time is saved or shown), but I'd need QA's steps to reproduce it first.                                                           |
| CFG-147 | I reproduced it: sharing works with normal names, but a name with Polish characters crashes the page, and some links open the default configuration. It doesn't show up in a normal demo flow, and during the demo we can simply avoid special characters in configuration names, so the client won't see it. |
| CFG-150 | Cosmetic and only on mobile, and the demo will most likely run on a laptop. CFG-143 also mentions resize handling, so both may be worth looking at together.                                                                                                                                                  |
| CFG-151 | Error messages only show up when something fails, and a normal demo flow doesn't hit them. I fixed the one technical text that is always visible (see "Other Changes Made").                                                                                                                                  |
| CFG-153 | New feature estimated at 2-3 weeks, so it doesn't fit in 4 hours. It also needs a design and more details from Product before anyone can start on it.                                                                                                                                                         |
| CFG-154 | Not changed. It's a pricing decision (does the discount start at 50 or 51, is it 10% or 15%), so it needs PM and Finance, not a code change. See "Stopped to Ask".                                                                                                                                            |
| CFG-155 | Nice to have, not a demo blocker. The colors are hard-coded in many places, so dark mode means moving them to CSS variables first. It would also be good to get a light and a dark color palette from a designer.                                                                                             |
| CFG-156 | Only console warnings, not visible to users. A small fix for after the demo.                                                                                                                                                                                                                                  |
| CFG-157 | Browsers only allow their own "Leave page?" dialog, so "Save & Close" and "Discard" buttons aren't possible when the user leaves the page, and nobody closes the tab during a demo. See "Questions for the Team" about autosave.                                                                              |
| CFG-158 | Important because of the slow demo machine, but there is no reported lag, only Marcus's profiler run, and the app didn't feel slow when I tested it. Before the demo I'd check it on the demo machine with the React Profiler, and only then change things.                                                   |

### Tickets That Need Clarification

List any tickets where you couldn't proceed due to ambiguity:

| Ticket  | Question                                                                                                                                                                                                    |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CFG-144 | It conflicts with the newer CFG-145. Does the Quick Add removal still stand now that TechStyle wants Quick Add with a shortcut for the demo? Should it be removed after the demo, or kept for some clients? |
| CFG-152 | The audit says custom dropdowns can't be used with arrow keys, but all dropdowns here are native `<select>` elements and arrow keys already work. Which dropdown did the audit mean?                        |

### Tickets With a Misleading Priority Label

Our board labels aren't always right. List tickets where you disagreed with the label (e.g. a Low that's actually High, a High that's actually Low, a Medium that's actually Unclear) and explain why. If you didn't disagree with any, say so.

| Ticket  | Label on board | Your read   | Why                                                                                                                                                                                                                                                                                      |
| ------- | -------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CFG-144 | 🟠 High        | ⏸️ On hold  | Conflicts with the newer CFG-145. Doing it before the demo would hurt the demo.                                                                                                                                                                                                          |
| CFG-145 | 🟠 High        | 🔴 Critical | TechStyle's PM said it's mandatory for the demo, which matches the board's own definition of 🔴 ("Blocks the demo").                                                                                                                                                                     |
| CFG-152 | ⚪ Low         | 🟠 High     | The ticket says the label was set before Legal found accessibility clauses in TechStyle's contract. It becomes a contract problem when we ship the widget to the client, but accessibility is one of the things TechStyle cares about most, so it's good to show it working in the demo. |

### Tickets Where You Stopped to Ask Instead of Implementing

If a ticket was ambiguous enough that the right move was to escalate / ask PM / gather more context rather than ship a fix, list it here. We value this signal — picking one interpretation blindly and shipping it can cost more than stopping to ask.

| Ticket  | Who would you ask              | What you'd ask                                                                                                                                                                                                                                                                                                                        |
| ------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CFG-144 | Product (Sarah), cc CS (Jamie) | CFG-144 and CFG-145 conflict: one says remove Quick Add, the newer one says TechStyle needs it with a shortcut for the demo. I'd check with Sarah if the removal still stands. Until then Quick Add stays and gets the shortcut.                                                                                                      |
| CFG-154 | PM (Sarah) + Finance           | Does the top discount start at 50 (`>=`) or 51 (`>`)? Is it 10% (`CONTEXT.md`) or 15% (public docs)? The sources disagree, there's no spec, and both options cost money if they're wrong. Pricing is calculated on the server, so changing the frontend alone wouldn't fix it. The public docs also need to match whatever we decide. |

---

## Technical Write-Up

### Critical Issues Found

Describe the most important bugs you identified:

#### Issue 1: Price never updates (stuck at $0.00)

**Ticket(s):** CFG-142

**What was the bug?**

The hook compared `Date.now()` with `response.timestamp`, but the API puts a request counter there (1, 2, 3...), not a time. The check was never true, so the price was never saved. Also, `finally` always turned off `isLoading`, so an old request could turn off the loading state of a newer one.

**How did you find it?**

1.  First I reproduced it: I changed a few options and the total stayed at $0.00.
2.  The ticket says the requests return real prices, so the API was fine. The problem had to be in the hook, in the part that decides if a response is used.
3.  In the hook, the latest request was saved as `Date.now()`. In `api.ts`, `calculatePrice` returns `timestamp: requestId`, which is a counter. So the hook compared something like `3` with something like `176...123`, and the check was never true.

**How did you fix it?**

- A response is ignored if the options changed before it came back.
- The loading state comes from comparing the last result with the current options, so an old request can't turn it off.
- Removed `useDebouncedPriceCalculation`. It wasn't used and had the same bug.

**Why this approach?**

- **A flag instead of a request id.** Before changing the hook I ran `pnpm lint` and saw that the file already had `set-state-in-effect` errors, which the pre-commit hook would block. So instead of only replacing the timestamp with a request counter, I fixed it in the effect cleanup: each price request has its own `ignoreResponse` flag, and when the options change React sets the flag of the previous request to `true`, so its late response is skipped.
- **Loading state calculated, not stored.** Before, `isLoading` had to be turned on and off by hand, and an old request could turn it off too early. Now it comes from comparing the last result with the current options, so it can't get out of sync.
- **Debouncing was not enough.** It would send fewer requests, but responses could still come back in the wrong order.
- **`config` is not in the effect dependencies on purpose.** It also changes when the user types a draft name, so every letter would send a price request.

---

#### Issue 2: Crash when turning off "Include Packaging"

**Ticket(s):** CFG-148

**What was the bug?**

When an option changed, add-ons that depend on it were removed only for dropdown (`select`) options. "Include Packaging" is a toggle, so Gift Wrap stayed selected after packaging was turned off. The summary then looked up Gift Wrap among the available add-ons, got `undefined`, and `undefined.price` crashed the whole widget.

**How did you find it?**

1.  I reproduced it with the steps from the ticket. The "Premium Material" step is not needed, the crash happens with packaging and Gift Wrap only.
2.  The error said `reading 'price'`, so I searched for `.price` in the component and found `availableAddOns.get(id)!` in the summary.
3.  Then I checked why Gift Wrap was still selected and found the `option.type === 'select'` check in `handleOptionChange`. Its comment said toggles are handled somewhere else, but they are not.

**How did you fix it?**

- Dependent add-ons are removed for every option type.
- The state is updated with `setSelectedAddOns((prev) => prev.filter(...))` instead of `splice` on the current array.

**Why this approach?**

- It fixes the cause: Gift Wrap can't stay selected without packaging, so the summary never gets an add-on that is not available.
- The old code changed the state array directly with `splice` and then set the same array again. Now a new array is created with `filter`, and the old state is not changed.
- Before committing I ran `pnpm lint`. The file had existing lint errors that the pre-commit hook would block, so I fixed them in the same commit.

---

#### Issue 3: Quick Add could add an item with the old price

**Ticket(s):** CFG-145

**What was the bug?**

"Add to Cart" was disabled while the price was loading, but the Quick Add button only checked read-only mode and validation. If the user changed the quantity (for example from 1 to 50) and clicked Quick Add before the new price came back, the cart got the new configuration (50 items) with the old price (for 1 item).

**How did you find it?**

1.  I noticed it while working on the Quick Add button for the shortcut: it didn't have the same check as "Add to Cart".
2.  "Add to Cart" has `isPriceLoading` in `disabled` check, Quick Add didn't. `handleQuickAdd` also had no checks of its own, it relied on the button being disabled.
3.  To check it I changed the quantity and clicked Quick Add right away. The alert showed the total for the old quantity.

**How did you fix it?**

- Added one `canQuickAdd` check: not read-only, the configuration is valid, the price is not loading, and there is a price.
- The button uses it for `disabled`, and `handleQuickAdd` checks it too.

**Why this approach?**

- The shortcut doesn't go through the button, so the check has to be in the handler, not only on the button.
- With one place for the rules, the button and the shortcut can't get out of sync.

---

### Other Changes Made

Brief description of any other modifications:

- Fixed the existing lint errors in `ProductConfigurator.tsx`, because the pre-commit hook would block every change to this file. Side effect: "Discard" now shows only after the user changes something, not right after the page opens.
- Unavailable add-ons showed the internal option id, e.g. "(Requires include_packaging)". Now they show a readable name: "(Requires: Include Premium Packaging)" or "(Requires: Aluminum material)". This text is visible in every demo, so it's a small fix just for the demo. Later, all text shown to users (dependency notes, validation and error messages) should be checked properly as part of CFG-151.

---

## Code Quality Notes

### Things I Noticed But Didn't Fix

List any issues you noticed but intentionally left:

| Issue                                                                                                                                                                                                                                           | Why I Left It                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| "✓ Configuration validated" is always shown after the first check, even when the configuration is invalid (`setIsValid(true)` after every response).                                                                                            | Not visible in a normal demo. Needs a decision on what to show for an invalid configuration.                       |
| Header buttons ("Drafts", "Share", "Discard") are cut off on narrow screens, because the header doesn't wrap.                                                                                                                                   | Mobile only, same area as CFG-150.                                                                                 |
| One laptop color is called "Custom #3", so the user doesn't know what color it is.                                                                                                                                                              | A small change in the product data, but the name should be decided by Product (see "Questions for the Team").      |
| The Drafts modal scrolls as a whole, so with many drafts the "Save Draft" button goes out of view.                                                                                                                                              | UI polish, see "Potential Improvements".                                                                           |
| Only the last 10 drafts are kept, the oldest one is removed without a warning.                                                                                                                                                                  | Needs a decision, see "Questions for the Team".                                                                    |
| Many values are passed around as plain strings (error codes, option and modal types, the drafts localStorage key) instead of shared constants like `ERROR_CODES.PRICE_CALC_FAILED`. `ERROR_CODES` already exists, but it isn't used everywhere. | A cleanup for later, not needed for the demo. Shared constants would make typos easier to catch and renames safer. |

### Potential Improvements for the Future

If you had more time, what would you improve?

1.  **Full accessibility check (follow-up to CFG-152):** For the demo I fixed the items from QA's audit, because it was a quick win and accessibility (WCAG 2.1 AA) matters to TechStyle. After the demo the widget needs a full check: keeping focus inside open modals, announcing price updates to screen readers (`aria-busy` / `aria-live` on the price), testing with a screen reader, color contrast, and automated checks (e.g. axe) in CI.
2.  **Error handling (follow-up to CFG-151):** readable messages instead of technical codes, a clear next step for the user (for example, try again), and the technical details kept only for support.
3.  **Toast for confirmations:** "Draft saved" now shows at the bottom of the page where it's easy to miss. A small toast would be easier to notice.
4.  **Drafts modal:** only the list of drafts should scroll. The modal header and the "Save Current Configuration" part at the bottom should always stay visible.
5.  **A friendly error screen:** if something breaks, show "Oops, something went wrong" with a button back to the configurator, instead of a blank page (a React error boundary). It would also cover old or broken share links and drafts, for example a saved draft with Gift Wrap but without packaging.
6.  **Tests and CI:** add unit tests (e.g. Vitest + React Testing Library) for the price hook, the add-on rules and the share link encoding, since these are the areas where the bugs were. Then run lint, type check, build and tests in GitHub Actions on every PR. Today only the local pre-commit hook checks lint, and it can be skipped.

---

## Questions for the Team

Questions you would ask in a real scenario:

1.  **Drafts and unsaved changes (UX):**
    - Should "Discard" be hidden until something changes (now), or always visible but disabled?
    - Should "Discard" and deleting a draft ask for confirmation first?
    - Instead of the browser's "Leave page?" dialog, should we autosave the current configuration in localStorage after every change (separate from drafts, so it doesn't use the 10-draft limit) and restore it automatically next time? Saving only when the user leaves is not reliable, especially on phones.
    - Only the last 10 drafts are kept, and the oldest one is removed without a warning, so the user can lose something important. Is 10 enough, and should we warn the user before the oldest draft is removed?
2.  **Quick Add shortcut (CFG-145):**
    - Where should the hint be shown: on the button, in a tooltip, or under the button?
    - Should the shortcut work on the whole page, or only inside the widget?
3.  **Prices for more than one item (Design / PM / Finance):**
    - The breakdown shows prices for one item, and the "Quantity (2×)" line often shows the same amount as the total. Could design suggest a clearer way, for example "price per laptop × quantity = total"?
    - Every add-on is multiplied by the quantity, so Express Shipping for 3 laptops costs 3 × $24.99. Should some add-ons, like shipping, be charged once per order?
4.  **"Custom #3" color (Product):** what should this color be called?

---

## Assumptions Made

List any assumptions you made to proceed:

1.  The demo is a short, scripted walkthrough on a laptop, not a long session or a phone.
2.  The newest explicit requirement from the client (CFG-145) wins over an older internal decision (CFG-144) for this sprint.

---

## Self-Assessment

### What went well?

- I focused on what would break the demo first: the price, the crash and the Quick Add shortcut, then keyboard navigation.
- I found the root causes instead of patching symptoms, for example the timestamp compared with a request counter in CFG-142.
- When `pnpm lint` showed existing errors that the pre-commit hook would block, I fixed them instead of hiding them with `eslint-disable`.
- While working on the tickets I found related bugs, like Quick Add using the old price, and fixed them in the same area.

### What was challenging?

- Choosing what to do now and what to leave for later in such a short time. Some tickets were critical (CFG-147) but didn't show up in a normal demo flow, so I had to choose between them and things the client would see.
- Estimating how long each ticket would take in a codebase I didn't know yet. In a short time box, a wrong estimate costs a lot.
- Existing lint errors in files I had to change. They weren't part of any ticket, but they had to be fixed first.

### What would you do differently with more time?

- Fix CFG-147 (share link) and add a friendly error screen, so a broken link never shows a blank page.
- Look at performance: the slowdown from CFG-143 and a check on the demo machine with the React Profiler (CFG-158).
- Fix the layout issues on mobile (the color swatches from CFG-150 and the header buttons cut off on narrow screens), so the demo could also show the mobile version.
- Add tests for the price hook and the add-on rules, so these bugs don't come back.

---

## AI Assistance Notes (optional)

If you used AI tools (Copilot, Claude, Cursor, ChatGPT, etc.), we'd love a short note on how. **We don't score the fact that you used AI — we score the quality of your reasoning and verification.**

I used Claude (Claude Code) as an assistant:

- **Getting to know the project:** a quick walkthrough of the codebase (where the price is calculated, how add-on dependencies work, what each file does), even though the README covers the basics.
- **Ticket summaries:** short summaries of each ticket and its possible cause, which I used when deciding the priorities.
- **Code:** helping me find potential issues, suggest solutions, and refactor code before each commit to keep it clean.
- **Documentation:** help with commit messages, short PR descriptions and docs.

---

## Additional Notes

Anything else you want us to know:

In ~4 hours it was hard to do a lot and still have time to look for other problems in the code. The extra issues I listed (in "Other Changes Made", "Things I Noticed" and "Questions for the Team") came from clicking through the app while working on other tickets, not from a full review. With more time I'm sure I could find more bugs and improvements.
