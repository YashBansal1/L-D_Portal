import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../src/store';
import Login from '../../src/pages/auth/Login';
import GlassCard from '../../src/components/common/GlassCard';

describe('Components', () => {
    it('GlassCard renders children correctly', () => {
        render(<GlassCard>Test Content</GlassCard>);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('Login page renders login form', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );
        expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
    });
});
