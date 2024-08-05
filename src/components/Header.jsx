import React, { useState, useEffect } from 'react';
import { FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { Link as ScrollLink } from 'react-scroll';
import ScheduleForm from './ScheduleForm'; 

const Header = ({ cart, clearCart, removeFromCart }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [membershipEnds, setMembershipEnds] = useState('');
  const [passType, setPassType] = useState('');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminFormVisible, setIsAdminFormVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        checkIfMember(currentUser.email);
      }
    });
    return unsubscribe;
  }, []);

  const checkIfMember = async (email) => {
    const membersCollection = collection(db, 'members');
    const membersSnapshot = await getDocs(membersCollection);
    const members = membersSnapshot.docs.map(doc => doc.data());
    const member = members.find(member => member.email === email);
    if (member) {
      setIsMember(true);
      setPassType(member.pass_type);
      setMembershipEnds(new Date(member.membership_ends.seconds * 1000).toLocaleString());
    }
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = async () => {
    await signOut(auth);
    clearCart(); 
    navigate('/');
  };

  const handleCheckoutClick = () => {
    if (user) {
      navigate('/checkout', { state: { cart } });
    } else {
      navigate('/login', { state: { from: '/checkout', cart } });
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminEmail === 'admin@gmail.com' && adminPassword === 'password') {
      navigate('/admin-dashboard');
    } else {
      alert('Invalid admin credentials');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="bg-gray-900 p-4 flex justify-between items-center fixed top-0 w-full z-50">
      <div className="flex items-center md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-primary">
          {isMenuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </button>
      </div>
      <div
        className="text-primary text-2xl font-bold cursor-pointer hidden md:block"
        onClick={scrollToTop}
      >
        FitTech
      </div>
      <nav className="hidden md:flex items-center space-x-4">
        <ScrollLink to="programs-section" smooth={true} duration={500} className="text-white hover:text-primary cursor-pointer">Programs</ScrollLink>
        <ScrollLink to="testimonials-section" smooth={true} duration={500} className="text-white hover:text-primary cursor-pointer">Testimonials</ScrollLink>
        <ScrollLink to="plans-section" smooth={true} duration={500} className="text-white hover:text-primary cursor-pointer">Membership</ScrollLink>
        <button onClick={() => navigate('/trainer-login')} className="text-white hover:text-primary cursor-pointer">Trainer</button>
        <div className="relative">
          <button onClick={() => setIsAdminFormVisible(!isAdminFormVisible)} className="text-white hover:text-primary cursor-pointer">Admin</button>
          {isAdminFormVisible && (
            <div className="absolute top-12 right-4 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
              <form onSubmit={handleAdminLogin} className="p-4" autoComplete="off">
                <div className="mb-4">
                  <label htmlFor="adminEmail" className="block text-black">Email</label>
                  <input
                    type="email"
                    id="adminEmail"
                    className="w-full p-2 border border-gray-300 rounded mt-2 text-black"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="adminPassword" className="block text-black">Password</label>
                  <input
                    type="password"
                    id="adminPassword"
                    className="w-full p-2 border border-gray-300 rounded mt-2 text-black"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-2 rounded mt-4 hover:bg-secondary">
                  Login
                </button>
              </form>
            </div>
          )}
        </div>
      </nav>
      <div className="flex items-center">
        <div className="relative ml-4">
          <button onClick={() => toggleDropdown('cart')} className="text-white hover:text-primary ml-4">
            <FaShoppingCart size={25} />
            {cart.length > 0 && <span className="absolute top-0 right-0 block h-2 w-2 bg-red-600 rounded-full"></span>}
          </button>
          {activeDropdown === 'cart' && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
              {cart.length > 0 ? (
                <div className="p-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-bold text-gray-700">{item.title}</span>
                        <span className="text-gray-600 block">{item.price}</span>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="text-red-500 font-bold">×</button>
                    </div>
                  ))}
                  <button onClick={handleCheckoutClick} className="bg-blue-500 text-white py-1 px-2 rounded mt-2 w-full hover:opacity-75 active:opacity-50">
                    Checkout
                  </button>
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-gray-700">Cart is empty</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="relative ml-4">
          <button onClick={() => toggleDropdown('profile')} className="text-white hover:text-primary ml-4">
            <FaUser size={25} />
          </button>
          {activeDropdown === 'profile' && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
              <div className="p-4">
                {user ? (
                  <>
                    <div className="text-gray-700 mb-4 w-full overflow-hidden overflow-ellipsis whitespace-nowrap">{user.email}</div>
                    {isMember && (
                      <>
                        <div className="text-gray-600 mb-4">
                          Pass Type: {passType}
                        </div>
                        <div className="text-gray-600 mb-4">
                         Your membership ends on: {membershipEnds}
                        </div>
                      </>
                    )}
                    {isMember && (
                      <button 
                        onClick={() => {
                          setShowScheduleForm(true);
                          setActiveDropdown(null);
                        }} 
                        className="bg-blue-500 text-white py-1 px-2 rounded mt-2 w-full hover:opacity-75 active:opacity-50 mb-2"
                      >
                        Schedule
                      </button>
                    )}
                    <button onClick={handleLogoutClick} className="bg-blue-500 text-white py-1 px-2 rounded w-full hover:opacity-75 active:opacity-50">
                      Logout
                    </button>
                  </>
                ) : (
                  <button onClick={handleLoginClick} className="bg-blue-500 text-white py-1 px-2 rounded w-full hover:opacity-75 active:opacity-50">Login</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {showScheduleForm && <ScheduleForm onClose={() => setShowScheduleForm(false)} />}
      <div className={`fixed inset-0 z-40 bg-black bg-opacity-50 ${isMenuOpen ? 'block' : 'hidden'}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <button onClick={() => setIsMenuOpen(false)} className="text-white hover:text-primary p-4">
          <FaTimes size={30} />
        </button>
        <nav className="flex flex-col space-y-4 p-4">
          <ScrollLink to="programs-section" smooth={true} duration={500} className="text-white hover:text-primary cursor-pointer">Programs</ScrollLink>
          <ScrollLink to="testimonials-section" smooth={true} duration={500} className="text-white hover:text-primary cursor-pointer">Testimonials</ScrollLink>
          <ScrollLink to="plans-section" smooth={true} duration={500} className="text-white hover:text-primary cursor-pointer">Membership</ScrollLink>
          <button onClick={() => navigate('/trainer-login')} className="text-white hover:text-primary cursor-pointer text-left">Trainer</button>
          <div className="relative">
            <button onClick={() => setIsAdminFormVisible(!isAdminFormVisible)} className="text-white hover:text-primary cursor-pointer text-left">Admin</button>
            {isAdminFormVisible && (
              <div className="bg-gray-900 p-4 rounded-lg mt-2">
                <form onSubmit={handleAdminLogin} className="space-y-4" autoComplete="off">
                  <div>
                    <label htmlFor="adminEmail" className="block text-white">Email</label>
                    <input
                      type="email"
                      id="adminEmail"
                      className="w-full p-2 border border-gray-300 rounded mt-2 text-black"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label htmlFor="adminPassword" className="block text-white">Password</label>
                    <input
                      type="password"
                      id="adminPassword"
                      className="w-full p-2 border border-gray-300 rounded mt-2 text-black"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-2 rounded mt-4 hover:bg-secondary">
                    Login
                  </button>
                </form>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
