import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../components/index/App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Hello Ellevator!/i);
  expect(linkElement).toBeInTheDocument();
});
