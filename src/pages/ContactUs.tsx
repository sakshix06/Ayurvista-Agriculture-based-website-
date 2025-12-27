import { useState } from "react";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", phone: "", message: "" });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            Contact Us
          </h1>
          <p className="text-xl mb-8" style={{ color: '#ABC8A2' }}>
            We'd Love To Hear From You!
          </p>
          <p className="max-w-2xl mx-auto" style={{ color: '#ABC8A2' }}>
            Have questions about herbal remedies, need consultation advice, or want to learn more about Ayurvista? 
            Fill up the form and our team will get back to you within 24 hours.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information Card */}
            <Card className="text-white overflow-hidden relative" style={{ backgroundColor: '#1A2417' }}>
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <CardContent className="p-8 relative z-10">
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="mb-8" style={{ color: '#ABC8A2' }}>
                  Fill up the form and our team will get back to you within 24 hours
                </p>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-6 w-6" style={{ color: '#ABC8A2' }} />
                    <span>hello@ayurvista.com</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-6 w-6" style={{ color: '#ABC8A2' }} />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 mt-1" style={{ color: '#ABC8A2' }} />
                    <div>
                      <div>123 Wellness Street</div>
                      <div>Ayurveda City, AC 12345</div>
                    </div>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex space-x-4 mt-8">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                    <Facebook className="h-5 w-5" />
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                    <Twitter className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="mt-2"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700">
                    Phone No <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="mt-2"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700">
                    Your Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className="mt-2 min-h-[120px]"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-white py-3 hover:opacity-90"
                  style={{ backgroundColor: '#1A2417' }}
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="py-12 px-4" style={{ backgroundColor: '#1A2417' }}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Feel Free To Contact Us
          </h2>
          
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <Facebook className="h-6 w-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <Twitter className="h-6 w-6 text-white" />
            </div>
          </div>

          <hr className="border-white/30 mb-8" />

          {/* Navigation Links */}
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

export default ContactUs;