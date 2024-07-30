import AddEditMovieForm from "@/components/AddEditMovieForm/AddEditMovieForm";
import React from "react";
interface Props {
  params: {
    id: string;
  };
}
function page({ params: { id } }: Props) {
  return (
    <div>
      <AddEditMovieForm edit={true} id={id} />
    </div>
  );
}

export default page;
