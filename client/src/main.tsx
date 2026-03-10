import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./components/auth-gate/AuthProvider";
import { routeTree } from "./routeTree.gen";
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  notFoundMode:"fuzzy"
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const queryClient = new QueryClient();

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
      
    </>,
  );
}
