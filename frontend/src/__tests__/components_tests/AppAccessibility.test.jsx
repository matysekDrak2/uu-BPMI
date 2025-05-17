import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '@/App'; 


// Registrace custom matcheru pro jest-axe
expect.extend(toHaveNoViolations);

test('App should have no accessibility violations', async () => {
  const { container } = render(
    <GoogleOAuthProvider clientId="test-client-id">
      <App />
    </GoogleOAuthProvider>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
