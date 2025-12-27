
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import GlobalNavigation from "@/components/GlobalNavigation";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";

const PlantDetail = () => {
  const { plantId } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock plant data - in real app this would come from API
  const plantData = {
    name: "Neem",
    scientificName: "Azadirachta indica",
    commonNames: ["Neem", "Indian Lilac", "Margosa", "Nimtree"],
    family: "Meliaceae (Mahogany family)",
    taxonomicClassification: {
      domain: "Eukarya",
      kingdom: "Plantae",
      phylum: "Magnoliophyta",
      class: "Magnoliopsida",
      order: "Sapindales",
      family: "Meliaceae",
      genus: "Azadirachta",
      species: "A. indica"
    },
    physicalDescription: {
      plantCharacteristics: "An evergreen tree that can grow up to 40 meters tall, with a wide-spreading canopy and deeply furrowed patterns.",
      leafDetails: "Leaves are compound, pinnate, and 15-40 cm long. They have a distinctive bitter taste and can be crushed.",
      flowerDetails: "Small, white, and fragrant flowers are arranged in clusters at the ends of branches.",
      fruitDetails: "Fruits are smooth, oval-shaped, and yellowish-green when mature. They contain a single seed."
    },
    habitatAndDistribution: "Native to the Indian subcontinent and widely distributed across tropical and subtropical regions.",
    medicinalUses: "Used in traditional medicine for various ailments including skin conditions, digestive issues, and as an antiseptic.",
    cultivationMethods: "Grows well in tropical climates, requires minimal water, and is drought-resistant.",
    chemicalComposition: "Contains compounds like azadirachtin, nimbin, and salannin which give it medicinal properties."
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalNavigation />
      
      {/* Hero Section */}
      <div className="bg-cover bg-center h-64 relative"
           style={{
             backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070')"
           }}>
        <div className="container mx-auto px-4 pt-20">
          <Link to="/dashboard" className="inline-flex items-center text-white mb-4 hover:text-green-300">
            <ArrowLeft className="mr-2" size={20} />
            Back to Garden
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Plant Image */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Plant Image
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={isBookmarked ? "bg-yellow-100" : ""}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-green-100 rounded-lg flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070" 
                    alt="Neem Tree" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  High-resolution image of the {plantData.name} tree
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Plant Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{plantData.name}</CardTitle>
                <p className="text-xl text-gray-600">({plantData.scientificName})</p>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible defaultValue="botanical">
                  <AccordionItem value="botanical">
                    <AccordionTrigger className="text-green-600">
                      🌿 Botanical Information
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <strong>Scientific Name:</strong> {plantData.scientificName}
                        </div>
                        <div>
                          <strong>Common Names:</strong> {plantData.commonNames.join(", ")}
                        </div>
                        <div>
                          <strong>Family:</strong> {plantData.family}
                        </div>
                        <div>
                          <strong>Taxonomic Classification:</strong>
                          <ul className="mt-2 ml-4 space-y-1">
                            {Object.entries(plantData.taxonomicClassification).map(([key, value]) => (
                              <li key={key}>
                                <span className="capitalize">{key}:</span> {value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="physical">
                    <AccordionTrigger className="text-green-600">
                      🌳 Physical Description
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <strong>Plant Characteristics:</strong> {plantData.physicalDescription.plantCharacteristics}
                        </div>
                        <div>
                          <strong>Leaf Details:</strong> {plantData.physicalDescription.leafDetails}
                        </div>
                        <div>
                          <strong>Flower Details:</strong> {plantData.physicalDescription.flowerDetails}
                        </div>
                        <div>
                          <strong>Fruit Details:</strong> {plantData.physicalDescription.fruitDetails}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="habitat">
                    <AccordionTrigger className="text-green-600">
                      🌍 Habitat and Distribution
                    </AccordionTrigger>
                    <AccordionContent>
                      {plantData.habitatAndDistribution}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="medicinal">
                    <AccordionTrigger className="text-green-600">
                      💊 Medicinal Uses
                    </AccordionTrigger>
                    <AccordionContent>
                      {plantData.medicinalUses}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="cultivation">
                    <AccordionTrigger className="text-green-600">
                      🌱 Cultivation Methods
                    </AccordionTrigger>
                    <AccordionContent>
                      {plantData.cultivationMethods}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="chemical">
                    <AccordionTrigger className="text-green-600">
                      ⚗️ Chemical Composition
                    </AccordionTrigger>
                    <AccordionContent>
                      {plantData.chemicalComposition}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
