'use client';

import { Button } from '@/components/ui/button';

export default function BackButton() {
    return (
        <Button 
            className="mt-2 mr-4 bg-black text-white hover:bg-gray-800" 
            variant="default" 
            onClick={() => window.history.back()}
        >
            Back
        </Button>
    );
}
