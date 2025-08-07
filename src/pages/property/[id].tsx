import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import styles from '../../styles/property.module.css';

interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  price: number;
  propertyType: string;
  forType: string;
  bedrooms: number | null;
  area: number | null;
  areaUnit: string | null;
  phone: string | null;
  files: Array<{
    id: string;
    url: string;
  }>;
}

export default function PropertyPage() {
  const router = useRouter();
  const { id } = router.query;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
      if (res.data.success) {
        setProperty(res.data.data);
      } else {
        setError('Property not found');
      }
    } catch (err) {
      console.error('Failed to fetch property:', err);
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Loading property details...</p>
    </div>
  );

  if (error) return <div className={styles.errorContainer}>{error}</div>;
  if (!property) return <div className={styles.errorContainer}>Property not found.</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>{property.title} | NoBroker</title>
      </Head>

      {/* Property Header */}
      <div className={styles.propertyHeader}>
        <h1 className={styles.propertyTitle}>{property.title}</h1>
        <div className={styles.priceBadge}>
          ₹{property.price.toLocaleString('en-IN')}
          <span className={styles.forType}>{property.forType === 'RENT' ? '/month' : ''}</span>
        </div>
      </div>

      {/* Main Image Gallery */}
      {property.files && property.files.length > 0 && (
        <div className={styles.galleryContainer}>
          <div className={styles.mainImage}>
            <img
              src={`http://localhost:5000${property.files[activeImage].url}`}
              alt={`Property ${activeImage + 1}`}
            />
          </div>
          {property.files.length > 1 && (
            <div className={styles.thumbnailContainer}>
              {property.files.map((file, index) => (
                <div 
                  key={file.id} 
                  className={`${styles.thumbnail} ${index === activeImage ? styles.activeThumbnail : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={`http://localhost:5000${file.url}`}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Property Details */}
      <div className={styles.detailsContainer}>
        <div className={styles.detailsSection}>
          <h2 className={styles.sectionTitle}>Description</h2>
          <p className={styles.description}>{property.description}</p>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailsCard}>
            <h3 className={styles.detailsTitle}>Property Details</h3>
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Type:</span>
                <span className={styles.detailValue}>{property.propertyType}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>For:</span>
                <span className={styles.detailValue}>{property.forType}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Bedrooms:</span>
                <span className={styles.detailValue}>{property.bedrooms ?? 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Area:</span>
                <span className={styles.detailValue}>
                  {property.area ?? 'N/A'} {property.areaUnit}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.detailsCard}>
            <h3 className={styles.detailsTitle}>Location</h3>
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Address:</span>
                <span className={styles.detailValue}>{property.address}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>City:</span>
                <span className={styles.detailValue}>{property.city}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>State:</span>
                <span className={styles.detailValue}>{property.state}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Pincode:</span>
                <span className={styles.detailValue}>{property.pincode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className={styles.contactSection}>
          <h2 className={styles.sectionTitle}>Contact Owner</h2>
          {property.phone ? (
            <div className={styles.contactBox}>
              <p className={styles.contactText}>Call the owner directly:</p>
              <a 
                href={`tel:${property.phone}`} 
                className={styles.contactButton}
              >
                {property.phone}
              </a>
            </div>
          ) : (
            <p className={styles.noContact}>Contact number not available</p>
          )}
        </div>
      </div>
    </div>
  );
}