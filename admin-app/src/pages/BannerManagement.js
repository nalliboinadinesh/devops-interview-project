import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { bannerAPI } from '../services/api';
import './BannerManagement.css';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    displayOrder: 0,
    isActive: true,
    imageUrl: '',
    imageFile: null
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerAPI.getAll();
      setBanners(response.data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: file.name
      }));
      toast.success('Image selected');
    }
  };

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        displayOrder: banner.displayOrder,
        isActive: banner.isActive,
        imageUrl: banner.imageUrl,
        imageFile: null
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        displayOrder: 0,
        isActive: true,
        imageUrl: '',
        imageFile: null
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      displayOrder: 0,
      isActive: true,
      imageUrl: '',
      imageFile: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!editingBanner && !formData.imageFile) {
      toast.error('Image is required for new banners');
      return;
    }

    // Prevent duplicate submissions
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('displayOrder', formData.displayOrder);
      submitData.append('isActive', formData.isActive);

      if (formData.imageFile) {
        submitData.append('file', formData.imageFile);
      }

      if (editingBanner) {
        await bannerAPI.update(editingBanner._id, submitData);
        toast.success('Banner updated successfully');
      } else {
        await bannerAPI.create(submitData);
        toast.success('Banner created successfully');
      }

      handleCloseModal();
      fetchBanners();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save banner';
      toast.error(errorMsg);
      console.error('Banner submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await bannerAPI.delete(bannerId);
        toast.success('Banner deleted successfully');
        fetchBanners();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete banner');
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <FiPlus size={20} />
          <span>Add Banner</span>
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="mb-4">
            <FiUpload className="mx-auto text-gray-400" size={64} />
          </div>
          <p className="text-gray-500 text-lg mb-2">No banners yet</p>
          <p className="text-gray-400 text-sm mb-6">Create your first banner to display on the home page</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            <FiPlus size={20} />
            <span>Create First Banner</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Banner'}
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    banner.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{banner.title}</h3>
                <p className="text-sm text-gray-600 mb-4">Order: {banner.displayOrder}</p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(banner)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded transition-colors"
                  >
                    <FiEdit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded transition-colors"
                  >
                    <FiTrash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Summer Admission 2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="bannerImageInput"
                  />
                  <label htmlFor="bannerImageInput" className="cursor-pointer">
                    <FiUpload className="mx-auto mb-2 text-gray-400" size={24} />
                    <p className="text-sm text-gray-600">
                      {formData.imageFile ? `✓ ${formData.imageFile.name}` : 'Click to upload or drag and drop'}
                    </p>
                  </label>
                </div>
                {!editingBanner && (
                  <p className="text-xs text-red-600 mt-1">* Required for new banners</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:outline-none"
                  id="isActiveCheckbox"
                />
                <label htmlFor="isActiveCheckbox" className="text-sm font-semibold text-gray-700">
                  Active (Show in user application)
                </label>
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    editingBanner ? 'Update' : 'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
