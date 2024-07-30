import AddEditMovieForm from "@/components/AddEditMovieForm/AddEditMovieForm";
import React from "react";

function page() {
  return (
    <div>
      <AddEditMovieForm edit={false} id={null} />
    </div>
  );
}

export default page;
