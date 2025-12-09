import { useState } from 'react';
import apiClient from '../../services/apiClient';

const HotelForm = ({ onHotelCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pricePerNight: '',
        address: '',
        amenities: '',
    });
    const [images, setImages] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const amenitiesArray = formData.amenities.split(',').map(a => a.trim());
            const res = await apiClient.post('/hotels', {
                ...formData,
                amenities: amenitiesArray,
                pricePerNight: Number(formData.pricePerNight)
            });

            const hotelId = res.data._id;

            if (images && images.length > 0) {
                const imageFormData = new FormData();
                for (let i = 0; i < images.length; i++) {
                    imageFormData.append('images', images[i]);
                }
                await apiClient.post(`/hotels/${hotelId}/images`, imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            alert('Hotel created successfully');
            onHotelCreated();
            setFormData({ title: '', description: '', pricePerNight: '', address: '', amenities: '' });
            setImages(null);
        } catch (error) {
            console.error(error);
            alert('Failed to create hotel');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Hotel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Title</label>
                    <input name="title" placeholder="e.g. Grand Plaza" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                    <input name="pricePerNight" type="number" placeholder="e.g. 150" value={formData.pricePerNight} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input name="address" placeholder="e.g. 123 Main St, City" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
                    <input name="amenities" placeholder="e.g. WiFi, Pool, Gym" value={formData.amenities} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" placeholder="Describe the hotel..." value={formData.description} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none h-32" required />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                    <input type="file" multiple onChange={handleFileChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            </div>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded mt-6 hover:bg-blue-700 transition-colors disabled:bg-blue-400">
                {loading ? 'Creating...' : 'Create Hotel'}
            </button>
        </form>
    );
};
export default HotelForm;
