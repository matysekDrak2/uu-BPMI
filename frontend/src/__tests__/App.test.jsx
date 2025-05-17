import { render, screen } from "@testing-library/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { test, expect } from "vitest";
import App from "../App";

test("renders Hello World", () => {
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <App />
    </GoogleOAuthProvider>
  );

  expect(screen.getByRole('heading', { name: /přihlášení/i })).toBeInTheDocument();
});
