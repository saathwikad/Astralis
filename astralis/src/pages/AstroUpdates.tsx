import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import './SpaceNews.css';

interface SpaceUpdate {
  title: string;
  explanation: string;
  url: string;
  date: string;
  media_type: string;
}

const SpaceNews: React.FC = () => {
  const [updates, setUpdates] = useState<SpaceUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Format date as YYYY-MM-DD for NASA API
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${formattedDate}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        // If single item returned, wrap in array
        setUpdates(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Fixed the date change handler
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="space-news">
      <div className="navigation-bar">
        <motion.div
          className="home-button-container"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/home" className="home-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="home-icon">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            HomePage
          </Link>
        </motion.div>
      </div>

      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        className="title"
      >
        Space Astronomy News
      </motion.h1>

      <motion.div 
        className="date-picker-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2>Select Date</h2>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          maxDate={new Date()}
          className="date-picker"
          calendarClassName="calendar"
        />
      </motion.div>

      {loading ? (
        <motion.div 
          className="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { duration: 0.5 },
            y: { repeat: Infinity, duration: 1.5 }
          }}
        >
          Loading space updates...
        </motion.div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="news-container">
          <AnimatePresence>
            {updates.map((update, index) => (
              <motion.div
                key={update.date + index}
                className="news-item"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => toggleExpand(index)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3>{update.title}</h3>
                <p>{update.explanation.substring(0, 150)}...</p>
                
                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      className="news-details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="date">
                        {new Date(update.date).toLocaleDateString()}
                      </div>
                      <p>{update.explanation}</p>
                      {update.media_type === 'image' ? (
                        <motion.img 
                          src={update.url} 
                          alt="Astronomy Picture" 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      ) : update.media_type === 'video' ? (
                        <iframe
                          title="Space Video"
                          src={update.url}
                          frameBorder="0"
                          allowFullScreen
                        />
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p>&copy; 2025 Space Astronomy Updates | Powered by NASA API</p>
      </motion.footer>
    </div>
  );
};

export default SpaceNews;