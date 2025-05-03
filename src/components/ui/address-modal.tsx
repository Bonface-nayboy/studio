import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: { street: string; county: string }) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSave }) => {
    const [street, setStreet] = useState("");
    const [county, setCounty] = useState("");

    const handleSave = () => {
        if (street.trim() && county.trim()) {
            onSave({ street, county });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter Shipping Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                <label htmlFor="county" className="block text-sm font-medium text-gray-700">
                        County
                    </label>
                    <Input
                        id="county"
                        name="county"
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                        Street Name
                    </label>
                    <Input
                        id="street"
                        name="street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                   
                </div>
                <DialogFooter>
                    <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddressModal;