import { render, screen } from '@testing-library/react';
import App from './App';

test('renders page header', () => {
  render(<App />);
  const heading = screen.getByText(/Citizen Control Panel/i);
  expect(heading).toBeInTheDocument();
});
