import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Camera, Heart, MessageCircle, Share2, Leaf } from "lucide-react";
import GlobalNavigation from "@/components/GlobalNavigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  author: string;
  date: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
}

const PlantBlog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: "1",
      author: "Pramita Chakraborty",
      date: "9/26/2024, 11:47:15 AM",
      content: "Amla (Indian Gooseberry) and Ginseng are both renowned for their medicinal properties and have been used in traditional medicine for centuries. Amla: Amla is a rich source of Vitamin C, antioxidants, and essential nutrients. It is commonly used in Ayurveda for boosting immunity, improving digestion, and promoting healthy skin and hair. Amla also supports heart health, enhances liver function, and can aid in reducing blood sugar levels. Ginseng: Ginseng, particularly Panax ginseng (Asian) and American ginseng, is prized in traditional Chinese and Korean medicine. It is known for its adaptogenic properties, which help the body manage stress. Ginseng is also used to enhance energy levels, boost cognitive function, improve immunity, and support overall vitality. Both Amla and Ginseng are natural supplements that promote wellness and have wide-ranging health benefits.",
      images: [],
      likes: 24,
      comments: 8
    }
  ]);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (selectedImages.length + files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }
    setSelectedImages([...selectedImages, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const onSubmit = (data: { content: string }) => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      author: "You",
      date: new Date().toLocaleString(),
      content: data.content,
      images: selectedImages.map(file => URL.createObjectURL(file)),
      likes: 0,
      comments: 0
    };
    
    setBlogPosts([newPost, ...blogPosts]);
    reset();
    setSelectedImages([]);
    toast.success("Plant story shared successfully! 🌱");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ABC8A2' }}>
      <GlobalNavigation />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Leaf size={32} style={{ color: '#1A2417' }} />
              <h1 className="text-3xl font-bold" style={{ color: '#1A2417' }}>Plant Community Blog</h1>
            </div>
            <p className="text-gray-600">Share your plant experiences with the community</p>
          </div>

          {/* Share Your Plant Story Form */}
          <Card className="mb-8 shadow-lg border-0 bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl" style={{ color: '#1A2417' }}>Share Your Plant Story</CardTitle>
              <p className="text-gray-600 text-sm">Share your experiences with the community</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Image Upload Area */}
                <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{ borderColor: '#1A2417', backgroundColor: 'rgba(171, 200, 162, 0.3)' }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Camera className="mx-auto mb-4" size={48} style={{ color: '#1A2417' }} />
                    <p className="font-medium mb-2" style={{ color: '#1A2417' }}>Add Photos (Max 3)</p>
                    <p className="text-sm text-gray-500">Click to upload plant images</p>
                  </label>
                </div>

                {/* Preview Selected Images */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Text Area */}
                <div>
                  <Textarea
                    {...register("content", { required: "Please share your plant story" })}
                    placeholder="Share your thoughts about your favorite plants, their benefits, care tips, or any interesting experiences..."
                    className="min-h-[120px]"
                    style={{ borderColor: '#1A2417' }}
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1">{errors.content.message as string}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full text-white py-3 rounded-lg font-medium hover:opacity-90"
                  style={{ backgroundColor: '#1A2417' }}
                >
                  Share Post 🌱
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Blog Posts Feed */}
          <div className="space-y-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="shadow-lg border-0 bg-white overflow-hidden">
                <CardContent className="p-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar style={{ backgroundColor: '#1A2417' }}>
                      <AvatarFallback className="text-white font-bold">
                        {post.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-800">{post.author}</h3>
                      <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post Images */}
                  {post.images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-500">
                        <Heart size={16} className="mr-1" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
                        <MessageCircle size={16} className="mr-1" />
                        {post.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-500">
                      <Share2 size={16} className="mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantBlog;