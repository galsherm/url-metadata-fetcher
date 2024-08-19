import React from 'react';
import { render, screen } from '@testing-library/react';
import MetadataDisplay from '../components/MetadataDisplay';
describe('MetadataDisplay', () => {
    test('displays metadata correctly', () => {
        const metadata = [
            {
                title: 'Example Domain',
                description: 'This is an example domain.',
                image: 'https://example.com/image.jpg',
            },
            {
                title: 'Google',
                description: 'Search the world\'s information.',
                image: '',
            },
        ];

        render(<MetadataDisplay metadata={metadata} />);

        // Check if titles are displayed
        expect(screen.getByText('Example Domain')).toBeInTheDocument();
        expect(screen.getByText('Google')).toBeInTheDocument();

        // Check if descriptions are displayed
        expect(screen.getByText('This is an example domain.')).toBeInTheDocument();
        expect(screen.getByText('Search the world\'s information.')).toBeInTheDocument();

        // Check if images are displayed
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(1); // Only one image should be present

        // Check image src and alt
        expect(images[0]).toHaveAttribute('src', 'https://example.com/image.jpg');
        expect(images[0]).toHaveAttribute('alt', 'Example Domain');
    });

    test('displays error message for items with errors', () => {
        const metadata = [
            {
                error: 'Network error',
            },
        ];

        render(<MetadataDisplay metadata={metadata} />);

        // Check if error message is displayed
        expect(screen.getByText('Error fetching metadata for this URL: Network error')).toBeInTheDocument();
    });

    test('displays no metadata message when there is no metadata', () => {
        render(<MetadataDisplay metadata={[]} />);

        // Check if no metadata message is displayed
        expect(screen.getByText('No metadata to display.')).toBeInTheDocument();
    });
});
