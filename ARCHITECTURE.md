# SkillUp Academy – Application Architecture

## 1. Overview

SkillUp Academy is a React Native CLI application developed using TypeScript. It follows a feature-based structure with separate layers for application state management, screens, navigation, API communication, and local data persistence.

The application uses Redux Toolkit to manage shared state and AsyncStorage to persist cart and order information locally.

A Vercel serverless API proxy handles order submission to ReqRes without exposing the private API key inside the mobile application.

## 2. Technology Stack

| Technology | Responsibility |
|---|---|
| React Native | Mobile user interface |
| TypeScript | Type safety |
| Redux Toolkit | Centralized state management |
| React Redux | Accessing Redux state in components |
| AsyncStorage | Local data persistence |
| React Navigation | Screen navigation |
| ReqRes | Mock order API |
| Vercel | Secure API proxy hosting |

## 3. Project Structure

```text
SkillUpAcademyApp/
│
├── api/
│   └── orders.ts
│
├── src/
│   ├── app/
│   │   ├── hooks.ts
│   │   └── store.ts
│   │
│   ├── features/
│   │   ├── cart/
│   │   │   └── cartSlice.ts
│   │   ├── courses/
│   │   │   └── coursesSlice.ts
│   │   └── orders/
│   │       └── orderSlice.ts
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   │
│   ├── screens/
│   │   ├── CartScreen.tsx
│   │   ├── CatalogueScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   └── OrdersScreen.tsx
│   │
│   ├── services/
│   │   ├── cartStorage.ts
│   │   ├── courseApi.ts
│   │   └── orderStorage.ts
│   │
│   └── types/
│       └── course.ts
│
├── App.tsx
├── package.json
├── README.md
└── ARCHITECTURE.md
```

## 4. Main Architectural Layers

### 4.1 Application State Management

**Location:** `src/app/`

- `store.ts`: Configures the Redux store and combines the course, cart, and order reducers.
- `hooks.ts`: Provides typed Redux hooks for dispatching actions and selecting application state.

Redux Toolkit provides a centralized and predictable way to manage shared application data.

### 4.2 Feature Slices

**Location:** `src/features/`

Each feature has its own Redux slice.

**Cart – `cartSlice.ts`**

Responsible for:
- Adding courses to the cart.
- Removing courses from the cart.
- Updating course quantities.
- Managing cart items and totals.

**Courses – `coursesSlice.ts`**

Responsible for managing course-related application state, including course data and loading or error states.

**Orders – `orderSlice.ts`**

Responsible for:
- Adding successfully placed orders.
- Updating the order list.
- Managing loading and error states.
- Storing order details such as API order ID, items, total, date, and status.

### 4.3 Screens

**Location:** `src/screens/`

The application contains four main screens:

| Screen | Responsibility |
|---|---|
| `CatalogueScreen.tsx` | Displays available courses and provides access to the cart and order history. |
| `CartScreen.tsx` | Displays selected courses and allows quantity updates and item removal. |
| `CheckoutScreen.tsx` | Reviews order details and handles order submission. |
| `OrdersScreen.tsx` | Displays previously placed orders and their details. |

### 4.4 Navigation

**Location:** `src/navigation/AppNavigator.tsx`

React Navigation manages navigation between the catalogue, cart, checkout, and orders screens.

A native stack navigator is used to organize the application screens.

### 4.5 Services

**Location:** `src/services/`

The service layer separates data-related operations from the user interface.

- `courseApi.ts`: Handles communication with the course API.
- `cartStorage.ts`: Saves and loads cart data using AsyncStorage.
- `orderStorage.ts`: Saves and loads order history using AsyncStorage.

### 4.6 Types

**Location:** `src/types/`

- `course.ts`: Defines TypeScript types for course-related data.

The order and cart features also define their relevant data interfaces in their Redux slice files.

## 5. Data Flow

### 5.1 Course Catalogue

1. The catalogue screen requests course data through the course service.
2. Course information is managed through the courses Redux slice.
3. The catalogue displays the available courses.
4. Users can add courses to their cart.

### 5.2 Cart Management

1. The user adds a course to the cart.
2. The cart screen reads the cart state from Redux.
3. Users can update quantities or remove courses.
4. Cart changes are saved locally using AsyncStorage.
5. Saved cart data is restored when the application starts.

### 5.3 Checkout and Order Submission

1. The user proceeds from the cart to checkout.
2. The application prepares the order details, including items, total, and date.
3. The application sends a POST request to the Vercel API proxy.
4. The proxy reads the private ReqRes API key from its server-side environment variables.
5. The proxy forwards the request to ReqRes.
6. The API response is returned to the mobile application.
7. On successful submission, the application creates an order entry in Redux.
8. The cart is cleared and the updated order history is saved locally.

### 5.4 Order History

1. The Orders screen reads order information from Redux.
2. Orders are displayed with their API order ID, date, items, and total.
3. AsyncStorage keeps the order history available after the application is restarted.

## 6. Secure API Architecture

The mobile application does not directly contain the private ReqRes API key.

The order request follows this flow:

```text
React Native Application
          |
          | POST /api/orders
          v
     Vercel API Proxy
          |
          | Adds server-side API key
          v
       ReqRes API
          |
          | Returns order response
          v
     Vercel API Proxy
          |
          | Returns response
          v
React Native Application
```

The proxy is implemented in:

`api/orders.ts`

The private API key is stored in Vercel as:

`REQRES_API_KEY`

This approach keeps the secret outside the mobile application source code.

## 7. Architectural Decisions

### Redux Toolkit for State Management

Redux Toolkit was selected to manage shared course, cart, and order state in a centralized manner.

### AsyncStorage for Local Persistence

AsyncStorage was selected to preserve cart and order data between application sessions without requiring a separate database for local application state.

### Service Layer Separation

API and storage operations are kept separate from screen components to improve organization, maintainability, and code reuse.

### Vercel API Proxy for Security

A server-side proxy was introduced because the ReqRes API requires an API key for order submission. This prevents the private key from being embedded in the mobile application.

### TypeScript

TypeScript interfaces and types help maintain consistent data structures and reduce type-related errors.

## 8. Data Storage Considerations

The application uses two different storage locations:

- **ReqRes:** Receives order submissions and returns mock API responses.
- **AsyncStorage:** Maintains the application's local cart and order history.

The local order history is device-specific. It is not a synchronized account-based order database.

## 9. Future Improvements

Potential improvements include:

- User authentication and individual order histories.
- A permanent backend database for orders.
- Server-side order retrieval and synchronization.
- Improved API error handling and retry mechanisms.
- Automated unit and integration tests.
- Additional order statuses and order details.

## 10. Summary

SkillUp Academy uses a feature-based React Native architecture with Redux Toolkit, TypeScript, React Navigation, and AsyncStorage.

The separation of screens, state management, services, and API communication makes the application easier to maintain and extend. The Vercel proxy provides a safer approach to communicating with the ReqRes mock API.