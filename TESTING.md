# Stitch Shoe Store — Manual & Automated Testing Checklist

This document details the critical user flows, input fields, interactive buttons, and edge cases to test and validate across the Stitch e-commerce platform.

---

## 1. Global Navigation & Layout (`Navbar`, `Footer`, `Breadcrumbs`)

### Elements to Validate:
- [ ] **Navbar Links**: "Men", "Women", "New Arrivals", "Wishlist (Heart Icon)", "Bag (ShoppingBag Icon with Counter)".
- [ ] **Search Overlay**: Triggered by clicking the search icon. It supports dynamic title matching.
- [ ] **Cart Drawer Toggle**: Clicking the Bag icon opens the Cart Drawer.

### Test Flows:
1. **Interactive Path Redirection**: Click each navbar item. Verify route matches `/men`, `/women`, `/new-arrivals`, `/wishlist`, and `/`.
2. **Interactive Search**: Open the search bar, type `Cloud`. Ensure matching products appear instantly. Clicking a result should redirect to `/product/:id` and close the overlay.
3. **Empty Fields Search (Negative)**: Verify search handles gibberish query inputs gracefully by displaying a professional "No products found" message.

---

## 2. Home Page (`Home.tsx` / `Hero.tsx` / `ProductGrid.tsx`)

### Elements to Validate:
- [ ] **Hero Interactive Carousel**: Three small thumbnails, main shoe image, dynamic text display, Floating badges, "View Details" CTA, "Experience 360°" button.
- [ ] **New Arrivals Grid Filter**: "All", "Outdoor", "Performance", "Lifestyle" category pill buttons.
- [ ] **Product Card Interactions**: Hover swap image, Favorite heart toggle, Quick Add button.

### Test Flows & Edge Cases:
1. **Hero Slide Transition**: Click the second thumbnail (Cloud-Walk Retro). Verify the main picture fades/scales, the title updates in real-time, the background ambient glow changes color, and the CTA updates with correct ID.
2. **360° Experience Modal**: Click "Experience 360°". Verify beautiful backdrop-blur modal opens safely. Click the top-right `X` button; verify modal fades out without memory leaks.
3. **Product Card Image Hover**: Hover over any shoe product card. Verify the image smoothly switches to the alternate angle preview. Un-hover to ensure it returns to original.
4. **Instant Favorite Syncing**: Click the Heart indicator on a product card on the Home page. Ensure the navbar count increases by 1 relative to the addition. Ensure navigating to `/wishlist` shows the identical card instantly.

---

## 3. Product Detail Page (`ProductDetail.tsx`)

### Elements to Validate:
- [ ] **Interactive Image Gallery**: Main view, 360° Badge, thumbnail selection gallery.
- [ ] **Size Selection Matrix**: Sizes ranging from 38 to 45.
- [ ] **Specification Tabs**: Tech Specs, Shipping & Returns, Customer Reviews.
- [ ] **Recommendation Carousel**: Inner scroll container + Prev (`<`) and Next (`>`) arrows.

### Test Flows & Edge Cases:
1. **Size Assignment (Critical)**: Ensure selecting a shoe size (e.g., Size 42) reflects in the size visual border state. Click "Add to Bag". Check the Cart Drawer to ensure the item contains the corresponding selected size attribute.
2. **Recommendation Scroll Boundary**: Press the Next `>` arrow on the Related Stitches section repeatedly. Verify smooth horizontal scroll movement. Ensure scrolling stops styling at the end boundary without code crash.
3. **Smooth Tab Swapping**: Alternate between clicking "Tech Specs", "Shipping & Returns", and "Reviews". Verify active indicator bar transitions smoothly.

---

## 4. Wishlist Page (`Wishlist.tsx`)

### Elements to Validate:
- [ ] **Wishlist Cards**: Item main image, title, price, Category, VIEW Button, ADD Button, Trash bin removal button.

### Test Flows & Edge Cases:
1. **No-Item Empty State**: Clear all wishlist items. Verify the page renders a delightful empty-state component centered on screen with an "Explore Products" CTA returning users to home page.
2. **Trash Actions**: Click the Trash icon on a saved item block. Verify the item exits with a clean motion animation and the count on header decreases instantly.

---

## 5. Cart Drawer & Core Logic (`CartDrawer.tsx` / `CartContext.tsx`)

### Elements to Validate:
- [ ] **Quantity Modifiers**: Plus button `+`, Minus button `-`.
- [ ] **Direct Item Deletion**: Trash bin icon.
- [ ] **Proceed CTA**: Navigates to `/checkout`.

### Verification Checklist & Logic Assertions:
1. **Multi-Size Distinction Rule (Core Bug Fixed)**:
   - Add product "Aero-Stitch V1" of **Size 42** to your bag.
   - Add the identical "Aero-Stitch V1" of **Size 44** to your bag.
   - *Pass Criteria*: The cart drawer **MUST** list these as 2 separate items instead of aggregating them under 1 entry. 
   - Click `-` or Trash on the Size 42 item. Verify Size 44 remains untouched.
2. **Zero-Bound Threshold**: Click the minus button `-` on an item with quantity `1`. Ensure it decreases correctly or is deleted depending on behavior. In this codebase, the component safely guards quantity boundary so it deletes or decrements seamlessly.

---

## 6. Checkout Page (`Checkout.tsx`)

### Elements to Validate:
- [ ] **Recommended Items Section**: Direct addition panel with interactive "Add +" CTA button.
- [ ] **Subtotal / Final Summation Bar**: Unified USD calculations.
- [ ] **Form Inputs**: Full Name, Phone Number, City, Full Address.
- [ ] **Online Payment Sub-Form**: bKash, Nagad, Rocket selector matrix, Phone Number input field, Transaction ID (TrxID) input field.

### Manual Verification Checklist:
1. **Single-Currency Precision**: Ensure display total displays a single unified dollar calculation (e.g., `$154.00`) instead of mixed character currencies (e.g., `$149.00 + ৳120`).
2. **City-Based Shipping Change**: Verify changing city dropdown (ex: Dhaka to Chittagong) automatically re-adjusts delivery cost in real-time ($5 to $10).
3. **Form Constraint Validations (Negative Testing)**:
   - *Step 1*: Try clicking "Verify & Pay Now" on landing (or with empty fields). Ensure target button remains `disabled` style.
   - *Step 2*: Input Name, Address. Leave Phone Number empty. Ensure button remains `disabled`.
   - *Step 3*: Input non-standard characters into the Phone Number input. Verify input automatically strips non-numeric elements and formats dynamically with a dash (e.g., `01712-345678`).
   - *Step 4*: Input exactly 11 digits phone number. If "Online Payment" is active, make sure MFS information requires equivalent 11-digit numbers plus a valid Transaction ID (minimum 6 alpha-numeric characters) to unlock pay CTA.
   - *Step 5*: Enter valid values. Press "Verify & Pay Now". Verify the processing animation loads, transition states are smooth, the cart context gets completely cleared, and order success screen displays successfully.
