import { useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface ImageProps {
  files: any[];
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>;
  setErrors: (value: React.SetStateAction<Partial<any>>) => void;
  errors: Partial<any>;
}

const ImageDropZone = ({
  files,
  setFiles,
  setIsModified,
  setErrors,
  errors,
}: ImageProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },

    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ["image"]: "Only one image can be uploaded at a time.",
        }));
        return;
      }

      acceptedFiles.forEach((file) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
          // if (
          //   img.width >= 200 &&
          //   img.height >= 200 &&
          //   img.width <= 1000 &&
          //   img.height <= 1000
          // ) {
          //   if (errors.image) {
          //     setErrors((prevErrors) => ({
          //       ...prevErrors,
          //       ["image"]: "",
          //     }));
          //   }
          setFiles(
            acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
          );
          //   setIsModified(true);
          // } else {
          //   setErrors((prevErrors) => ({
          //     ...prevErrors,
          //     ["image"]:
          //       "Image dimensions must be between 200x200 and 1000x1000 pixels.",
          //   }));
          // }
        };
        return file;
      });
    },
  });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-500 bg-[#224957] rounded-lg p-6 flex items-center justify-center w-full h-96"
    >
      <input {...getInputProps()} />
      <div className="flex justify-center pb-2">
        {/* <Images className="w-10 h-10 text-blue-500" /> */}
      </div>

      <p className="pt-1 text-md font-normal">Drop an Image here</p>
    </div>
  );
};

export default ImageDropZone;
