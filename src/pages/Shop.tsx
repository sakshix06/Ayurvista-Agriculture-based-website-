import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Star, ChevronDown, ShoppingCart, Filter, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  discount?: number;
  soldCount?: number;
  offers?: string[];
  category: "indoor" | "outdoor";
  type: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Air Purifier Money Plant with pot",
    price: 249,
    originalPrice: 350,
    image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png",
    rating: 4.2,
    reviews: 220,
    description: "Perfect indoor plant for air purification",
    discount: 25,
    soldCount: 6470,
    offers: ["Offers Inside"],
    category: "indoor",
    type: "air-purifying"
  },
  {
    id: 2,
    name: "Top 4 Jasmine Flowering Plants for Fragrance",
    price: 1205,
    originalPrice: 1607,
    image: "/lovable-uploads/124c9240-d734-40d5-aaad-699471ad9889.png",
    rating: 4.3,
    reviews: 156,
    description: "Beautiful flowering plants with amazing fragrance",
    discount: 25,
    soldCount: 2840,
    offers: ["Save 25%"],
    category: "outdoor",
    type: "flowering"
  },
  {
    id: 3,
    name: "Peace Lily, Spathiphyllum - Plant",
    price: 169,
    originalPrice: 199,
    image: "/lovable-uploads/57676f3f-fcca-4be2-83f5-99907f0f3068.png",
    rating: 4.6,
    reviews: 852,
    description: "Elegant flowering plant perfect for homes",
    discount: 15,
    soldCount: 2568,
    offers: ["Save up to 15%"],
    category: "indoor",
    type: "flowering"
  },
  {
    id: 4,
    name: "Set of 4 Summer Special Plants (2 Jasmine + 2 Aloe Vera) Pack",
    price: 993,
    originalPrice: 1324,
    image: "/lovable-uploads/b3353135-a7cc-4a7f-861d-ffbce405151c.png",
    rating: 4.4,
    reviews: 234,
    description: "Perfect combo pack for summer season",
    discount: 25,
    soldCount: 1890,
    offers: ["Save 25%"],
    category: "outdoor",
    type: "combo"
  },
  {
    id: 5,
    name: "Snake Plant, Sansevieria - Air Purifier",
    price: 299,
    originalPrice: 399,
    image: "/lovable-uploads/4569bb5e-341b-40ca-a57d-012a38c41449.png",
    rating: 4.5,
    reviews: 567,
    description: "Low maintenance indoor air purifying plant",
    discount: 25,
    soldCount: 3240,
    offers: ["Best Seller"],
    category: "indoor",
    type: "air-purifying"
  },
  {
    id: 6,
    name: "Fiddle Leaf Fig - Premium Indoor Plant",
    price: 899,
    originalPrice: 1200,
    image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png",
    rating: 4.7,
    reviews: 789,
    description: "Premium decorative indoor plant",
    discount: 25,
    soldCount: 1567,
    offers: ["Premium Quality"],
    category: "indoor",
    type: "decorative"
  }
];

