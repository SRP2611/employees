import { render, screen, fireEvent } from '@testing-library/react';
import Employees from './Employees';


test('Employees Details', () => {
  render(<Employees />);
  const linkElement = screen.getByText(/Employees Details/i);
  expect(linkElement).toBeInTheDocument();
});

test('Simulates selection', () => {
  const { getByTestId, getAllByTestId } = render(<Employees />);
  fireEvent.change(getByTestId('select'), { target: { value: ""} })
  let options = getAllByTestId('select-option')
  expect(options[0].selected).toBeTruthy();
  expect(options[1].selected).toBeFalsy()
  expect(options[2].selected).toBeFalsy();
})

