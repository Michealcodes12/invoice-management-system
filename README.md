# Invoice Management Application

A fully responsive, premium-designed invoice management web application. Built with React and styled with Tailwind CSS, this app allows users to create, read, update, and delete invoices while supporting both light and dark mode themes.

## 🚀 Setup Instructions

1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
2. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "Invoice App"
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open your browser**: Navigate to the local URL provided by Vite (usually `http://localhost:5173`).

---

## 🏗️ Architecture Explanation

The application follows a clean, component-based architecture using React and Tailwind CSS:

- **State Management (Data Layer)**: The application utilizes the **React Context API** (`InvoiceContext.jsx`) to manage the global state of the invoices. This keeps the data layer abstracted away from the UI components. It handles CRUD operations and syncs automatically with the browser's `localStorage` for data persistence.
- **Orchestration (Routing Layer)**: Because the app primarily consists of two views (List View and Detail View), it uses lightweight, state-based routing within `App.jsx` (`selectedInvoice` state) rather than pulling in a heavy routing library like React Router.
- **Component Modularity (Presentation Layer)**: 
  - Complex UI pieces are broken down into standalone components (`InvoiceForm.jsx`, `InvoiceDetail.jsx`).
  - Reusable, atomic UI elements (`Button.jsx`, `StatusBadge.jsx`) ensure a consistent design language across the application.
- **Styling**: Tailwind CSS is used extensively for utility-first styling, allowing for rapid development of complex responsive layouts and seamless integration of the Dark Mode theme.

---

## ⚖️ Trade-offs

During development, several architectural decisions were made to balance performance, complexity, and development speed:

1. **React Context API vs. External State Libraries (Redux/Zustand)**
   - *Decision*: Used Context API.
   - *Trade-off*: While Context API can trigger wider re-renders than necessary in massive applications, it is built into React and requires zero external dependencies. For an application of this scope, it provides the perfect balance of simplicity and capability without bundle bloat.
2. **State-Based Routing vs. React Router**
   - *Decision*: Managed views using React state.
   - *Trade-off*: Avoids the overhead of setting up and maintaining route definitions. The downside is the lack of "deep linking" (users cannot bookmark a specific invoice's URL), but it significantly speeds up UI transitions and keeps the codebase incredibly lean.
3. **Custom Form Handling vs. Form Libraries (Formik/React Hook Form)**
   - *Decision*: Built custom controlled inputs and validation logic.
   - *Trade-off*: Requires more boilerplate code for managing nested object state (like addresses) and validation logic. However, it provides absolute, granular control over the UI interactions (like dynamically calculating due dates on the fly) and keeps dependencies strictly to UI requirements.
4. **LocalStorage Persistence vs. Backend Database**
   - *Decision*: Saved data locally to the browser.
   - *Trade-off*: Provides a highly responsive, instant user experience with zero server setup or latency. However, data is tethered to the specific browser and device the user is currently on.

---

## ♿ Accessibility Notes

Accessibility (a11y) was treated as a first-class citizen throughout the development process:
- **Semantic HTML**: Proper use of semantic elements (`<main>`, `<header>`, `<nav>`, `<form>`) to ensure screen readers can accurately interpret the document structure.
- **Keyboard Navigation**: All interactive elements (buttons, form inputs, dropdowns) are fully accessible via keyboard. Clear focus states (`focus:ring-primary`) have been implemented so users know exactly where they are on the page.
- **Color Contrast**: Meticulous attention was paid to color contrast ratios, especially when switching to Dark Mode. For example, custom logic ensures that form inputs have a distinct `#1E2139` background against the `#141625` drawer background so they remain clearly visible without blending in.
- **Visual Feedback**: Real-time validation errors are clearly displayed in red text next to form inputs, providing immediate feedback without relying solely on color (text descriptions of the error are provided).

---

## ✨ Improvements Beyond Requirements

To elevate the application from a standard functional app to a premium "Fiscal Curator" aesthetic, several enhancements were added:

- **Fluid Micro-Animations**: Integrated custom Tailwind CSS animations (`animate-in`, `fade-in`, `slide-in-from-bottom`) to provide smooth entrance effects for modals, pages, and the main application load.
- **Dynamic Due Date Calculation**: The form intelligently parses the selected `invoiceDate` and automatically adds the selected `paymentTerms` (e.g., Net 30 Days) to calculate and save the accurate Due Date under the hood.
- **Responsive Footer Controls**: The mobile layout features a highly tailored footer control system. Buttons dynamically resize, share space perfectly on one line (`flex-1`), and drop unnecessary padding on small screens to ensure a flawless experience on devices as narrow as 320px.
- **Theme Preference Memory**: The light/dark mode toggle not only changes the theme instantly but saves the preference to `localStorage`, ensuring the app remembers the user's choice upon returning.
