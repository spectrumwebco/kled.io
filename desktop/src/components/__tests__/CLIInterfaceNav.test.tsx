import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CLIInterfaceNav } from '../CLIInterfaceNav';

describe('CLIInterfaceNav Component', () => {
  test('renders all CLI interface tabs', () => {
    render(<CLIInterfaceNav />);
    
    expect(screen.getByText('Kled')).toBeInTheDocument();
    expect(screen.getByText('Cluster')).toBeInTheDocument();
    expect(screen.getByText('Space')).toBeInTheDocument();
    expect(screen.getByText('Policy')).toBeInTheDocument();
  });
  
  test('calls onInterfaceChange when tab is clicked', () => {
    const mockOnInterfaceChange = jest.fn();
    render(<CLIInterfaceNav onInterfaceChange={mockOnInterfaceChange} />);
    
    fireEvent.click(screen.getByText('Cluster'));
    
    expect(mockOnInterfaceChange).toHaveBeenCalledWith('kcluster');
    
    fireEvent.click(screen.getByText('Space'));
    
    expect(mockOnInterfaceChange).toHaveBeenCalledWith('kledspace');
    
    fireEvent.click(screen.getByText('Policy'));
    
    expect(mockOnInterfaceChange).toHaveBeenCalledWith('kpolicy');
    
    fireEvent.click(screen.getByText('Kled'));
    
    expect(mockOnInterfaceChange).toHaveBeenCalledWith('kled');
  });
  
  test('displays correct descriptions for each tab', () => {
    render(<CLIInterfaceNav />);
    
    fireEvent.click(screen.getByText('Kled'));
    expect(screen.getByText('Create and manage development workspaces')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Cluster'));
    expect(screen.getByText('Create, connect, and manage Kubernetes clusters')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Space'));
    expect(screen.getByText('Initialize, deploy, and manage application spaces')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Policy'));
    expect(screen.getByText('Validate, apply, and manage Kubernetes policies')).toBeInTheDocument();
  });
});
