import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ComponentHeader from "../../shared/ComponentHeader";
import RedStar from "../../shared/RedStar";

// Define the input schema
interface CategoryFormInputs {
  name: string;
  image: string;
}

// Validation schema for the form
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .min(3, "Category name must be at least 3 characters")
    .max(50, "Category name must be at most 50 characters"),
  image: yup
    .string()
    .required("Image URL is required")
    .url("Image URL must be a valid URL"),
});

// Define the props for the component
interface NewCategoryProps {
  category?: {
    id: string;
    name: string;
    image: string;
  };
  onSubmit?: (data: CategoryFormInputs) => void;
}

const NewCategory: FC<NewCategoryProps> = ({
  category = null,
  onSubmit = () => {},
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormInputs>({
    resolver: yupResolver(schema),
    // If the category prop is passed, set default values
    defaultValues: {
      name: category?.name || "",
      image: category?.image || "",
    },
  });

  // Effect to populate form values if category is provided (for editing)
  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("image", category.image);
    }
  }, [category, setValue]);

  return (
    <>
      <ComponentHeader heading={category ? "Edit Category" : "New Category"} />
      <div className="p-4 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Category Name */}
          <div className="flex items-center gap-60 mb-8">
            <label
              className=" text-gray-700 text-sm font-semibold min-w-32 flex items-center"
              htmlFor="name"
            >
              Category Name
              <RedStar />
            </label>
            <input
              id="name"
              type="text"
              placeholder="Category name"
              {...register("name")}
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 placeholder:text-sm placeholder:font-normal leading-tight focus:outline-none focus:shadow-outline ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className="flex items-center gap-60 mb-8">
            <label
              className=" text-gray-700 text-sm font-semibold min-w-32 flex items-center"
              htmlFor="image"
            >
              Image URL
              <RedStar />
            </label>
            <input
              id="image"
              type="text"
              placeholder="https://remosnextjs.vercel.app/images/products/57.png"
              {...register("image")}
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 placeholder:text-sm placeholder:font-normal leading-tight focus:outline-none focus:shadow-outline ${
                errors.image ? "border-red-500" : ""
              }`}
            />
            {errors.image && (
              <p className="text-red-500 text-xs italic">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="ml-[23rem] bg-blue-500 hover:bg-blue-400 text-base transition-all duration-300 font-poppins text-white font-bold py-3 px-16 rounded-xl focus:outline-none focus:shadow-outline"
          >
            {category ? "Update Category" : "Save Category"}
          </button>
        </form>
      </div>
    </>
  );
};

export default NewCategory;
