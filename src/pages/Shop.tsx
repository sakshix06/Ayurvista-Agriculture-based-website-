import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ShoppingCart, Heart, Search, X, Plus, Minus, Trash2, ShieldCheck, RefreshCw, Truck, Sparkles, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

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

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const Shop = () => {
  const [sortBy, setSortBy] = useState("best-selling");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number>(1500);
  const [availability, setAvailability] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shop_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const savedWish = localStorage.getItem("shop_wishlist");
    if (savedWish) {
      setWishlist(JSON.parse(savedWish));
    }
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let filtered = products;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(product => product.type === selectedType);
    }

    filtered = filtered.filter(product => product.price <= priceRange);

    if (availability === "in-stock") {
      // All are in stock in mock data
      filtered = filtered.filter(product => (product.soldCount || 0) < 6000);
    } else if (availability === "out-of-stock") {
      filtered = filtered.filter(product => (product.soldCount || 0) >= 6000);
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered = [...filtered].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedType, sortBy, priceRange, availability, searchQuery]);

  const syncCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("shop_cart", JSON.stringify(newCart));
  };

  const addToCart = (productId: number, qtyToAdd = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + qtyToAdd }
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
          quantity: qtyToAdd
        }
      ];
    }

    syncCart(newCart);
    setIsCartDrawerOpen(true);

    toast({
      title: "Added to Cart",
      description: `${product.name} added to your cart successfully!`
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    const updated = cart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter((item): item is CartItem => item !== null);

    syncCart(updated);
  };

  const removeItem = (productId: number) => {
    const updated = cart.filter(item => item.id !== productId);
    syncCart(updated);
    toast({
      title: "Item Removed",
      description: "Product removed from cart."
    });
  };

  const toggleWishlist = (productId: number) => {
    let updated;
    if (wishlist.includes(productId)) {
      updated = wishlist.filter(id => id !== productId);
      toast({
        title: "Removed from Wishlist",
        description: "Product removed from your wishlist."
      });
    } else {
      updated = [...wishlist, productId];
      toast({
        title: "Added to Wishlist",
        description: "Product added to your wishlist."
      });
    }
    setWishlist(updated);
    localStorage.setItem("shop_wishlist", JSON.stringify(updated));
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Free delivery threshold: ₹500
  const freeDeliveryThreshold = 500;
  const subtotal = getSubtotal();
  const deliveryLeft = freeDeliveryThreshold - subtotal;
  const freeDeliveryProgress = Math.min((subtotal / freeDeliveryThreshold) * 100, 100);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}
      />
    ));
  };

  // Recommended Products array for Drawer
  const recommendedProducts = [
    { id: 7, name: "Ashwagandha", price: 149, image: "/lovable-uploads/4569bb5e-341b-40ca-a57d-012a38c41449.png" },
    { id: 8, name: "Giloy Plant", price: 190, image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png" },
    { id: 9, name: "Mint Plant", price: 145, image: "/lovable-uploads/57676f3f-fcca-4be2-83f5-99907f0f3068.png" }
  ];

  return (
    <div className="min-h-screen bg-[#070E08] text-[#E2ECE9] font-sans pb-12">
      <GlobalNavigation />

      {/* Floating Cart Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsCartDrawerOpen(true)}
          className="bg-[#1D3D18] border border-[#2D6A4F] hover:bg-[#2D6A4F] text-[#a8e063] rounded-full p-4 h-14 w-14 shadow-[0_4px_20px_rgba(26,52,22,0.6)] relative transition-all duration-300 hover:scale-110"
        >
          <ShoppingCart size={24} />
          {getCartItemCount() > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center border-2 border-[#070E08]">
              {getCartItemCount()}
            </span>
          )}
        </Button>
      </div>

      <div className="pt-28 container mx-auto px-4">
        {/* Main Content Row */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-64 space-y-6 flex-shrink-0 bg-[#111F10]/75 border border-[#1E351B] p-6 rounded-2xl backdrop-blur-md">
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-[#a8e063] mb-4 border-b border-[#1E351B] pb-2">Categories</h2>
              <div className="space-y-1">
                {[
                  { id: "all", label: "All Plants" },
                  { id: "indoor", label: "Indoor Plants" },
                  { id: "outdoor", label: "Outdoor Plants" }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? "bg-[#1D3D18] text-[#a8e063] font-bold border-l-2 border-[#a8e063]"
                        : "text-[#95A5A0] hover:text-[#E2ECE9] hover:bg-[#111F10]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-[#a8e063] mb-4 border-b border-[#1E351B] pb-2">Plant Type</h2>
              <div className="space-y-1">
                {[
                  { id: "all", label: "All Types" },
                  { id: "air-purifying", label: "Air Purifier" },
                  { id: "flowering", label: "Flowering" },
                  { id: "combo", label: "Combo Packs" },
                  { id: "decorative", label: "Decorative" }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                      selectedType === type.id
                        ? "bg-[#1D3D18] text-[#a8e063] font-bold border-l-2 border-[#a8e063]"
                        : "text-[#95A5A0] hover:text-[#E2ECE9] hover:bg-[#111F10]"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#95A5A0]">Price Range</h3>
                <span className="text-[#a8e063] font-semibold text-xs bg-[#1D3D18] px-2 py-0.5 rounded">
                  Up to ₹{priceRange}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-[#1E351B] rounded-lg appearance-none cursor-pointer accent-[#a8e063]"
              />
              <div className="flex justify-between text-xs text-[#95A5A0] mt-1.5">
                <span>₹100</span>
                <span>₹1500</span>
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#95A5A0] mb-3">Availability</h3>
              <div className="space-y-2">
                {[
                  { id: "all", label: "All Products" },
                  { id: "in-stock", label: "In Stock" },
                  { id: "out-of-stock", label: "Out of Stock" }
                ].map(status => (
                  <label key={status.id} className="flex items-center space-x-3 cursor-pointer group text-sm text-[#95A5A0] hover:text-[#E2ECE9]">
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === status.id}
                      onChange={() => setAvailability(status.id)}
                      className="rounded border-[#1E351B] text-[#a8e063] focus:ring-0 bg-[#070E08] w-4 h-4 accent-[#a8e063]"
                    />
                    <span>{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[#1E351B] space-y-4 text-xs text-[#95A5A0]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#111F10] text-[#a8e063]">
                  <ShieldCheck size={16} />
                </div>
                <span>100% Secure Checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#111F10] text-[#a8e063]">
                  <RefreshCw size={16} />
                </div>
                <span>Easy 7-Day Returns</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#111F10] text-[#a8e063]">
                  <Truck size={16} />
                </div>
                <span>Free Shipping &gt; ₹500</span>
              </div>
            </div>
          </div>

          {/* Main Grid area */}
          <div className="flex-1 space-y-6">
            
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#111F10]/40 border border-[#1E351B] p-4 rounded-2xl backdrop-blur-md">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#95A5A0]" size={16} />
                <input
                  type="text"
                  placeholder="Search for herbs, plants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#070E08] border border-[#1E351B] rounded-xl pl-10 pr-4 py-2 text-sm text-[#E2ECE9] placeholder-[#95A5A0] focus:outline-none focus:border-[#2D6A4F] transition-all"
                />
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-sm text-[#95A5A0] whitespace-nowrap">Sort By</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 bg-[#070E08] border-[#1E351B] text-[#E2ECE9] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111F10] border-[#1E351B] text-[#E2ECE9]">
                    <SelectItem value="best-selling" className="hover:bg-[#1D3D18]/40 focus:bg-[#1D3D18]/40">Best Selling</SelectItem>
                    <SelectItem value="price-low" className="hover:bg-[#1D3D18]/40 focus:bg-[#1D3D18]/40">Price: Low to High</SelectItem>
                    <SelectItem value="price-high" className="hover:bg-[#1D3D18]/40 focus:bg-[#1D3D18]/40">Price: High to Low</SelectItem>
                    <SelectItem value="rating" className="hover:bg-[#1D3D18]/40 focus:bg-[#1D3D18]/40">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden bg-[#111F10]/95 border-[#1E351B] text-[#E2ECE9] shadow-xl group transition-all duration-300 hover:shadow-[0_10px_30px_rgba(26,52,22,0.4)] hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden bg-[#070E08]/60 p-4 aspect-square flex items-center justify-center border-b border-[#1E351B]">
                    {/* Sale Badge */}
                    {product.discount && (
                      <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded">
                        {product.discount}% OFF
                      </Badge>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-[#111F10]/80 border border-[#1E351B] text-[#95A5A0] hover:text-[#a8e063] hover:border-[#a8e063] transition-all z-10"
                    >
                      <Heart
                        size={16}
                        className={wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}
                      />
                    </button>

                    {/* Product Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-44 object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-xl font-extrabold text-[#a8e063]">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-[#95A5A0] line-through">₹{product.originalPrice}</span>
                        )}
                      </div>

                      <h3 className="font-bold text-base line-clamp-1 group-hover:text-[#a8e063] transition-colors">{product.name}</h3>
                      <p className="text-xs text-[#95A5A0] line-clamp-2 leading-relaxed">{product.description}</p>

                      <div className="flex items-center gap-1.5 pt-1">
                        <div className="flex">{renderStars(product.rating)}</div>
                        <span className="text-[10px] text-[#95A5A0] font-semibold">({product.reviews} reviews)</span>
                      </div>

                      {product.soldCount && (
                        <div className="flex items-center gap-1 text-[11px] text-orange-400 font-bold bg-orange-950/20 px-2 py-0.5 rounded w-max mt-1.5">
                          <Flame size={12} className="fill-orange-400" />
                          <span>{product.soldCount}+ Sold</span>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => addToCart(product.id)}
                      className="w-full bg-[#1D3D18] border border-[#2D6A4F] text-[#a8e063] hover:bg-[#a8e063] hover:text-[#070E08] font-bold rounded-xl mt-5 transition-all"
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-20 bg-[#111F10]/20 border border-[#1E351B] rounded-2xl p-6">
                  <Sparkles className="h-10 w-10 text-[#a8e063] mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-[#E2ECE9]">No products found</h3>
                  <p className="text-[#95A5A0] text-sm mt-1">Try adjusting your filters or search query.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer Slide-Over */}
      <AnimatePresence>
        {isCartDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsCartDrawerOpen(false)}
            />

            {/* Slider Panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="w-screen max-w-md bg-[#0B150A] border-l border-[#1E351B] text-[#E2ECE9] flex flex-col justify-between shadow-2xl"
              >
                {/* Header */}
                <div className="p-6 border-b border-[#1E351B] flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-[#a8e063]" />
                    My Cart ({getCartItemCount()})
                  </h2>
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="p-1.5 rounded-lg bg-[#111F10] border border-[#1E351B] text-[#95A5A0] hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  {/* Free Shipping Alert & Progress */}
                  <div className="bg-[#111F10] border border-[#1E351B] p-4 rounded-xl space-y-2">
                    {deliveryLeft > 0 ? (
                      <p className="text-xs text-[#95A5A0] font-semibold flex items-center gap-1.5">
                        <Truck size={14} className="text-[#a8e063]" />
                        You are <span className="text-[#a8e063] font-bold">₹{deliveryLeft}</span> away from <span className="text-[#a8e063] font-bold">FREE delivery</span>
                      </p>
                    ) : (
                      <p className="text-xs text-[#a8e063] font-bold flex items-center gap-1.5">
                        <Truck size={14} className="text-[#a8e063]" />
                        Yay! You've unlocked FREE delivery! 🎉
                      </p>
                    )}
                    <div className="w-full h-2 bg-[#070E08] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#2D6A4F] to-[#a8e063] transition-all duration-500"
                        style={{ width: `${freeDeliveryProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#95A5A0]">
                      <span>₹0</span>
                      <span>₹500 for Free Delivery</span>
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 bg-[#111F10]/50 border border-[#1E351B] p-3 rounded-xl hover:bg-[#111F10] transition-colors"
                      >
                        <div className="w-16 h-16 rounded-lg bg-[#070E08] border border-[#1E351B] p-2 flex items-center justify-center flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-[#E2ECE9] truncate">{item.name}</h4>
                            <p className="text-xs text-[#a8e063] font-semibold mt-0.5">₹{item.price}</p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-[#1E351B] rounded-lg bg-[#070E08]">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 text-[#95A5A0] hover:text-[#a8e063] transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-2 text-xs font-bold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 text-[#95A5A0] hover:text-[#a8e063] transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-500 p-1 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {cart.length === 0 && (
                      <div className="text-center py-12 text-[#95A5A0]">
                        <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Your cart is currently empty.</p>
                      </div>
                    )}
                  </div>

                  {/* Recommended Herbs section */}
                  <div className="pt-6 border-t border-[#1E351B] space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#95A5A0]">You may also like</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {recommendedProducts.map((rec) => (
                        <div
                          key={rec.id}
                          className="bg-[#111F10]/50 border border-[#1E351B] p-2.5 rounded-xl text-center flex flex-col justify-between"
                        >
                          <img src={rec.image} alt={rec.name} className="h-12 w-12 object-contain mx-auto mb-2" />
                          <h4 className="text-[10px] font-bold truncate text-[#E2ECE9]">{rec.name}</h4>
                          <p className="text-[11px] font-semibold text-[#a8e063] mt-0.5">₹{rec.price}</p>
                          <Button
                            onClick={() => addToCart(rec.id, 1)}
                            className="w-full bg-[#1D3D18]/70 hover:bg-[#a8e063] hover:text-[#070E08] text-[#a8e063] text-[10px] font-bold h-6 px-1 rounded-md mt-2 transition-all"
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer summary & buttons */}
                <div className="p-6 border-t border-[#1E351B] bg-[#111F10]/40 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#95A5A0]">Total Amount</span>
                    <span className="text-xl font-extrabold text-[#a8e063]">₹{subtotal}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="bg-transparent hover:bg-[#111F10] border border-[#1E351B] text-[#95A5A0] hover:text-[#E2ECE9] rounded-xl font-bold py-2.5"
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      disabled={cart.length === 0}
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigate("/checkout");
                      }}
                      className="bg-[#1D3D18] hover:bg-[#a8e063] hover:text-[#070E08] border border-[#2D6A4F] text-[#a8e063] rounded-xl font-bold py-2.5 shadow-lg transition-all"
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;