import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Search, 
  LogOut, 
  User, 
  Compass, 
  Clock, 
  Star, 
  Camera,
  Coffee,
  Utensils,
  Bed,
  ArrowRight,
  Loader2,
  MapIcon,
  Heart
} from 'lucide-react';
import { API_ENDPOINTS } from '../config';

interface TourGuidePageProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

interface TourPlan {
  city: string;
  days: number;
  main_attractions: Array<{
    name: string;
    description: string;
  }>;
  local_foods: Array<{
    name: string;
    description: string;
    restaurant?: string;
  }>;
  itinerary: {
    day: number;
    title: string;
    main_attraction: string;
    activities: Array<{
      time: string;
      activity: string;
      description: string;
      type: 'sightseeing' | 'food' | 'accommodation' | 'activity';
      attraction_related?: string;
    }>;
  }[];
  highlights: string[];
  budget: {
    accommodation: string;
    food: string;
    activities: string;
    transport: string;
  };
}

const TourGuidePage: React.FC<TourGuidePageProps> = ({ user, onLogout }) => {
  const [city, setCity] = useState('');
  const [days, setDays] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tourPlan, setTourPlan] = useState<TourPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const requestBody = {
        city: city.trim(),
        days: parseInt(days) || 3,
        userId: user?.email // Include user info if needed
      };

      const response = await fetch(API_ENDPOINTS.TOUR_PLAN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate the response structure
      if (!data || !data.itinerary) {
        throw new Error('Invalid response format from API');
      }

      setTourPlan(data);
    } catch (err) {
      console.error('Error fetching tour plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate tour plan');
      
      // Fallback to mock data for development/demo purposes
      const mockTourPlan: TourPlan = {
        city: city,
        days: parseInt(days) || 3,
        main_attractions: [
          { name: `${city} Historic Center`, description: `The heart of ${city} with historic architecture`, category: 'historical', must_visit: true, best_time: 'morning' },
          { name: `${city} Main Cathedral`, description: `Iconic religious landmark of ${city}`, category: 'religious', must_visit: true, best_time: 'any' },
          { name: `${city} Central Market`, description: `Traditional market with local goods and food`, category: 'cultural', must_visit: true, best_time: 'morning' },
          { name: `${city} Museum`, description: `Learn about ${city}'s history and culture`, category: 'cultural', must_visit: false, best_time: 'afternoon' },
          { name: `${city} Scenic Viewpoint`, description: `Best panoramic views of ${city}`, category: 'natural', must_visit: true, best_time: 'evening' }
        ],
        itinerary: [
          {
            day: 1,
            title: `Welcome to ${city}`,
            main_attraction: `${city} Historic Center`,
            activities: [
              { time: '09:00', activity: `${city} Historic Center Tour`, description: 'Explore the historic downtown area', type: 'sightseeing', attraction_related: `${city} Historic Center` },
              { time: '12:00', activity: 'Local Cuisine Lunch', description: 'Try authentic local dishes', type: 'food', attraction_related: `${city} Central Market` },
              { time: '14:00', activity: `${city} Museum Visit`, description: 'Discover local history and culture', type: 'activity', attraction_related: `${city} Museum` },
              { time: '18:00', activity: `${city} Scenic Viewpoint`, description: 'Perfect photo opportunity', type: 'sightseeing', attraction_related: `${city} Scenic Viewpoint` }
            ]
          },
          {
            day: 2,
            title: 'Cultural Immersion',
            main_attraction: `${city} Main Cathedral`,
            activities: [
              { time: '08:00', activity: `${city} Central Market Visit`, description: 'Experience local market culture', type: 'activity', attraction_related: `${city} Central Market` },
              { time: '10:30', activity: `${city} Main Cathedral Tour`, description: 'Visit the iconic religious landmark', type: 'sightseeing', attraction_related: `${city} Main Cathedral` },
              { time: '13:00', activity: 'Cooking Class', description: 'Learn to make local specialties', type: 'food' },
              { time: '16:00', activity: 'Historical District', description: 'Walk through centuries of history', type: 'sightseeing' }
            ]
          },
          {
            day: 3,
            title: 'Adventure & Relaxation',
            main_attraction: `${city} Scenic Viewpoint`,
            activities: [
              { time: '09:00', activity: 'Outdoor Activity', description: 'Hiking or nature exploration', type: 'activity' },
              { time: '12:00', activity: 'Picnic Lunch', description: 'Enjoy nature with local treats', type: 'food' },
              { time: '15:00', activity: 'Spa & Wellness', description: 'Relax and rejuvenate', type: 'activity' },
              { time: '19:00', activity: `${city} Scenic Viewpoint Sunset`, description: 'Celebrate your journey with amazing views', type: 'sightseeing', attraction_related: `${city} Scenic Viewpoint` }
            ]
          }
        ].slice(0, parseInt(days) || 3),
        highlights: [
          'Historic landmarks and architecture',
          'Local culinary experiences',
          'Cultural museums and galleries',
          'Scenic viewpoints and photo spots',
          'Traditional markets and shopping'
        ],
        budget: {
          accommodation: '$80-150/night',
          food: '$25-40/day',
          activities: '$20-50/day',
          transport: '$15-30/day'
        }
      };
      setTourPlan(mockTourPlan);
    }
    
    setIsLoading(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sightseeing': return Camera;
      case 'food': return Utensils;
      case 'accommodation': return Bed;
      case 'activity': return Star;
      default: return Star;
    }
  };

  // Get main attractions with category icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'historical': return '🏛️';
      case 'natural': return '🌄';
      case 'cultural': return '🎭';
      case 'modern': return '🏢';
      case 'religious': return '⛪';
      default: return '📍';
    }
  };

  const getBestTimeIcon = (time: string) => {
    switch (time) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌅';
      default: return '⏰';
    }
  };

  const getLocalFood = () => {
    if (!tourPlan) return [];
    const food = [];
    tourPlan.itinerary.forEach(day => {
      day.activities.forEach(activity => {
        if (activity.type === 'food') {
          food.push(activity);
        }
      });
    });
    return food.slice(0, 4); // Show top 4
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <Compass className="w-8 h-8 text-blue-500 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">AI Tour Guide</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>Welcome, {user?.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Perfect Trip</h2>
            <p className="text-gray-600">Let AI create a personalized itinerary for your next adventure</p>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Destination City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter destination city"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Days (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="days"
                    type="number"
                    min="1"
                    max="30"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="3"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  Creating Your Perfect Itinerary...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Generate Tour Plan
                </div>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <p className="text-red-700 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
              <p className="text-red-600 text-xs mt-2">
                Showing demo data for now. Please check your API connection.
              </p>
            </div>
          )}
        </div>

        {/* Tour Plan Results */}
        {tourPlan && (
          <div className="space-y-6">
            {/* Plan Header */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {tourPlan.days}-Day Tour of {tourPlan.city}
                </h3>
                <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="font-medium">AI Generated</span>
                </div>
              </div>

              {/* Budget Estimate */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Estimated Budget (per person)</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <Bed className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Accommodation</p>
                    <p className="text-sm font-semibold text-gray-900">{tourPlan.budget.accommodation}</p>
                  </div>
                  <div className="text-center">
                    <Utensils className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Food</p>
                    <p className="text-sm font-semibold text-gray-900">{tourPlan.budget.food}</p>
                  </div>
                  <div className="text-center">
                    <Camera className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Activities</p>
                    <p className="text-sm font-semibold text-gray-900">{tourPlan.budget.activities}</p>
                  </div>
                  <div className="text-center">
                    <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Transport</p>
                    <p className="text-sm font-semibold text-gray-900">{tourPlan.budget.transport}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attractions & Local Food */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Attractions */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <Camera className="w-6 h-6 text-blue-500 mr-3" />
                  <h4 className="text-xl font-bold text-gray-900">Main Attractions</h4>
                </div>
                <div className="space-y-3">
                  {tourPlan.main_attractions?.slice(0, 6).map((attraction, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-2xl mr-3">{getCategoryIcon(attraction.category)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-gray-900 text-sm">{attraction.name}</h5>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="mr-1">{getBestTimeIcon(attraction.best_time)}</span>
                            <span>{attraction.best_time}</span>
                            {attraction.must_visit && <span className="ml-2 text-red-500">★</span>}
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs">{attraction.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Food */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <Utensils className="w-6 h-6 text-green-500 mr-3" />
                  <h4 className="text-xl font-bold text-gray-900">Local Food</h4>
                </div>
                <div className="space-y-3">
                  {getLocalFood().map((food, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Heart className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 text-sm">{food.activity}</h5>
                        <p className="text-gray-600 text-xs">{food.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compact Daily Itinerary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Itinerary</h3>
              <div className="space-y-4">
                {tourPlan.itinerary.map((day, dayIndex) => (
                  <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">Day {day.day} - {day.title}</h4>
                        <p className="text-sm text-blue-600 font-medium">🎯 Focus: {day.main_attraction}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {day.activities.map((activity, activityIndex) => {
                        const ActivityIcon = getActivityIcon(activity.type);
                        return (
                          <div key={activityIndex} className="flex items-center p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center mr-3">
                              <Clock className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-xs font-medium text-gray-600">{activity.time}</span>
                            </div>
                            <ActivityIcon className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-gray-900 text-sm truncate">{activity.activity}</h5>
                              <p className="text-gray-600 text-xs truncate">{activity.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourGuidePage;