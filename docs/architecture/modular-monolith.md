# Modular Monolith Structure

This repository is organized as a modular monolith.

## Backend modules
- auth
- inventory
- sales
- purchases
- integrations
- settings
- reports
- shared

## Frontend modules
- auth
- inventory
- sales
- purchases
- integrations
- settings
- reports
- shared

## Module rules
- Keep module boundaries strict.
- Put business logic inside the owning module.
- Share only cross-cutting utilities in shared.
- Avoid importing feature internals from other modules.
- Expose only contracts across module boundaries.
