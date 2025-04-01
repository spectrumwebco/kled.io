import React from 'react';
import { render, screen } from '@testing-library/react';
import { KledProWebAppEmbed } from '../KledProWebAppEmbed';

jest.mock('../../../../kled-pro/frontend/src/App', () => ({
  App: () => <div data-testid="kled-pro-app">Mocked KledProApp</div>
}));

describe('KledProWebAppEmbed Component', () => {
  test('renders nothing when isVisible is false', () => {
    const { container } = render(<KledProWebAppEmbed isVisible={false} />);
    expect(container.firstChild).toBeNull();
  });
  
  test('renders component when isVisible is true', () => {
    render(<KledProWebAppEmbed isVisible={true} />);
    
    expect(screen.getByText('kCluster Management')).toBeInTheDocument();
    
    expect(screen.getByText('Integrated kCluster management interface from kled-pro web app')).toBeInTheDocument();
    
    expect(screen.getByTestId('kled-pro-app')).toBeInTheDocument();
  });
  
  test('has correct structure and CSS classes', () => {
    render(<KledProWebAppEmbed isVisible={true} />);
    
    const mainContainer = screen.getByText('kCluster Management').closest('.kled-pro-embed');
    expect(mainContainer).toBeInTheDocument();
    
    const appContainer = screen.getByTestId('kled-pro-app').closest('.kled-pro-app-container');
    expect(appContainer).toBeInTheDocument();
  });
});
