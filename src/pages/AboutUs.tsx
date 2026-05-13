import GlobalNavigation from "@/components/GlobalNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Users, Target, Award, Heart, Shield } from "lucide-react";
import { useState } from "react";

const AboutUs = () => {

  const [email, setEmail] = useState("");

 const handleSubscribe = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/mail/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (response.ok) {
      alert("Subscribed Successfully 🌿");
      setEmail("");
    } else {
      alert("Subscription failed");
    }

  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};

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
  src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#1A2417' } as React.CSSProperties}
            />

            <button
              onClick={handleSubscribe}
              className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Subscribe
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;