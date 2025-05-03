// components/PrintButton.tsx
'use client';
 
import { Button } from '@/components/ui/button';

interface PrintButtonProps {}

const PrintButton: React.FC<PrintButtonProps> = () => {
 const handlePrint = () => {
 window.print();
 };

 return (
 <Button onClick={handlePrint}>
 Print Receipt
 </Button>
 );
};

export default PrintButton;