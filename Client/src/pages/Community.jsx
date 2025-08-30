import React, { useEffect, useState } from "react";
import { dummyPublishedImages } from "../assets/assets";
import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";

const Community = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios } = useAppContext();

  const fetchImages = async () => {
    try {
      const { data } = await axios.get("/api/user/published-images");
      if (data.success) {
        setImages(data.images);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full overflow-y-scroll">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-purple-100">
        Community Images
      </h2>
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((item, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden"
            >
              {/* Image */}
              <img
                src={item.imageUrl}
                alt="images"
                className="w-full aspect-square object-cover 
                   transition-transform duration-300 
                   group-hover:scale-105"
              />

              {/* Overlay with text */}
              <div
                className="absolute bottom-0 left-0 w-full 
                   bg-gradient-to-t from-black/70 to-transparent 
                   text-white text-sm px-3 py-2 
                   opacity-0 group-hover:opacity-100 
                   transition-opacity duration-300"
              >
                Created by: {item.userName}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No Images Found!</div>
      )}
    </div>
  );
};

export default Community;
