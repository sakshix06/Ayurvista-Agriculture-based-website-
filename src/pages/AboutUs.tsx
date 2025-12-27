import GlobalNavigation from "@/components/GlobalNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Users, Target, Award, Heart, Shield } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ABC8A2' }}>
      <GlobalNavigation />
      
      {/* Hero Section */}
      <div 
        className="relative py-20 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 36, 23, 0.85), rgba(26, 36, 23, 0.85)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Ayurvista
          </h1>
          <p className="text-xl mb-8" style={{ color: '#ABC8A2' }}>
            Your Trusted Partner in Natural Wellness
          </p>
          <p className="max-w-3xl mx-auto" style={{ color: '#ABC8A2' }}>
            Discover the ancient wisdom of Ayurveda through our comprehensive platform dedicated to 
            natural healing, herbal remedies, and holistic wellness solutions.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded with a passion for natural healing, Ayurvista emerged from the belief that 
                nature holds the key to optimal health and wellness. Our journey began when our founders 
                recognized the growing need for accessible, authentic Ayurvedic knowledge in the modern world.
              </p>
              <p className="text-gray-600 mb-4">
                We bridge the gap between ancient Ayurvedic wisdom and contemporary healthcare needs, 
                providing a comprehensive platform where traditional knowledge meets modern convenience.
              </p>
              <p className="text-gray-600">
                Today, Ayurvista serves thousands of users worldwide, offering personalized herbal 
                recommendations, expert consultations, and a vast database of medicinal plants.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556909114-b6d36e299db1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Ayurvedic herbs and plants"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: 'rgba(26, 36, 23, 0.2)' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission & Vision */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission & Vision</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Committed to making natural wellness accessible to everyone through authentic Ayurvedic solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow" style={{ borderColor: '#1A2417' }}>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 mr-3" style={{ color: '#1A2417' }} />
                  <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
                </div>
                <p className="text-gray-600">
                  To democratize access to authentic Ayurvedic knowledge and natural healing solutions, 
                  empowering individuals to take control of their health through time-tested herbal remedies 
                  and personalized wellness guidance.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" style={{ borderColor: '#1A2417' }}>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Leaf className="h-8 w-8 mr-3" style={{ color: '#1A2417' }} />
                  <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
                </div>
                <p className="text-gray-600">
                  To be the world's leading platform for Ayurvedic wellness, where ancient wisdom meets 
                  modern technology to create a healthier, more balanced world through natural healing practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Ayurvista
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow" style={{ borderColor: '#1A2417' }}>
              <CardContent className="p-6">
                <Shield className="h-12 w-12 mx-auto mb-4" style={{ color: '#1A2417' }} />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Authenticity</h3>
                <p className="text-gray-600">
                  We provide only genuine, research-backed Ayurvedic knowledge and treatments rooted in ancient traditions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow" style={{ borderColor: '#1A2417' }}>
              <CardContent className="p-6">
                <Heart className="h-12 w-12 mx-auto mb-4" style={{ color: '#1A2417' }} />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Compassion</h3>
                <p className="text-gray-600">
                  Every interaction is guided by empathy and a genuine desire to improve lives through natural healing.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow" style={{ borderColor: '#1A2417' }}>
              <CardContent className="p-6">
                <Users className="h-12 w-12 mx-auto mb-4" style={{ color: '#1A2417' }} />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Community</h3>
                <p className="text-gray-600">
                  We believe in building a supportive community where knowledge and healing experiences are shared.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Plant Experts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet our dedicated team of Ayurvedic practitioners, herbalists, and wellness experts 
              committed to your natural health journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                Our team consists of certified Ayurvedic practitioners, experienced herbalists, 
                and modern healthcare professionals who work together to provide you with the 
                most comprehensive and reliable wellness guidance.
              </p>
              <p className="text-gray-600 mb-4">
                Each team member brings years of experience in traditional medicine, botanical 
                studies, and patient care, ensuring that every recommendation and consultation 
                meets the highest standards of quality and safety.
              </p>
              <p className="text-gray-600">
                We continuously update our knowledge base and stay current with the latest 
                research in herbal medicine to provide you with evidence-based natural solutions.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Team of experts in natural setting"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: 'rgba(26, 36, 23, 0.2)' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-16 px-4" style={{ backgroundColor: '#ABC8A2' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">We Bring You Sunshine</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our commitment to natural wellness has helped thousands of people discover 
              the healing power of Ayurveda and improve their quality of life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: '#1A2417' }}>10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: '#1A2417' }}>500+</div>
              <div className="text-gray-600">Medicinal Plants</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: '#1A2417' }}>100+</div>
              <div className="text-gray-600">Expert Practitioners</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: '#1A2417' }}>5+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Subscribe To The Latest News And Blogs!
          </h2>
          <p className="text-gray-600 mb-8">
            Enter Your Mail To Get The Latest
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter Mail Id"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#1A2417' } as React.CSSProperties}
            />
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-12 px-4" style={{ backgroundColor: '#1A2417' }}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Feel Free To Contact Us
          </h2>
          
          <div className="flex justify-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
          </div>

          <hr className="border-white/30 mb-8" />

          <div className="flex flex-wrap justify-center space-x-8 text-white">
            <a href="/" className="transition-colors hover:opacity-80" style={{ color: '#ABC8A2' }}>Home</a>
            <a href="/explore" className="transition-colors hover:opacity-80" style={{ color: '#ABC8A2' }}>Plants</a>
            <a href="/about" className="transition-colors hover:opacity-80" style={{ color: '#ABC8A2' }}>About</a>
            <a href="/plant-blog" className="transition-colors hover:opacity-80" style={{ color: '#ABC8A2' }}>Plant Care</a>
            <a href="/contact" className="transition-colors hover:opacity-80" style={{ color: '#ABC8A2' }}>Contact Us</a>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ABC8A2' }}>
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-white">AYURVISTA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;