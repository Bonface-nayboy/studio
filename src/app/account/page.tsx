"use client";
import React, { useEffect, useState, useRef, useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from '@/app/(main)/layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import Popup from '@/components/ui/popup';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { submitContactForm, type ContactFormState } from '@/actions/contactActions'; // Import server action
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormStatus } from 'react-dom';

function getStatusStyle(status) {
  switch (status) {
    case 'pending':
      return { color: 'text-blue-600', icon: React.createElement(Clock, { className: 'h-5 w-5 inline align-middle mr-1 font-bold' }) };
    case 'completed':
      return { color: 'text-green-500', icon: React.createElement(CheckCircle, { className: 'h-5 w-5 inline align-middle mr-1 font-bold' }) };
    case 'cancelled':
      return { color: 'text-red-500', icon: React.createElement(XCircle, { className: 'h-5 w-5 inline align-middle mr-1 font-bold' }) };
    case 'processing':
      return { color: 'text-purple-500', icon: React.createElement(Clock, { className: 'h-5 w-5 inline align-middle mr-1' }) };
    default:
      return { color: 'text-gray-500', icon: null };
  }
}

export default function AccountPage() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    mobileNumber: '',
    shippingAddresses: [],
    billingAddresses: [],
    paymentMethods: [],
    preferences: {
      newsletter: false,
      promotions: false,
    },
  });
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [editableFields, setEditableFields] = useState({
    username: false,
    email: false,
    mobileNumber: false,
  });
  const [popupState, setPopupState] = useState({
    isOpen: false,
    title: '',
    description: '',
    content: null,
  });

  const openPopup = (title, description, content) => {
    setPopupState({ isOpen: true, title, description, content });
  };

  const closePopup = () => {
    setPopupState({ isOpen: false, title: '', description: '', content: null });
  };

  const handleEdit = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  };

  const initialState: ContactFormState = { message: '', success: false };
  // Use useActionState instead of useFormState
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null); // Ref to reset the form

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset(); // Reset form fields on success
    } else if (state.message && !state.success) {
      toast.error(state.message || "Failed to send message.");
    }
  }, [state]);

  // Submit Button component
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending} className="bg-black hover:bg-accent-teal/90 text-white">
        {pending ? 'Sending...' : 'Send Message'}
      </Button>
    );
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch('/api/auth/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('User updated successfully:', updatedUser);
        toast.info('Your profile has been updated successfully.');
        setEditableFields({ username: false, email: false, mobileNumber: false });
      } else {
        const errorData = await response.json();
        console.error('Failed to update user:', errorData);
        toast.error(errorData.error || 'Failed to update your details.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('An unexpected error occurred while updating your details.');
    }
  };

  useEffect(() => {
    // Fetch user data from local storage or API
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedMobileNumber = localStorage.getItem('mobileNumber');

    setUserData({
      username: storedUsername || '',
      email: storedEmail || '',
      mobileNumber: storedMobileNumber || '',
      shippingAddresses: [],
      billingAddresses: [],
      paymentMethods: [],
      preferences: {
        newsletter: false,
        promotions: false,
      },
    });
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const storedUsername = localStorage.getItem('username');
      const storedEmail = localStorage.getItem('email');
      const storedMobileNumber = localStorage.getItem('mobileNumber');

      if (storedUsername && storedEmail && storedMobileNumber) {
        try {
          const response = await fetch('/api/order/get-orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: storedUsername,
              email: storedEmail,
              mobileNumber: storedMobileNumber,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setOrders(data);
          } else {
            const errorData = await response.json();
            toast.error(errorData.error || 'Failed to fetch orders.');
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast.error('An unexpected error occurred while fetching orders.');
        }
      } else {
        toast.error('Please ensure you are signed in to view your orders.');
      }
    };

    fetchOrders();
  }, []);

  const handleManageAddresses = () => {
    openPopup(
      'Manage Addresses',
      'Manage your shipping and billing addresses.',
      <div>
        <Button onClick={() => handleAddAddress('shipping')}>Add Shipping Address</Button>
        <Button onClick={() => handleAddAddress('billing')}>Add Billing Address</Button>
        {userData.shippingAddresses?.map((address, index) => (
          <div key={index} className="border p-2 mb-2">
            <p>{address}</p>
            <Button onClick={() => handleDeleteAddress('shipping', address)}>Delete</Button>
            <Button onClick={() => handleSetDefaultAddress('shipping', address)}>Set Default</Button>
          </div>
        ))}
        {userData.billingAddresses?.map((address, index) => (
          <div key={index} className="border p-2 mb-2">
            <p>{address}</p>
            <Button onClick={() => handleDeleteAddress('billing', address)}>Delete</Button>
            <Button onClick={() => handleSetDefaultAddress('billing', address)}>Set Default</Button>
          </div>
        ))}
      </div>
    );
  };

  const handleAddAddress = (type) => {
    openPopup(
      `Add ${type} Address`,
      `Enter the details for your ${type} address below:`,
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const address = formData.get('address');
          if (address) {
            try {
              const response = await fetch('/api/settings/addresses', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: userData.email,
                  address,
                  type,
                }),
              });

              if (response.ok) {
                const updatedUser = await response.json();
                setUserData(updatedUser);
                toast.success(`${type} address added successfully.`);
                closePopup();
              } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to add address.');
              }
            } catch (error) {
              console.error('Error adding address:', error);
              toast.error('An unexpected error occurred while adding the address.');
            }
          }
        }}
      >
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Add Address</Button>
        </div>
      </form>
    );
  };

  const handleDeleteAddress = async (type, address) => {
    // Logic to delete an address
    console.log(`Delete ${type} address:`, address);
  };

  const handleSetDefaultAddress = async (type, address) => {
    // Logic to set an address as default
    console.log(`Set default ${type} address:`, address);
  };

  const handleManageShippingAddresses = () => {
    openPopup(
      'Manage Shipping Addresses',
      'Add, edit, or remove your shipping addresses.',
      <div>
        <Button onClick={() => handleAddShippingAddress()}>Add Shipping Address</Button>
        {userData.shippingAddresses?.map((address, index) => (
          <div key={index} className="border p-2 mb-2">
            <p><strong>Full Name:</strong> {address.fullName}</p>
            <p><strong>Street Address:</strong> {address.streetAddress || 'N/A'}</p>
            <p><strong>City:</strong> {address.city}</p>
            <p><strong>Country:</strong> {address.country}</p>
            <Button onClick={() => handleDeleteShippingAddress(address)}>Delete</Button>
            <Button onClick={() => handleSetDefaultShippingAddress(address)}>Set Default</Button>
          </div>
        ))}
      </div>
    );
  };

  const handleAddShippingAddress = () => {
    openPopup(
      'Add Shipping Address',
      'Enter the details for your new shipping address below:',
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const fullName = formData.get('fullName');
          const streetAddress = formData.get('streetAddress');
          const city = formData.get('city');
          const country = formData.get('country');
          if (fullName && city && country) {
            try {
              const response = await fetch('/api/settings/addresses', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: userData.email,
                  address: { fullName, streetAddress, city, country },
                  type: 'shipping',
                }),
              });

              if (response.ok) {
                const updatedUser = await response.json();
                setUserData(updatedUser);
                toast.success('Shipping address added successfully.');
                closePopup();
              } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to add shipping address.');
              }
            } catch (error) {
              console.error('Error adding shipping address:', error);
              toast.error('An unexpected error occurred while adding the shipping address.');
            }
          }
        }}
      >
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
            Street Address (Optional)
          </label>
          <input
            type="text"
            id="streetAddress"
            name="streetAddress"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Add Address</Button>
        </div>
      </form>
    );
  };

  const handleDeleteShippingAddress = async (address) => {
    // Logic to delete a shipping address
    console.log('Delete shipping address:', address);
  };

  const handleSetDefaultShippingAddress = async (address) => {
    // Logic to set a shipping address as default
    console.log('Set default shipping address:', address);
  };

  const handleManagePaymentMethods = () => {
    openPopup(
      'Manage Payment Methods',
      'Add, edit, or remove your saved payment methods.',
      <div>
        <Button onClick={() => handleAddPaymentMethod()}>Add Payment Method</Button>
        {userData.paymentMethods?.map((method, index) => (
          <div key={index} className="border p-2 mb-2">
            <p>{method.cardType} ending in {method.last4}</p>
            <Button onClick={() => handleDeletePaymentMethod(method)}>Delete</Button>
          </div>
        ))}
      </div>
    );
  };

  const handleAddPaymentMethod = () => {
    openPopup(
      'Add Payment Method',
      'Enter the details for your new payment method below:',
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const cardType = formData.get('cardType');
          const last4 = formData.get('last4');
          if (cardType && last4) {
            try {
              const response = await fetch('/api/settings/payment-methods', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: userData.email,
                  paymentMethod: { cardType, last4 },
                }),
              });

              if (response.ok) {
                const updatedUser = await response.json();
                setUserData(updatedUser);
                toast.success('Payment method added successfully.');
                closePopup();
              } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to add payment method.');
              }
            } catch (error) {
              console.error('Error adding payment method:', error);
              toast.error('An unexpected error occurred while adding the payment method.');
            }
          }
        }}
      >
        <div className="mb-4">
          <label htmlFor="cardType" className="block text-sm font-medium text-gray-700">
            Card Type (e.g., Visa, MasterCard)
          </label>
          <input
            type="text"
            id="cardType"
            name="cardType"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="last4" className="block text-sm font-medium text-gray-700">
            Last 4 Digits of Card
          </label>
          <input
            type="text"
            id="last4"
            name="last4"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Add Payment Method</Button>
        </div>
      </form>
    );
  };

  const handleDeletePaymentMethod = async (method) => {
    // Logic to delete a payment method
    console.log('Delete payment method:', method);
  };

  const handleManagePreferences = () => {
    openPopup(
      'Manage Communication Preferences',
      'Set your email and notification preferences.',
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email Subscriptions</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="newsletter"
              checked={userData.preferences?.newsletter || false}
              onChange={(e) => handlePreferenceChange('newsletter', e.target.checked)}
            />
            <label htmlFor="newsletter">Newsletter</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="promotions"
              checked={userData.preferences?.promotions || false}
              onChange={(e) => handlePreferenceChange('promotions', e.target.checked)}
            />
            <label htmlFor="promotions">Promotional Offers</label>
          </div>
        </div>
        <Button onClick={handleSavePreferences} className="mt-4">Save Preferences</Button>
      </div>
    );
  };

  const handlePreferenceChange = (key, value) => {
    setUserData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const handleSavePreferences = async () => {
    try {
      const response = await fetch('/api/settings/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          preferences: userData.preferences,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        toast.success('Preferences updated successfully.');
        closePopup();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update preferences.');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('An unexpected error occurred while saving preferences.');
    }
  };

  const handleViewOrderHistory = () => {
    // Logic to navigate to the order history page
    console.log('View Order History clicked');
  };

  const handleManageSecurity = () => {
    // Logic to open a modal or navigate to the security management page
    console.log('Manage Security clicked');
  };

  const handleManagePersonalization = () => {
    // Logic to open a modal or navigate to the personalization management page
    console.log('Manage Personalization clicked');
  };

  return (
    <MainLayout>
      <div className={`w-full flex flex-col items-center justify-center h-auto p-4 bg-white`}>
        <h1 className="text-3xl font-bold text-blue-600 mb-6 flex items-center space-x-2">
          <AccountCircleIcon fontSize="large" className="text-blue-600" />
          <span>My Account</span>
        </h1>
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <Tabs defaultValue="profile" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <div className="flex items-center">
                  <Input
                    id="username"
                    value={userData.username}
                    readOnly={!editableFields.username}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                  <button onClick={() => handleEdit('username')} className="ml-2">
                    <EditIcon className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <div className="flex items-center">
                  <Input
                    id="email"
                    value={userData.email}
                    readOnly={!editableFields.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                  <button onClick={() => handleEdit('email')} className="ml-2">
                    <EditIcon className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <div className="flex items-center">
                  <Input
                    id="mobileNumber"
                    value={userData.mobileNumber}
                    readOnly={!editableFields.mobileNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                  <button onClick={() => handleEdit('mobileNumber')} className="ml-2">
                    <EditIcon className="text-gray-500" />
                  </button>
                </div>
              </div>
              <Button onClick={handleUpdate} className="mt-4">Update</Button>

              <section>
                <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>
                      We'd love to hear from you! Send us a message, and we'll get
                      back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Use formAction with the server action */}
                    <form ref={formRef} action={formAction} className="flex flex-col space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                          Name
                        </label>
                        <Input
                          type="text"
                          id="name"
                          name="name" // Add name attribute
                          placeholder="Your Name"
                          required // Add basic HTML validation
                        />
                        {state.errors?.name && (
                          <p className="text-sm font-medium text-destructive mt-1">
                            {state.errors.name.join(', ')}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <Input
                          type="email"
                          id="email"
                          name="email" // Add name attribute
                          placeholder="Your Email"
                          required // Add basic HTML validation
                        />
                        {state.errors?.email && (
                          <p className="text-sm font-medium text-destructive mt-1">
                            {state.errors.email.join(', ')}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message" // Add name attribute
                          placeholder="Your Message"
                          required // Add basic HTML validation
                        />
                        {state.errors?.message && (
                          <p className="text-sm font-medium text-destructive mt-1">
                            {state.errors.message.join(', ')}
                          </p>
                        )}
                      </div>
                      {/* Display general form errors */}
                      {state.errors?._form && (
                        <p className="text-sm font-medium text-destructive">
                          {state.errors._form.join(', ')}
                        </p>
                      )}
                      <SubmitButton /> {/* Use the SubmitButton component */}
                    </form>
                  </CardContent>
                </Card>
              </section>

            </TabsContent>

            <TabsContent value="orders">
              <h2 className="text-xl font-semibold mb-4">My Orders</h2>
              {orders.length > 0 ? (
                <div className="overflow-x-auto w-full h-full">
                  <table className="min-w-full border-collapse border border-gray-200 h-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Order Info</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 align-top" rowSpan={order.items.length + 1}>
                              <p><strong>Order ID:</strong> {order.orderId}</p>
                              <p><strong>Date:</strong> {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</p>
                              <p><strong>Total:</strong> Ksh {parseFloat(order.total ?? 0).toLocaleString()}</p>
                              <p><strong>Payment:</strong> {order.payment || 'N/A'}</p>
                              <p><strong>Status:</strong> <span className={getStatusStyle(order.status).color}>{getStatusStyle(order.status).icon}{order.status || 'N/A'}</span></p>
                            </td>
                          </tr>
                          {order.items.map((item, itemIndex) => (
                            <tr key={itemIndex}>
                              <td className="border border-gray-300 px-4 py-2">{item.productName || 'N/A'}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.quantity || 0}</td>
                              <td className="border border-gray-300 px-4 py-2">Ksh {parseFloat(item.price || 0).toLocaleString()}</td>
                              <td className="border border-gray-300 px-4 py-2">Ksh {(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No orders found.</p>
              )}
            </TabsContent>

            <TabsContent value="settings">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Addresses Card */}
                <div className="p-4 border rounded-lg shadow-md bg-white">
                  <h3 className="text-lg font-semibold mb-2">Addresses</h3>
                  <p className="text-sm text-gray-600">Manage your shipping and billing addresses.</p>
                  <Button className="mt-4 w-full" onClick={() => handleManageShippingAddresses()}>Manage Shipping Addresses</Button>
                  
                </div>

                {/* Payment Methods Card */}
                <div className="p-4 border rounded-lg shadow-md bg-white">
                  <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove your saved payment methods.</p>
                  <Button className="mt-4 w-full" onClick={() => handleManagePaymentMethods()}>Manage Payment Methods</Button>
                </div>

                {/* Communication Preferences Card */}
                <div className="p-4 border rounded-lg shadow-md bg-white">
                  <h3 className="text-lg font-semibold mb-2">Communication Preferences</h3>
                  <p className="text-sm text-gray-600">Set your email and notification preferences.</p>
                  <Button className="mt-4 w-full" onClick={() => handleManagePreferences()}>Manage Preferences</Button>
                </div>

                {/* Order History & Management Card */}
                <div className="p-4 border rounded-lg shadow-md bg-white">
                  <h3 className="text-lg font-semibold mb-2">Order History & Management</h3>
                  <p className="text-sm text-gray-600">View and manage your past orders.</p>
                  <Button className="mt-4 w-full" onClick={() => handleViewOrderHistory()}>View Order History</Button>
                </div>

                {/* Security & Privacy Card */}
                <div className="p-4 border rounded-lg shadow-md bg-white">
                  <h3 className="text-lg font-semibold mb-2">Security & Privacy</h3>
                  <p className="text-sm text-gray-600">Manage your account security and privacy settings.</p>
                  <Button className="mt-4 w-full" onClick={() => handleManageSecurity()}>Manage Security</Button>
                </div>

                {/* Preferences & Personalization Card */}
                <div className="p-4 border rounded-lg shadow-md bg-white">
                  <h3 className="text-lg font-semibold mb-2">Preferences & Personalization</h3>
                  <p className="text-sm text-gray-600">Set your language, currency, and display preferences.</p>
                  <Button className="mt-4 w-full" onClick={() => handleManagePersonalization()}>Manage Preferences</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <Popup
          title={popupState.title}
          description={popupState.description}
          isOpen={popupState.isOpen}
          onClose={closePopup}
        >
          {popupState.content}
        </Popup>
      </div>
    </MainLayout>
  );
}