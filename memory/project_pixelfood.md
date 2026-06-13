---
name: project-pixelfood
description: PixelFood frontend project context — tech stack, architecture, and completed work
metadata:
  type: project
---

PixelFood is a Singapore food delivery SPA (similar to Grab Food). Full order flow: address search → restaurant browse → cart → Stripe checkout → order tracking.

**Stack:** React 18 + Vite 5 + TypeScript, React Router v6, React Query v3, Redux Toolkit + redux-persist, Auth0, Shadcn/UI + Tailwind, Mapbox GL + react-map-gl v7, Stripe (server-side session), React Hook Form + Zod, Sonner toasts, Docker.

**Why:** Ongoing feature development and code quality improvements.

**How to apply:** When suggesting changes, keep Singapore-specific assumptions (phone regex, hardcoded city) in mind. Stripe checkout redirects to `data.url` — backend creates the session.

## Bugs fixed (session 2026-06-12)

1. `generateuuid` — replaced `Math.random` loop with `crypto.randomUUID()`
2. `DetailPage` — sessionStorage key mismatch (`cartItems_` vs `cartItems-`)
3. `HomePage` — `useCallback` had wrong deps `[inputValue, debounceInput]`, redundant double-fire `useEffect`
4. `HomePage` — removed unused `_isRequesting` state + `hideIsRequesting` helper
5. `AddressMap` / `EditLocationMap` — `generateuuid` called as reference `${generateuuid}` not `${generateuuid()}`, breaking Marker keys
6. `AddressMap` / `EditLocationMap` — same debounce/dead-state bugs as #3 and #4
7. `AddressMap` — passed raw `inputValue` to `useGeocodingForward` (no debounce); now uses debounced input via hook

## Refactors done

- **`src/common/useGeocodingSearch.ts`** — custom hook extracting shared geocoding logic (debounce, forward geocoding query, result mapping, clear/select handlers) used by `HomePage`, `AddressMap`, `EditLocationMap`
- **`src/common/index.ts`** — barrel export for common utilities
- **All mutation hooks** (`MyAddressApi`, `MyRestaurantApi`, `MyUserApi`, `OrderApi`) — moved `toast` calls from render-time `if(isSuccess/isError)` to React Query `onSuccess`/`onError` callbacks
- **`dockerfile`** — two-stage build (Node 18 Alpine build → nginx:alpine serve)
- **`nginx.conf`** — SPA-aware config with `try_files` fallback and 1-year asset caching

## Additional fixes (session 2026-06-12, audit round 2)

- Bug 11: `EditLocationSlice.ts` — `!!!state.isEdit` → `!state.isEdit` (triple negation was no-op)
- Bug 12: `AddressListPage.tsx` — `key={generateuuid()}` → `key={data._id}` (unstable keys caused remount on each render)
- Bug 13: `OrderStatusDetails.tsx` — `key={generateuuid()}` → `key={item.menuItemId}` (same unstable key issue); removed unused `generateuuid` import
- Bug 14: `order_status_config.ts` — typos fixed: `"places"` → `"Placed"`, `"Our for Delivery"` → `"Out for Delivery"`
- Bug 15: `AnimatedPage.tsx` `animationscale` — `animate.x: 0` → `animate.scale: 1` and `exit.x: 0.5` → `exit.scale: 0.5` (wrong property for scale animation)
- Bug 16: `MenuSection.tsx` — `append({name:'', price:''})` → `append({name:'', price: 0})` (string `''` failed Zod `coerce.number` validation on new menu item)
- Bug 17: `RestaurantList.tsx` — `<li key={index}>` → `<li key={d._id}>` and removed duplicate `key={index}` on `<SearchResultCard>`
- Bug 18: `ManageRestaurantForm.tsx` — `parseInt((price / 100).toFixed(2))` → `Math.round(price / 100)` for both deliveryPrice and menuItems (parseInt truncates decimal cents, showing wrong price when editing)
- Bug 19: `SearchResultCard.tsx` — removed dead `if(!isPopup)` branch after early-return; simplified to direct `return <MainSearchCard />`
- Bug 20: `CheckoutButton.tsx` — `useGetUserAddress("")` → `useGetUserAddress()`; simplified async useEffect to sync; fixed `[]` deps → `[getAddress]` so address matching runs when query data loads

## Remaining known issues

- `MeuItem.tsx`, `GoecodingTypeMatch.ts` — typos in filenames (cosmetic, no functional impact)

## Additional fixes (session 2026-06-12 continued)

- Bug 8: `AddressDetails.tsx` — fixed create vs update check from `fullName !== ""` → `_id !== ""` (both submit logic and button label)
- Bug 9: `AddressDetails.tsx` — changed hardcoded `postalcode: "0"` → `""` (field is optional in backend)
- Bug 10: `RestaurantApi.tsx` — fixed static query key `'fetchRestaurant'` → `['fetchRestaurant', restaurantId]`
- Issue 4: `FormSchemas.ts` — documented SG-only phone regex with a comment
- Issue 5: `CheckoutDelivery.tsx` — delivery lat/lng/fullName now set in `defaultValues` from saved address (falling back to profile); removed silent `onSubmit` overwrite; fixed `lon`→`lng` field name mismatch (UserAddress uses `lon`, form schema uses `lng`)
