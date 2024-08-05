import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { auth, db } from '../firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsCollection = collection(db, 'testimonials');
      const testimonialsSnapshot = await getDocs(testimonialsCollection);
      const testimonialsList = testimonialsSnapshot.docs.map(doc => doc.data());
      setTestimonials(testimonialsList);
    };

    fetchTestimonials();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleAddReview = async () => {
    if (!user) {
      alert("You must be logged in to add a review.");
      return;
    }

    const newTestimonial = { quote, author };

    try {
      await addDoc(collection(db, 'testimonials'), newTestimonial);
      setTestimonials([...testimonials, newTestimonial]);
      alert("Review added successfully!");
      setQuote('');
      setAuthor('');
      setCurrentIndex(testimonials.length); // Move to the newly added testimonial
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Happy Clients Say About Us
        </h2>
        <div className="flex justify-between items-center mb-8">
          <button onClick={handlePrev} className="text-primary">
            <FaArrowLeft size={30} />
          </button>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center mx-4 w-full max-w-lg">
            {testimonials.length > 0 ? (
              <>
                <p className="text-gray-400 mb-4">"{testimonials[currentIndex].quote}"</p>
                <p className="font-bold text-gray-200">{testimonials[currentIndex].author}</p>
              </>
            ) : (
              <p className="text-gray-400">No testimonials available.</p>
            )}
          </div>
          <button onClick={handleNext} className="text-primary">
            <FaArrowRight size={30} />
          </button>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Add Your Review</h3>
          <input
            type="text"
            placeholder="Your Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-900 text-white rounded"
          />
          <textarea
            placeholder="Your Review"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-900 text-white rounded"
          ></textarea>
          <button
            onClick={handleAddReview}
            className="bg-primary text-white py-2 px-4 rounded hover:bg-secondary"
          >
            Add Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
