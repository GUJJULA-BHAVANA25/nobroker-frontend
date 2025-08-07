// pages/home.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import styles from '../styles/home.module.css';

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  price: number;
  forType: string;
  propertyType: string;
  bedrooms: number | null;
  area: number | null;
  areaUnit: string | null;
  phone: string | null;
  files: Array<{
    id: string;
    url: string;
  }>;
}

export default function HomePage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    forType: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const searchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/properties/search', {
        params: filters,
      });
      setProperties(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchProperties();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.mainContent}>
        <h2 className={styles.pageTitle}>Find Your Perfect Home</h2>

        <div className={styles.searchControls}>
          <input
            name="city"
            placeholder="Search by City"
            value={filters.city}
            onChange={handleChange}
            className={styles.searchInput}
          />
          <button onClick={searchProperties} className={styles.searchButton}>
            Search
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={styles.filterButton}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button 
            onClick={() => router.push('/add-property')} 
            className={styles.addPropertyButton}
          >
            Add Property
          </button>
        </div>

        {showFilters && (
          <div className={styles.filterPanel}>
            <div className={styles.filterGrid}>
              <select 
                name="forType" 
                value={filters.forType} 
                onChange={handleChange}
                className={styles.filterSelect}
              >
                <option value="">For Type</option>
                <option value="RENT">Rent</option>
                <option value="SALE">Sale</option>
              </select>

              <select 
                name="propertyType" 
                value={filters.propertyType} 
                onChange={handleChange}
                className={styles.filterSelect}
              >
                <option value="">Property Type</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="PLOT">Plot</option>
              </select>

              <input 
                name="minPrice" 
                placeholder="Min Price" 
                value={filters.minPrice} 
                onChange={handleChange}
                className={styles.filterInput}
              />
              <input 
                name="maxPrice" 
                placeholder="Max Price" 
                value={filters.maxPrice} 
                onChange={handleChange}
                className={styles.filterInput}
              />
              <input 
                name="bedrooms" 
                placeholder="Bedrooms" 
                value={filters.bedrooms} 
                onChange={handleChange}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterActions}>
              <button onClick={searchProperties} className={styles.applyFiltersButton}>
                Apply Filters
              </button>
              <button 
                onClick={() => {
                  setFilters({
                    city: '',
                    forType: '',
                    propertyType: '',
                    minPrice: '',
                    maxPrice: '',
                    bedrooms: '',
                  });
                  searchProperties();
                }} 
                className={styles.removeFiltersButton}
              >
                Remove Filters
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
            Loading properties...
          </div>
        ) : properties.length === 0 ? (
          <div className={styles.noResults}>
            <img src="/no-properties.svg" alt="No properties" className={styles.noResultsImage} />
            <p>No properties found matching your criteria</p>
            <button onClick={() => setFilters({
              city: '',
              forType: '',
              propertyType: '',
              minPrice: '',
              maxPrice: '',
              bedrooms: '',
            })} className={styles.resetFiltersButton}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.propertyList}>
            {properties.map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/property/${p.id}`)}
                className={styles.propertyCard}
              >
                {/* Only show image section if files exist and have length > 0 */}
                {p.files && p.files.length > 0 && (
                  <div className={styles.propertyImageContainer}>
                    <img
                      src={`http://localhost:5000${p.files[0].url}`}
                      alt="Property"
                      className={styles.propertyMainImage}
                    />
                    <div className={styles.propertyBadge}>
                      {p.forType === 'RENT' ? 'For Rent' : 'For Sale'}
                    </div>
                    <div className={styles.propertyPriceTag}>
                      ₹{p.price.toLocaleString()}
                    </div>
                  </div>
                )}
                
                <div className={styles.propertyDetails}>
                  <h3 className={styles.propertyTitle}>{p.title}</h3>
                  <p className={styles.propertyLocation}>
                    <span className={styles.propertyCity}>{p.city}</span>
                    <span className={styles.propertyAddress}>{p.address}</span>
                  </p>
                  
                  <div className={styles.propertyFeatures}>
                    <div className={styles.propertyFeature}>
                      <span className={styles.featureIcon}>🛏️</span>
                      <span>{p.bedrooms || 'N/A'} Beds</span>
                    </div>
                    <div className={styles.propertyFeature}>
                      <span className={styles.featureIcon}>📏</span>
                      <span>{p.area || 'N/A'} {p.areaUnit}</span>
                    </div>
                    <div className={styles.propertyFeature}>
                      <span className={styles.featureIcon}>🏠</span>
                      <span>{p.propertyType}</span>
                    </div>
                  </div>
                  
                  <div className={styles.propertyFooter}>
                    <button 
                      className={styles.contactButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${p.phone}`;
                      }}
                      disabled={!p.phone}
                    >
                      Contact Owner
                    </button>
                    <span className={styles.propertyPostedDate}>Posted 2 days ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}