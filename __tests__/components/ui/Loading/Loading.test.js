import '@testing-library/jest-dom';
import {screen, cleanup, render} from '@testing-library/react';
import Loading from '@/@core/components/ui/Loading/Loading';

afterEach(cleanup);

it('renders the "loading" text', () => {
  render(<Loading />);

  const loadingSpan = screen.getByText('Loading...');

  expect(loadingSpan).toBeInTheDocument();
});
