import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ComponentHeader from "../../shared/ComponentHeader";
import RedStar from "../../shared/RedStar";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  createCategory,
  setCategoryById,
  editCategory,
} from "../../redux/categories/categorySlice";
import { Category } from "../../types/Shopping";
import { toast } from "react-toastify";
import {
  clearError,
  resetCategory,
} from "../../redux/categories/categorySlice";
import Loading from "../../shared/Loading";
import { useLocation } from "react-router-dom";

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

const CategoryForm: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [initialCategoryId, setInitialCategoryId] = useState<string | null>(
    null
  );
  /* if the route is like this http://localhost:5173/dashboard/categories/new, dont set the categoryId
  but if it is like this http://localhost:5173/dashboard/categories/edit/k8WynsKoZRyaSN1mDSMc, then set the categoryId*/
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setInitialCategoryId(location.pathname.split("/").pop() || null);
    } else {
      dispatch(resetCategory());
      setInitialCategoryId(null);
      setValue("name", "");
      setValue("image", "");
    }
  }, [location]);

  // Get the category if the categoryId is set
  useEffect(() => {
    if (initialCategoryId) {
      dispatch(setCategoryById(initialCategoryId));
    }
  }, [initialCategoryId]);

  useEffect(() => {
    return () => {
      dispatch(resetCategory());
    };
  }, []);

  const {
    category: InitialCategory,
    loading,
    error,
  } = useSelector((state: RootState) => state.categories);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<Category>({
    resolver: yupResolver(schema),
    // If the category prop is passed, set default values
    defaultValues: {
      name: InitialCategory?.name || "",
      image: InitialCategory?.image || "",
    },
  });

  const watchImage = watch("image");

  // Effect to populate form values if category is provided (for editing)
  useEffect(() => {
    if (InitialCategory) {
      setValue("name", InitialCategory.name);
      setValue("image", InitialCategory.image);
    }
  }, [InitialCategory, setValue]);

  // Show a toast message if an error occurs
  useEffect(() => {
    if (error && error.length > 0) {
      toast.error(error);

      // Clear the error after showing the toast
      return () => {
        dispatch(clearError()); // Clear the error message when the component is unmounted
      };
    }
  }, [error]);

  // Handle form submission
  const onSubmit = (data: Category) => {
    if (InitialCategory) {
      dispatch(
        editCategory({
          id: initialCategoryId as string,
          updatedCategory: { id: initialCategoryId as string, ...data },
        })
      ).then((result) => {
        if (editCategory.fulfilled.match(result)) {
          toast.success("Category updated successfully");
          setValue("name", "");
          setValue("image", "");
        } else {
          toast.error("Failed to update category");
        }
      });
    } else {
      dispatch(createCategory(data)).then((result) => {
        if (createCategory.fulfilled.match(result)) {
          toast.success("Category added successfully");
          setValue("name", "");
          setValue("image", "");
        }
      });
    }
  };

  return (
    <>
      <ComponentHeader
        heading={InitialCategory ? "Edit Category" : "New Category"}
      />
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

          {watchImage && (
            <div className="w-fit justify-self-center mb-8 ">
              <img className="mx-auto h-32 w-32" src={watchImage} alt="asdf" />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="ml-[23rem] bg-blue-500 hover:bg-blue-400 text-base transition-all duration-300 font-poppins text-white font-bold py-3 px-16 rounded-xl focus:outline-none focus:shadow-outline"
          >
            {loading ? <Loading /> : InitialCategory ? "Update" : "Save"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CategoryForm;
