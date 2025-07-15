import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Package, Tag, Clock, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../config/api';
import toast from 'react-hot-toast';

const FoodDetails = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [noteLoading, setNoteLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchFoodDetails();
  }, [id]);

  useEffect(() => {
    if (food) {
      const timer = setInterval(() => {
        updateTimeLeft();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [food]);

  const fetchFoodDetails = async () => {
    try {
      const [foodResponse, notesResponse] = await Promise.all([
        api.get(`/foods/${id}`),
        api.get(`/foods/${id}/notes`)
      ]);
      
      setFood(foodResponse.data.food);
      setNotes(notesResponse.data.notes || []);
    } catch (error) {
      console.error('Error fetching food details:', error);
      toast.error('Failed to load food details');
    } finally {
      setLoading(false);
    }
  };

  const updateTimeLeft = () => {
    if (!food) return;
    
    const now = new Date();
    const expiryDate = new Date(food.expiryDate);
    const timeDiff = expiryDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      setTimeLeft('Expired');
      return;
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    setNoteLoading(true);
    try {
      const response = await api.post(`/foods/${id}/notes`, {
        content: newNote,
        userEmail: user.email
      });
      
      setNotes([...notes, response.data.note]);
      setNewNote('');
      toast.success('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    } finally {
      setNoteLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = () => {
    return new Date(food.expiryDate) < new Date();
  };

  const isNearlyExpired = () => {
    const today = new Date();
    const expiry = new Date(food.expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 5 && daysDiff > 0;
  };

  const canAddNote = () => {
    return user && food && user.email === food.userEmail;
  };

  if (loading) {
    return <LoadingSpinner text="Loading food details..." />;
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Food Not Found</h2>
          <p className="text-gray-600">The food item you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={food.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={food.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              
              <div className="md:w-1/2 p-6">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {food.title}
                  </h1>
                  <div className="flex items-center space-x-2">
                    {isExpired() ? (
                      <span className="badge badge-expired">Expired</span>
                    ) : isNearlyExpired() ? (
                      <span className="badge badge-nearly-expired">Nearly Expired</span>
                    ) : (
                      <span className="badge badge-fresh">Fresh</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Tag className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">{food.category}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">{food.quantity}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">
                      Expires: {formatDate(food.expiryDate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">
                      Added: {formatDate(food.addedDate)}
                    </span>
                  </div>
                </div>
                
                {/* Expiration Countdown */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Time until expiry:</p>
                      <p className={`text-lg font-semibold ${
                        isExpired() ? 'text-error-600' : 
                        isNearlyExpired() ? 'text-warning-600' : 
                        'text-success-600'
                      }`}>
                        {timeLeft}
                      </p>
                    </div>
                  </div>
                </div>
                
                {food.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700">{food.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <MessageCircle className="h-6 w-6" />
              <span>Notes</span>
            </h2>
            
            {/* Add Note Form */}
            {canAddNote() ? (
              <form onSubmit={handleAddNote} className="mb-6">
                <div className="mb-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note about this food item..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  disabled={noteLoading || !newNote.trim()}
                  className="btn-primary flex items-center space-x-2"
                >
                  {noteLoading ? (
                    <div className="spinner w-5 h-5" />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Add Note</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-center">
                  {user ? 
                    'Only the owner of this food item can add notes.' : 
                    'Please log in to add notes.'
                  }
                </p>
              </div>
            )}
            
            {/* Notes List */}
            {notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note, index) => (
                  <motion.div
                    key={note._id || index}
                    className="bg-gray-50 p-4 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="text-gray-800 mb-2">{note.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By: {note.userEmail}</span>
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No notes yet. Be the first to add one!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodDetails;