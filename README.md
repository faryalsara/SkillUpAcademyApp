# SkillUp Academy App

A React Native mobile application that allows users to browse courses, add courses to a shopping cart, complete checkout, and view their order history.

## Features

- **Course Catalogue:** Browse available courses.
- **Cart Management:** Add and remove courses and update item quantities.
- **Cart Persistence:** Cart data is saved locally using AsyncStorage.
- **Checkout:** Review the order total and place an order.
- **API Integration:** Submit orders through a secure Vercel API proxy to ReqRes.
- **Order History:** View previously placed orders, including course details, totals, dates, and order IDs.
- **Order Persistence:** Order history is saved locally and remains available after restarting the app.
- **State Management:** Redux Toolkit manages cart and order state.
- **Navigation:** React Navigation provides navigation between the catalogue, cart, checkout, and orders screens.

## Technology Stack

| Technology | Purpose |
|---|---|
| React Native | Mobile application development |
| TypeScript | Type-safe application code |
| Redux Toolkit | Application state management |
| React Redux | Connecting React components to Redux |
| AsyncStorage | Local cart and order persistence |
| React Navigation | Screen navigation |
| ReqRes API | Mock backend for order submission |
| Vercel | Hosting the secure API proxy |

## Project Setup

### Requirements

- Node.js 22.11.0 or later
- npm
- React Native development environment
- Android Studio and an Android emulator, or a connected Android device

Follow the [React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment) before running the application.

### 1. Clone the repository

```bash
git clone https://github.com/faryalsara/SkillUpAcademyApp.git
cd SkillUpAcademyApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Metro

```bash
npm start
```

### 4. Run the Android application

Open another terminal in the project directory and run:

```bash
npm run android
```

## Order API Configuration

The application submits orders through a Vercel serverless API proxy rather than exposing the ReqRes API key inside the mobile application.

**Request endpoint:**

```text
POST https://skillup-api-proxy-gra76uwog-faryalsara.vercel.app/api/orders
```

The proxy:

1. Receives the order details from the mobile application.
2. Reads the private `REQRES_API_KEY` environment variable configured in Vercel.
3. Adds the API key to the request headers.
4. Forwards the order to the ReqRes API.
5. Returns the API response to the mobile application.

### Important security note

Never place the private ReqRes API key in the React Native application or commit it to GitHub. Configure it as a server-side environment variable in the Vercel project.

## Data Persistence

The application uses AsyncStorage to save cart and order information locally on the device.

- Cart data is restored when the application starts.
- Successfully placed orders are added to the order history.
- Saved orders remain available after closing and reopening the application.

## Order Placement Flow

1. The user selects courses from the catalogue.
2. Courses are added to the cart.
3. The user reviews quantities and the total amount.
4. The user proceeds to checkout.
5. The application sends the order to the Vercel API proxy.
6. The proxy forwards the request to ReqRes.
7. After a successful response, the order is saved in Redux and AsyncStorage.
8. The user can view the saved order in the Orders screen.

## Available Commands

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm start` | Start the Metro development server |
| `npm run android` | Build and run the Android app |
| `npm run ios` | Build and run the iOS app on macOS |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |

## Backend Note

ReqRes is used as a mock API service for testing order submission. The application stores its order history locally using AsyncStorage; this local history is separate from the mock API's records.

## Author

**Faryal Sara**

- GitHub: [github.com/faryalsara](https://github.com/faryalsara)

## License
     





## Demo Video

Watch the complete SkillUpAcademyApp demonstration:

[Watch SkillUpAcademyApp Demo](https://drive.google.com/file/d/1kGJkT0tgmE2ZWlBEMAMSpteJC9IQXkpN/view?usp=sharing)



This project was developed for learning and mobile application development practice.