# Authority v7

**See what your AI agents are actually doing.**

Authority v7 is a local-first, open-source control plane for AI agents.  
It shows which agents are running, which tasks are consuming spend, where retry loops are happening, and which runs look suspicious across OpenAI and Anthropic.

---

## Live demo

👉 https://authority.bhaviavelayudhan.com/v7

---

## What you get

- Spend by agent  
- Spend by model  
- Live event feed  
- Suspicious run detection  
- Retry loop detection  
- Persistent local execution history  

---

## Why this exists

Agents don’t fail loudly.  
They retry silently, loop quietly, and burn money invisibly.

Authority v7 makes that behavior visible immediately.

---

## Quick start

```bash
pnpm install
pnpm --filter @authority/api dev
pnpm --filter @authority/web dev

Open the dashboard locally after starting both services.
Instrument OpenAI
TypeScript
import OpenAI from "openai";
import { init, instrumentOpenAI } from "@authority/sdk";

init({ apiKey: "auth_dev_local" });

const client = instrumentOpenAI(
  new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
  {
    agent: "support-triage",
    task: "refund-check"
  }
);
Instrument Anthropic
TypeScript
import Anthropic from "@anthropic-ai/sdk";
import { init, instrumentAnthropic } from "@authority/sdk";

init({ apiKey: "auth_dev_local" });

const client = instrumentAnthropic(
  new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
  {
    agent: "code-review",
    task: "patch-analysis"
  }
);
What shows up in the dashboard
total spend
request volume
agents and tasks
spend breakdowns
recent executions
suspicious runs
retry loops
Storage
Authority v7 is local-first.
Uses SQLite by default
Logs persist across restarts
No external infra required
Public demo deployments may use in-memory storage for simplicity.
Architecture (simple)

SDK → API → Storage → Dashboard
SDK instruments model calls
API receives and processes events
Storage persists execution data
Dashboard visualizes behavior
Status
Alpha
Local-first
Open source
Repo structure

apps/
  api/
  web/
packages/
Contributing
keep changes small
avoid breaking structure
open issues before large changes
License
MIT