const Shop = () => {
  const [sortBy, setSortBy] = useState("best-selling");
  const [viewAs, setViewAs] = useState("grid");
  const [cart, setCart] = useState<{id: number, quantity: number}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [darkMode, setDarkMode] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("shop_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
      document.documentElement.classList.toggle("dark", JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    let filtered = products;
    
    if (selectedCategory !== "all") {
      filtered = products.filter(product => product.category === selectedCategory);
    }
    
    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered = filtered.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

 const addToCart = (productId: number) => {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  let newCart;

  if (existingItem) {
    newCart = cart.map(item =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    newCart = [
      ...cart,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      }
    ];
  }

  setCart(newCart);
  localStorage.setItem("shop_cart", JSON.stringify(newCart));

  toast({
    title: "Added to Cart",
    description: "Product has been added to your cart successfully!"
  });
};


  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />
      
      {/* Cart Icon and Dark Mode Toggle */}
      <div className="fixed top-20 right-4 z-40 flex flex-col gap-2">
        <Button
          onClick={toggleDarkMode}
          className="bg-primary hover:bg-primary/80 text-primary-foreground rounded-full p-3 shadow-lg"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        <Button
          onClick={() => navigate("/cart")}
          className="text-white rounded-full p-3 shadow-lg relative hover:opacity-90"
          style={{ backgroundColor: '#1A2417' }}
        >
          <ShoppingCart size={20} />
          {getCartItemCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center">
              {getCartItemCount()}
            </Badge>
          )}
        </Button>
      </div>

      <div className="pt-24 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Plants</h2>
              <div className="space-y-2">
                 <Collapsible>
                   <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-muted rounded">
                     <span>Plants by Type</span>
                     <ChevronDown size={16} />
                   </CollapsibleTrigger>
                   <CollapsibleContent className="ml-4 space-y-1">
                     <button 
                       onClick={() => setSelectedCategory("all")}
                       className={`text-sm py-1 w-full text-left ${selectedCategory === "all" ? "text-primary font-semibold" : "text-muted-foreground"}`}
                     >
                       All Plants
                     </button>
                     <button 
                       onClick={() => setSelectedCategory("indoor")}
                       className={`text-sm py-1 w-full text-left ${selectedCategory === "indoor" ? "text-primary font-semibold" : "text-muted-foreground"}`}
                     >
                       Indoor Plants
                     </button>
                     <button 
                       onClick={() => setSelectedCategory("outdoor")}
                       className={`text-sm py-1 w-full text-left ${selectedCategory === "outdoor" ? "text-primary font-semibold" : "text-muted-foreground"}`}
                     >
                       Outdoor Plants
                     </button>
                   </CollapsibleContent>
                 </Collapsible>
                
                <div className="text-muted-foreground p-2">Plants by Season</div>
                <div className="text-muted-foreground p-2">Plants by Location</div>
                <div className="text-muted-foreground p-2">Foliage Plants</div>
                <div className="text-muted-foreground p-2">Flowering Plants</div>
                <div className="text-muted-foreground p-2">Plants by Features Uses</div>
                <div className="text-muted-foreground p-2">Plants by Color</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Filters</h3>
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-muted rounded">
                  <span>Product type</span>
                  <ChevronDown size={16} />
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-2 space-y-2">
                  <div className="text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>Combo Packs - Plants (209)</span>
                    </label>
                  </div>
                  <div className="text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>Plants (2706)</span>
                    </label>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div>
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-muted rounded">
                  <span>Availability</span>
                  <ChevronDown size={16} />
                </CollapsibleTrigger>
              </Collapsible>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-muted-foreground">Sort by</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best-selling">Best selling</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">View as</span>
                <div className="flex border rounded">
                  <Button
                    variant={viewAs === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewAs("grid")}
                    className={`rounded-r-none ${viewAs === "grid" ? "bg-primary text-primary-foreground" : ""}`}
                  >
                    <div className="grid grid-cols-2 gap-1 w-4 h-4">
                      <div className="bg-current w-1 h-1 rounded-sm"></div>
                      <div className="bg-current w-1 h-1 rounded-sm"></div>
                      <div className="bg-current w-1 h-1 rounded-sm"></div>
                      <div className="bg-current w-1 h-1 rounded-sm"></div>
                    </div>
                  </Button>
                  <Button
                    variant={viewAs === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewAs("list")}
                    className={`rounded-l-none ${viewAs === "list" ? "bg-primary text-primary-foreground" : ""}`}
                  >
                    <div className="space-y-1 w-4 h-4">
                      <div className="bg-current w-4 h-0.5 rounded-sm"></div>
                      <div className="bg-current w-4 h-0.5 rounded-sm"></div>
                      <div className="bg-current w-4 h-0.5 rounded-sm"></div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${viewAs === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {product.discount && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white z-10">
                        SALE
                      </Badge>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-contain bg-muted"
                    />
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold" style={{ color: '#1A2417' }}>₹ {product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      
                      <h3 className="font-medium text-foreground line-clamp-2">{product.name}</h3>
                      
                      <div className="flex items-center space-x-1">
                        {renderStars(product.rating)}
                        <span className="text-sm text-muted-foreground ml-2">{product.reviews} reviews</span>
                      </div>
                      
                      {product.offers && product.offers.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-pink-500 rounded"></div>
                          <span className="text-sm text-muted-foreground">{product.offers[0]}</span>
                        </div>
                      )}
                      
                      {product.soldCount && (
                        <div className="flex items-center space-x-1 text-orange-500">
                          <span className="text-sm">🔥 {product.soldCount}+ Sold in 30 days</span>
                        </div>
                      )}
                      
                      <Button
                        onClick={() => addToCart(product.id)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white mt-3"
                      >
                        Add to cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;