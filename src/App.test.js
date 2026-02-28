import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header, tabs, engagement and active users sections', () => {
  render(<App />);
  const heading = screen.getByText(/Citizen Control Panel/i);
  expect(heading).toBeInTheDocument();
  // nav tab buttons
  const tab1 = screen.getByRole('button', { name: /Citizen Engagement/i });
  expect(tab1).toBeInTheDocument();
  const tab2 = screen.getByRole('button', { name: /Citizen Reports/i });
  expect(tab2).toBeInTheDocument();
  // verify engagement section header exists separately
  const engagementSection = screen.getByRole('heading', { name: /Citizen Engagement/i });
  expect(engagementSection).toBeInTheDocument();
  const activeSection = screen.getByText(/Currently Logged In Citizens/i);
  expect(activeSection).toBeInTheDocument();
});
