import { FC } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import RedStar from "../../shared/RedStar";

// Define the input form data types
interface EditCategoryProps {
  category: {
    id: string;
    name: string;
    imageUrl: string;
  };
  onSave: (data: CategoryFormInputs) => void;
}

interface CategoryFormInputs {
  name: string;
  imageUrl: string;
}

// Validation Schema using yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .min(3, "Category name must be at least 3 characters")
    .max(50, "Category name must be at most 50 characters"),
  imageUrl: yup
    .string()
    .required("Image URL is required")
    .url("Must be a valid URL"),
});

const EditCategory: FC<EditCategoryProps> = ({ category, onSave }) => {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: category.name,
      imageUrl: category.imageUrl,
    },
  });

  // Handle the form submission
  const onSubmit = (data: CategoryFormInputs) => {
    onSave(data);
    Swal.fire({
      icon: "success",
      title: "Category Updated",
      text: "The category has been updated successfully.",
    });
  };

  // Modal for editing the category

  const openModal = () => {
    Swal.fire({
      title: "Edit Category",
      html: (
        <div className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Category Name Field */}
            <div className="flex flex-col">
              <label
                className="text-gray-700 text-sm font-bold mb-2 flex items-center"
                htmlFor="name"
              >
                Category Name <RedStar />
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs italic">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Image URL Field */}
            <div className="flex flex-col">
              <label
                className="text-gray-700 text-sm font-bold mb-2 flex items-center"
                htmlFor="imageUrl"
              >
                Image URL <RedStar />
              </label>
              <input
                id="imageUrl"
                type="text"
                {...register("imageUrl")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.imageUrl ? "border-red-500" : ""
                }`}
              />
              {errors.imageUrl && (
                <p className="text-red-500 text-xs italic">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </form>
        </div>
      ),
      showConfirmButton: false,
      preConfirm: () => {
        // This ensures the form is handled properly inside the modal
        return true;
      },
    });
  };

  return (
    <button
      onClick={openModal}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Edit Category
    </button>
  );
};

export default EditCategory;
