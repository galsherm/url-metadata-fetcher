import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import URLInputForm from '../components/URLInputForm';

describe('URLInputForm', () => {
    beforeEach(() => {
        window.alert = jest.fn(); // Mock the alert function before each test
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore all mocks after each test
    });

    test('renders initial URL fields and submit button', () => {
        render(<URLInputForm onSubmit={() => { }} />);

        // Check that three URL input fields are rendered
        const inputs = screen.getAllByPlaceholderText('Enter URL');
        expect(inputs).toHaveLength(3);

        // Check that the submit button is rendered
        const submitButton = screen.getByText('Submit');
        expect(submitButton).toBeInTheDocument();
    });

    test('allows adding new URL fields', () => {
        render(<URLInputForm onSubmit={() => { }} />);

        // Add a new URL field
        const addButton = screen.getByText('Add Another URL');
        fireEvent.click(addButton);

        // Check that a new URL input field is rendered
        const inputs = screen.getAllByPlaceholderText('Enter URL');
        expect(inputs).toHaveLength(4);
    });

    test('validates URLs and submits valid ones', async () => {
        const mockOnSubmit = jest.fn();
        render(<URLInputForm onSubmit={mockOnSubmit} />);

        // Enter valid URLs into the fields
        const inputs = screen.getAllByPlaceholderText('Enter URL');
        fireEvent.change(inputs[0], { target: { value: 'https://example.com' } });
        fireEvent.change(inputs[1], { target: { value: 'https://google.com' } });
        fireEvent.change(inputs[2], { target: { value: 'https://yahoo.com' } });

        // Submit the form
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        // Wait for the mock function to be called
        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith([
                'https://example.com',
                'https://google.com',
                'https://yahoo.com',
            ]);
        });
    });

    test('shows alert if fewer than 3 valid URLs are entered', async () => {
        window.alert = jest.fn(); // Mock the alert function
        render(<URLInputForm onSubmit={() => { }} />);

        // Enter fewer than 3 valid URLs
        const inputs = screen.getAllByPlaceholderText('Enter URL');
        fireEvent.change(inputs[0], { target: { value: 'https://google.com' } });

        // Submit the form
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        // Wait for the alert to be called
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Please enter at least 3 valid URLs.');
        });
    });

    test('shows alert if any URL is invalid', async () => {
        render(<URLInputForm onSubmit={() => { }} />);

        // Enter valid and invalid URLs
        const inputs = screen.getAllByPlaceholderText('Enter URL');
        fireEvent.change(inputs[0], { target: { value: 'https://google.com' } });
        fireEvent.change(inputs[1], { target: { value: 'invalid-url' } });
        fireEvent.change(inputs[2], { target: { value: 'https://google.com' } });

        // Submit the form
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        // Wait for the alert to be called
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Please enter at least 3 valid URLs.');
        });
    });

});
