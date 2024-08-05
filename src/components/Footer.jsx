import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const Footer = () => {
  const [formState, setFormState] = useState({
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      'service_hnmj8i7', 
      'template_2fst51e', 
      formState,
      'p7R767AAXYUunDBB0'  
    ).then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      alert('Message sent successfully!');
      setFormState({
        email: '',
        message: '',
      });
    }).catch((err) => {
      console.log('FAILED...', err);
      alert('Failed to send message. Please try again later.');
    });
  };

  return (
    <footer className="bg-dark text-light py-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-4">SERVICES</h3>
          <ul>
            <li className="mb-2">Strength Training</li>
            <li className="mb-2">Cardio Workouts</li>
            <li className="mb-2">Personal Training</li>
            <li className="mb-2">Yoga Classes</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">COMPANY</h3>
          <ul>
            <li className="mb-2">About Us</li>
            <li className="mb-2">Contact</li>
            <li className="mb-2">Jobs</li>
            <li className="mb-2">Press Kit</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">LEGAL</h3>
          <ul>
            <li className="mb-2">Terms of Use</li>
            <li className="mb-2">Privacy Policy</li>
            <li className="mb-2">Cookie Policy</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">CONTACT US</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                className="p-3 border border-gray-300 rounded w-full text-black"
                value={formState.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                name="message"
                placeholder="Your message"
                className="p-3 border border-gray-300 rounded w-full text-black"
                rows="4"
                value={formState.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded w-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
