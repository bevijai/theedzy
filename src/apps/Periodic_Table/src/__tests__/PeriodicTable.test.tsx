import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PeriodicTable } from '../components/PeriodicTable';

describe('PeriodicTable', () => {
  it('renders header and legend', () => {
    render(<PeriodicTable />);
    expect(screen.getByText(/Interactive Periodic Table/i)).toBeInTheDocument();
    expect(screen.getByText(/Element Categories/i)).toBeInTheDocument();
  });

  it('opens Filters & Charts modal', () => {
    render(<PeriodicTable />);
    fireEvent.click(screen.getByText(/Filters & Charts/i));
    expect(screen.getByText(/Filters & Charts/i)).toBeInTheDocument();
    expect(screen.getByText(/Categories/i)).toBeInTheDocument();
  });

  it('filters by category from accessible list', () => {
    render(<PeriodicTable />);
    fireEvent.click(screen.getByText(/Filters & Charts/i));
    const categoryBtn = screen.getAllByRole('button', { name: /alkali/i })[0];
    fireEvent.click(categoryBtn);
    expect(screen.getByText(/alkali/i)).toBeInTheDocument();
  });
});
