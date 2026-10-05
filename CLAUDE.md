# Meridian — project instructions

## Interaction pattern reference implementations
Every Interaction Pattern in this design system demonstrates its contract with a **manufacturing ERP** scenario — work order release, nonconformance disposition, purchase requisition, routing or BOM change, goods receipt, maintenance work request, shift capacity planning.

- Reference implementations under `templates/<slug>/` use plant-real nouns, quantities, units, roles (planner, inspector, quality manager, line supervisor) and failure modes (MES does not answer, part not in the item master, material short).
- Do/don't pairs and message examples inside the specification use the same scenario as that pattern's reference implementation, so spec and demo read as one thing.
- Scenarios are not reused across patterns: each pattern gets an ERP problem that actually needs that pattern.
- The rule is recorded in the <a href="guidelines/interaction-pattern-spec-standard.card.html">interaction pattern spec standard</a>, artifact 2. Keep it there when the standard changes.

Layout Templates follow the same rule under the <a href="guidelines/layout-template-spec-standard.card.html">layout template spec standard</a>: regions filled with plant-real content at realistic volume, same plant, same names.

## The plant is Indian — one fixed setting for every pattern
All patterns, existing and future, are set in the same fictional Indian manufacturer, so a reader moving between patterns recognises the plant:

- **Company and site:** Suryodaya Autocomp Ltd — Chakan plant (PL-04), Pune. Email domain `@suryodaya.co.in`.
- **Currency:** rupees, `₹`, formatted `en-IN` so grouping is lakh-style (`₹2,50,000`). Never `$`, `£` or `€`. Approval and spend thresholds in lakh-scale figures (`₹2,00,000`), not four-figure ones.
- **Time:** IST (Asia/Kolkata); say "(IST)" wherever a date or shift is stated. Dates stay ISO `YYYY-MM-DD`. Shifts A / B / C.
- **Phone:** `+91 98230 41185` shape, with country code.
- **People:** Indian names in plant roles — planner Anjali Deshmukh, quality manager Meera Nair, press-shop head Shalini Rao, maintenance head Vikram Bhosale, tool room Priya Iyer, line supervisor Sandeep Kulkarni. Add new names in the same register.
- **Suppliers and vendors:** Indian firms — Nashik Forge &amp; Machine Works, Sahyadri Bearings Pvt Ltd, Deccan Machine Supply.
- **Neutral throughout:** part numbers (`BRK-4820-A`), lot, NC, work-order and requisition references, cost-centre codes.

Reuse these names rather than inventing a parallel plant; introduce new ones only for a role the list does not cover.
