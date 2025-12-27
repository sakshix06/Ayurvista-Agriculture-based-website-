import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Download, QrCode, Smartphone, Building } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import GlobalNavigation from "@/components/GlobalNavigation";
import { toast } from "sonner";

const Consultation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    doctor: "",
    date: undefined as Date | undefined,
    timeSlot: "",
    allergies: "",
    unexplainedPain: "",
    fatigue: "",
    weightChanges: "",
    sleepIssues: "",
    breathShortness: "",
    dizzinessFainting: "",
    familyHistory: "",
    headaches: "",
    skinChanges: "",
    additionalInfo: "",
    exerciseFrequency: "",
    smokingHabits: "",
    alcoholConsumption: "",
    chronicConditions: "",
    currentMedications: "",
    recentSurgeries: "",
    mentalHealth: "",
    dietType: ""
  });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const doctors = [
    "Select a Doctor",
    "Dr. K M Safullah - Neuro Physiotherapy",
    "Dr. M S Haque - Thyroid and hematology", 
    "Dr. Debanjan Mukherjee - Ayurvedic wellness"
  ];

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate step 1 fields
      if (!formData.name || !formData.email || !formData.phone || !formData.gender) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (step === 2) {
      // Validate step 2 fields
      if (!formData.breathShortness || !formData.dizzinessFainting || !formData.familyHistory) {
        toast.error("Please answer all health assessment questions");
        return;
      }
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      generatePDF();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const generatePDF = () => {
    // Create comprehensive PDF content
    const pdfContent = `
HEALTH QUESTIONNAIRE REPORT
=================================

PERSONAL INFORMATION:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Gender: ${formData.gender}
Address: ${formData.address}

HEALTH ASSESSMENT:
1. Do you experience shortness of breath during regular activities?: ${formData.breathShortness || 'Not answered'}
2. Have you had any episodes of dizziness or fainting recently?: ${formData.dizzinessFainting || 'Not answered'}
3. Do you have a family history of chronic illnesses?: ${formData.familyHistory || 'Not answered'}
4. Do you experience persistent headaches or migraines?: ${formData.headaches || 'Not answered'}
5. Have you noticed unusual changes in your skin?: ${formData.skinChanges || 'Not answered'}
6. How often do you exercise?: ${formData.exerciseFrequency || 'Not answered'}
7. Do you smoke or use tobacco products?: ${formData.smokingHabits || 'Not answered'}
8. How often do you consume alcohol?: ${formData.alcoholConsumption || 'Not answered'}
9. Do you have any chronic conditions?: ${formData.chronicConditions || 'Not answered'}
10. Are you currently taking any medications?: ${formData.currentMedications || 'Not answered'}
11. Have you had any surgeries in the past year?: ${formData.recentSurgeries || 'Not answered'}
12. How would you rate your mental health?: ${formData.mentalHealth || 'Not answered'}
13. What type of diet do you follow?: ${formData.dietType || 'Not answered'}

ADDITIONAL INFORMATION:
${formData.additionalInfo || 'No additional information provided'}

=================================
Report generated on: ${new Date().toLocaleString()}
    `;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-questionnaire-${formData.name.replace(/\s+/g, '-')}-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success("Health questionnaire downloaded successfully!");
    
    // Simulate opening the file
    setTimeout(() => {
      toast.info("Opening health questionnaire in your default text editor...");
    }, 1000);
  };

  const handleBookAppointment = () => {
    if (!formData.doctor || formData.doctor === "Select a Doctor") {
      toast.error("Please select a doctor first");
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    
    toast.success("Processing payment...");
    setTimeout(() => {
      toast.success("Appointment Booked! You will receive confirmation details soon.");
      setShowPayment(false);
      setStep(1);
      setFormData({
        name: "", email: "", phone: "", gender: "", address: "", street: "", city: "", state: "", zipCode: "", doctor: "",
        date: undefined, timeSlot: "", allergies: "", unexplainedPain: "",
        fatigue: "", weightChanges: "", sleepIssues: "", breathShortness: "",
        dizzinessFainting: "", familyHistory: "", headaches: "", skinChanges: "",
        additionalInfo: "", exerciseFrequency: "", smokingHabits: "", alcoholConsumption: "",
        chronicConditions: "", currentMedications: "", recentSurgeries: "", mentalHealth: "", dietType: ""
      });
    }, 2000);
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalNavigation />
        <div className="pt-16 max-w-4xl mx-auto p-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                onClick={() => handleInputChange('paymentDetails', 'appointment')}
                className="w-full text-white mb-4 hover:opacity-90"
                style={{ backgroundColor: '#1A2417' }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Appointment Details
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${paymentMethod === 'qr' ? 'ring-2' : ''}`}
                  style={paymentMethod === 'qr' ? { '--tw-ring-color': '#1A2417' } as React.CSSProperties : {}}
                  onClick={() => setPaymentMethod('qr')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="h-12 w-12 text-gray-600" />
                    </div>
                    <p className="font-medium">Pay via QR Code</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all duration-200 ${paymentMethod === 'upi' ? 'ring-2' : ''}`}
                  style={paymentMethod === 'upi' ? { '--tw-ring-color': '#1A2417' } as React.CSSProperties : {}}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-12 w-12 text-gray-600" />
                    </div>
                    <p className="font-medium">Pay via UPI</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all duration-200 ${paymentMethod === 'netbanking' ? 'ring-2' : ''}`}
                  style={paymentMethod === 'netbanking' ? { '--tw-ring-color': '#1A2417' } as React.CSSProperties : {}}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building className="h-12 w-12 text-gray-600" />
                    </div>
                    <p className="font-medium">Pay via Net Banking</p>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={handlePayment}
                className="w-full text-white text-lg py-6 hover:opacity-90"
                style={{ backgroundColor: '#1A2417' }}
                disabled={!paymentMethod}
              >
                Pay Now ₹150
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ABC8A2' }}>
      <GlobalNavigation />
      <div className="pt-16 flex">
        {/* Left Form Section */}
        <div className="w-1/2 p-6">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center space-x-4 mb-6">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= num ? 'text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                    style={step >= num ? { backgroundColor: '#1A2417' } : {}}
                    >
                      {num}
                    </div>
                    <span className="ml-2 text-sm">
                      {num === 1 ? 'Personal Information' : num === 2 ? 'Health Assessment' : 'Additional Details'}
                    </span>
                    {num < 3 && <div className="w-16 h-0.5 bg-gray-200 mx-4" />}
                  </div>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      </div>
                       
                       <div>
                         <Label htmlFor="email">Your Email</Label>
                         <Input
                           id="email"
                           type="email"
                           placeholder="Enter your email"
                           value={formData.email}
                           onChange={(e) => handleInputChange('email', e.target.value)}
                         />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <Label htmlFor="phone">Your Phone</Label>
                         <Input
                           id="phone"
                           placeholder="Enter your phone number"
                           value={formData.phone}
                           onChange={(e) => handleInputChange('phone', e.target.value)}
                         />
                       </div>

                       <div>
                         <Label>Select Gender</Label>
                         <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                           <SelectTrigger>
                             <SelectValue placeholder="Select Gender" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="male">Male</SelectItem>
                             <SelectItem value="female">Female</SelectItem>
                             <SelectItem value="other">Other</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                    </div>

                     <div className="bg-gray-50 p-6 rounded-lg border">
                       <h3 className="text-lg font-semibold mb-4 text-gray-800">Address Information</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <Label htmlFor="street">Street Address</Label>
                           <Input
                             id="street"
                             placeholder="Enter street address"
                             value={formData.street || ''}
                             onChange={(e) => handleInputChange('street', e.target.value)}
                           />
                         </div>
                         <div>
                           <Label htmlFor="city">City</Label>
                           <Input
                             id="city"
                             placeholder="Enter city"
                             value={formData.city || ''}
                             onChange={(e) => handleInputChange('city', e.target.value)}
                           />
                         </div>
                         <div>
                           <Label htmlFor="state">State/Province</Label>
                           <Input
                             id="state"
                             placeholder="Enter state/province"
                             value={formData.state || ''}
                             onChange={(e) => handleInputChange('state', e.target.value)}
                           />
                         </div>
                         <div>
                           <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                           <Input
                             id="zipCode"
                             placeholder="Enter ZIP/postal code"
                             value={formData.zipCode || ''}
                             onChange={(e) => handleInputChange('zipCode', e.target.value)}
                           />
                         </div>
                       </div>
                     </div>
                   </div>
                </>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label>Do you experience shortness of breath during regular activities?</Label>
                    <Select value={formData.breathShortness} onValueChange={(value) => handleInputChange('breathShortness', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="sometimes">Sometimes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Have you had any episodes of dizziness or fainting recently?</Label>
                    <Select value={formData.dizzinessFainting} onValueChange={(value) => handleInputChange('dizzinessFainting', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="not-sure">Not sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Do you have a family history of chronic illnesses like diabetes, heart disease, or cancer?</Label>
                    <Select value={formData.familyHistory} onValueChange={(value) => handleInputChange('familyHistory', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="not-sure">Not sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Do you experience any persistent headaches or migraines?</Label>
                    <Select value={formData.headaches} onValueChange={(value) => handleInputChange('headaches', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="sometimes">Sometimes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Have you noticed any unusual changes in your skin, such as rashes, lumps, or discoloration?</Label>
                    <Select value={formData.skinChanges} onValueChange={(value) => handleInputChange('skinChanges', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="not-sure">Not sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>How often do you exercise per week?</Label>
                    <Select value={formData.exerciseFrequency} onValueChange={(value) => handleInputChange('exerciseFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="1-2-times">1-2 times per week</SelectItem>
                        <SelectItem value="3-4-times">3-4 times per week</SelectItem>
                        <SelectItem value="5-plus-times">5+ times per week</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Do you smoke or use tobacco products?</Label>
                    <Select value={formData.smokingHabits} onValueChange={(value) => handleInputChange('smokingHabits', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="former">Former smoker</SelectItem>
                        <SelectItem value="occasionally">Occasionally</SelectItem>
                        <SelectItem value="regularly">Regularly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>How often do you consume alcohol?</Label>
                    <Select value={formData.alcoholConsumption} onValueChange={(value) => handleInputChange('alcoholConsumption', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="rarely">Rarely</SelectItem>
                        <SelectItem value="socially">Socially (1-2 drinks per week)</SelectItem>
                        <SelectItem value="moderately">Moderately (3-7 drinks per week)</SelectItem>
                        <SelectItem value="heavily">Heavily (8+ drinks per week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Do you have any chronic conditions (diabetes, hypertension, etc.)?</Label>
                    <Select value={formData.chronicConditions} onValueChange={(value) => handleInputChange('chronicConditions', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="diabetes">Diabetes</SelectItem>
                        <SelectItem value="hypertension">Hypertension</SelectItem>
                        <SelectItem value="heart-disease">Heart Disease</SelectItem>
                        <SelectItem value="multiple">Multiple conditions</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Are you currently taking any medications?</Label>
                    <Select value={formData.currentMedications} onValueChange={(value) => handleInputChange('currentMedications', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="prescription">Prescription medications</SelectItem>
                        <SelectItem value="over-counter">Over-the-counter medications</SelectItem>
                        <SelectItem value="supplements">Supplements/Vitamins</SelectItem>
                        <SelectItem value="multiple">Multiple types</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label>Have you had any surgeries in the past year?</Label>
                    <Select value={formData.recentSurgeries} onValueChange={(value) => handleInputChange('recentSurgeries', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="minor">Minor surgery</SelectItem>
                        <SelectItem value="major">Major surgery</SelectItem>
                        <SelectItem value="multiple">Multiple surgeries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>How would you rate your mental health and stress levels?</Label>
                    <Select value={formData.mentalHealth} onValueChange={(value) => handleInputChange('mentalHealth', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="seeking-help">Currently seeking help</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>What type of diet do you typically follow?</Label>
                    <Select value={formData.dietType} onValueChange={(value) => handleInputChange('dietType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="omnivore">Omnivore (everything)</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="keto">Ketogenic</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="other">Other special diet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="additionalInfo">Any additional information you'd like to share...</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Please provide any additional health information, symptoms, concerns, or questions..."
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-4">Health Assessment Summary</h3>
                    <div className="grid grid-cols-1 gap-2 text-sm bg-gray-50 p-4 rounded-lg">
                      <div><strong>Breath Issues:</strong> {formData.breathShortness || 'Not answered'}</div>
                      <div><strong>Dizziness/Fainting:</strong> {formData.dizzinessFainting || 'Not answered'}</div>
                      <div><strong>Family History:</strong> {formData.familyHistory || 'Not answered'}</div>
                      <div><strong>Exercise Frequency:</strong> {formData.exerciseFrequency || 'Not answered'}</div>
                      <div><strong>Smoking Habits:</strong> {formData.smokingHabits || 'Not answered'}</div>
                      <div><strong>Chronic Conditions:</strong> {formData.chronicConditions || 'Not answered'}</div>
                      <div><strong>Mental Health:</strong> {formData.mentalHealth || 'Not answered'}</div>
                    </div>
                  </div>

                  <Button
                    onClick={generatePDF}
                    className="w-full text-white hover:opacity-90"
                    style={{ backgroundColor: '#1A2417' }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Complete Health Report
                  </Button>
                </div>
              )}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                )}
                {step < 3 && (
                  <Button onClick={handleNext} className="ml-auto text-white hover:opacity-90" style={{ backgroundColor: '#1A2417' }}>
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Booking Section */}
          <Card className="w-full mt-6">
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label>Select a Doctor</Label>
                <Select value={formData.doctor} onValueChange={(value) => handleInputChange('doctor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>dd - mm - yyyy</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => handleInputChange('date', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Select a Time Slot</Label>
                <Select value={formData.timeSlot} onValueChange={(value) => handleInputChange('timeSlot', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Time Slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg" style={{ backgroundColor: '#ABC8A2' }}>
                <Upload className="h-5 w-5" style={{ color: '#1A2417' }} />
                <span className="text-sm" style={{ color: '#1A2417' }}>Upload Health Checkup Info (PDF)</span>
              </div>

              <Button
                onClick={handleBookAppointment}
                className="w-full text-white hover:opacity-90"
                style={{ backgroundColor: '#1A2417' }}
              >
                BOOK APPOINTMENT
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Info Section */}
        <div className="w-1/2 p-6">
          <Card className="h-full">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A2417' }}>
                Health checkup information
              </h2>
              <p className="text-gray-600 mb-6">
                Make it easier for doctors to treat you!
              </p>
              <div className="bg-gray-900 rounded-lg p-6">
                <img 
                  src="/lovable-uploads/4569bb5e-341b-40ca-a57d-012a38c41449.png" 
                  alt="Herbal medicine setup" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Consultation;