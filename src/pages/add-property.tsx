import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/add-property.module.css';

export default function AddPropertyPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    price: '',
    propertyType: 'HOUSE',
    phone: '',
    bedrooms: '',
    area: '',
    areaUnit: 'sqft',
    forType: 'SALE',
    userId: '',
  });

  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setFormData((prev) => ({ ...prev, userId: storedUserId }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    try {
      const propertyPayload = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        area: formData.area ? parseFloat(formData.area) : undefined,
      };

      const res = await axios.post('http://localhost:5000/api/properties/add', propertyPayload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const propertyId = res.data.data.id;

      if (images.length > 0) {
        const form = new FormData();
        images.forEach((file) => form.append('images', file));
        form.append('propertyId', propertyId);

        await axios.post('http://localhost:5000/api/properties/upload-images', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      alert('Property added successfully!');
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        price: '',
        propertyType: 'HOUSE',
        phone: '',
        bedrooms: '',
        area: '',
        areaUnit: 'sqft',
        forType: 'SALE',
        userId: formData.userId,
      });
      setImages([]);
    } catch (err) {
      console.error(err);
      alert('Failed to add property');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Add Property</h2>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Title</label>
        <input
          className={styles.input}
          placeholder="Property Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.input}
          placeholder="Detailed description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Address</label>
            <input
              className={styles.input}
              placeholder="Street address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>City</label>
            <input
              className={styles.input}
              placeholder="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>State</label>
            <input
              className={styles.input}
              placeholder="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Pincode</label>
            <input
              className={styles.input}
              placeholder="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Price</label>
            <input
              className={styles.input}
              placeholder="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Phone</label>
            <input
              className={styles.input}
              placeholder="Phone number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {formData.propertyType !== 'PLOT' && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Bedrooms</label>
          <input
            className={styles.input}
            placeholder="Number of bedrooms"
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
          />
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Area</label>
            <input
              className={styles.input}
              placeholder="Area size"
              name="area"
              type="number"
              value={formData.area}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Area Unit</label>
            <select 
              className={styles.select}
              name="areaUnit" 
              value={formData.areaUnit} 
              onChange={handleChange}
            >
              <option value="sqft">Square Feet</option>
              <option value="acre">Acres</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Property Type</label>
            <select 
              className={styles.select}
              name="propertyType" 
              value={formData.propertyType} 
              onChange={handleChange}
            >
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="PLOT">Plot</option>
            </select>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Listing Type</label>
            <select 
              className={styles.select}
              name="forType" 
              value={formData.forType} 
              onChange={handleChange}
            >
              <option value="SALE">For Sale</option>
              <option value="RENT">For Rent</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Images</label>
        <input 
          type="file" 
          multiple 
          onChange={handleImageChange} 
          className={styles.fileInput}
        />
        {images.length > 0 && (
          <p>{images.length} image(s) selected</p>
        )}
      </div>

      <button className={styles.submitButton} onClick={handleSubmit}>
        Add Property
      </button>
    </div>
  );
}