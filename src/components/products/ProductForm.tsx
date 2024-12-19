import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ComponentHeader from "../../shared/ComponentHeader";
import RedStar from "../../shared/RedStar";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  createProduct,
  setProductById,
  editProduct,
} from "../../redux/products/productSlice";
import { Product } from "../../types/Shopping";
import { toast } from "react-toastify";
import { clearError, resetProduct } from "../../redux/products/productSlice";
import Loading from "../../shared/Loading";
import { useLocation } from "react-router-dom";
import { fetchAllCategories } from "../../redux/categories/categorySlice";
import { MinusIcon } from "@heroicons/react/20/solid";

// Validation schema for the product form
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters")
    .max(50, "Product name must be at most 50 characters"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(1, "Price must be at least $1"),
  stock: yup
    .number()
    .required("Stock is required")
    .positive("Stock must be a positive number")
    .min(1, "Stock must be at least 1"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  images: yup
    .array()
    .of(
      yup
        .string()
        .url("Each image URL must be valid")
        .required("Image URL is required")
    )
    .required("At least one image URL is required"),
  categoryId: yup.string().required("Category is required"),
});

const ProductForm: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.categories);
  const [initialProductId, setInitialProductId] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<string>(""); // Track new image URL input
  const location = useLocation();

  // if categories are empty, fetch them
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchAllCategories());
    }
  }, []);

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setInitialProductId(location.pathname.split("/").pop() || null);
    } else {
      dispatch(resetProduct());
      setInitialProductId(null);
      setValue("name", "");
      setValue("price", 0);
      setValue("description", "");
      setValue("images", []);
      setValue("categoryId", "");
    }
  }, [location]);

  useEffect(() => {
    if (initialProductId) {
      dispatch(setProductById(initialProductId));
    }
  }, [initialProductId]);

  const {
    product: initialProduct,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<Product>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialProduct?.name || "",
      price: initialProduct?.price || 0,
      stock: initialProduct?.stock || 0,
      description: initialProduct?.description || "",
      images: initialProduct?.images || [],
      categoryId: initialProduct?.categoryId || "",
    },
  });

  // Watch images array for changes
  const watchImages = watch("images");

  useEffect(() => {
    if (initialProduct) {
      setValue("name", initialProduct.name);
      setValue("price", initialProduct.price);
      setValue("stock", initialProduct.stock);
      setValue("description", initialProduct.description);
      setValue("images", initialProduct.images);
      setValue("categoryId", initialProduct.categoryId);
    }
  }, [initialProduct, setValue]);

  useEffect(() => {
    if (error && error.length > 0) {
      toast.error(error);
      return () => {
        dispatch(clearError());
      };
    }
  }, [error]);

  // Handle form submission
  const onSubmit = (data: Product) => {
    // Check if images array is empty before submission
    if (!data.images || data.images.length === 0) {
      setError("images", { message: "At least one image URL is required" });
      return;
    }

    if (initialProduct) {
      dispatch(
        editProduct({
          id: initialProductId as string,
          updatedProduct: { id: initialProductId as string, ...data },
        })
      ).then((result) => {
        if (editProduct.fulfilled.match(result)) {
          toast.success("Product updated successfully");
          // Reset the form after successful update
          setValue("name", "");
          setValue("price", 0);
          setValue("stock", 0);
          setValue("description", "");
          setValue("images", []);
          setValue("categoryId", "");
        } else {
          toast.error("Failed to update product");
        }
      });
    } else {
      dispatch(createProduct(data)).then((result) => {
        if (createProduct.fulfilled.match(result)) {
          toast.success("Product added successfully");
          // Reset the form after successful product creation
          setValue("name", "");
          setValue("price", 0);
          setValue("stock", 0);
          setValue("description", "");
          setValue("images", []);
          setValue("categoryId", "");
        }
      });
    }
  };

  // Handle adding a new image URL to the list
  const handleAddImageUrl = () => {
    const isValidImageUrl = (url: string) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    if (newImage) {
      isValidImageUrl(newImage).then((isValid) => {
        if (!isValid) {
          toast.error("Please enter a valid image URL.");
        } else if (watchImages.length >= 5) {
          toast.error("You can only add up to 5 images.");
        } else if (watchImages.includes(newImage)) {
          toast.error("This image URL has already been added.");
        } else {
          // Ensure unique URL
          setValue("images", [...watchImages, newImage]);
        }
        setNewImage(""); // Clear input field after adding or showing error
      });
    }
  };

  return (
    <>
      <ComponentHeader
        heading={initialProduct ? "Edit Product" : "New Product"}
      />
      <div className="p-4 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Product Name */}
          <div className="flex items-center md:gap-60 mb-8">
            <label
              className="text-gray-700 text-sm font-semibold min-w-32 flex items-center"
              htmlFor="name"
            >
              Product Name
              <RedStar />
            </label>
            <input
              id="name"
              type="text"
              placeholder="Product name"
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

          {/* Category */}
          <div className="flex items-center md:gap-60 mb-8">
            <label
              className="text-gray-700 text-sm font-semibold min-w-32 flex items-center"
              htmlFor="categoryId"
            >
              Category
              <RedStar />
            </label>
            <select
              id="categoryId"
              {...register("categoryId")}
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 placeholder:text-sm placeholder:font-normal leading-tight focus:outline-none focus:shadow-outline ${
                errors.categoryId ? "border-red-500" : ""
              }`}
            >
              <option value="" hidden>
                Select Category
              </option>
              {/* Example: */}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-xs italic">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center md:gap-60 mb-8">
            <label
              className="text-gray-700 text-sm font-semibold min-w-32 flex items-center"
              htmlFor="price"
            >
              Price
              <RedStar />
            </label>
            <input
              id="price"
              type="number"
              placeholder="Price"
              {...register("price")}
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 placeholder:text-sm placeholder:font-normal leading-tight focus:outline-none focus:shadow-outline ${
                errors.price ? "border-red-500" : ""
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-xs italic">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center md:gap-60 mb-8">
            <label
              className="text-gray-700 text-sm font-semibold min-w-32 flex items-center"
              htmlFor="stock"
            >
              Stock
              <RedStar />
            </label>
            <input
              id="stock"
              type="number"
              placeholder="Stock"
              {...register("stock")}
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 placeholder:text-sm placeholder:font-normal leading-tight focus:outline-none focus:shadow-outline ${
                errors.stock ? "border-red-500" : ""
              }`}
            />
            {errors.stock && (
              <p className="text-red-500 text-xs italic">
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex items-center md:gap-60 mb-8">
            <label
              className="text-gray-700 text-sm font-semibold min-w-32 flex items-center"
              htmlFor="description"
            >
              Description
              <RedStar />
            </label>
            <textarea
              id="description"
              placeholder="Product description"
              {...register("description")}
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 placeholder:text-sm placeholder:font-normal leading-tight focus:outline-none focus:shadow-outline ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs italic">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Images */}
          <div className="flex items-center md:gap-60 mb-8">
            <label
              className="text-gray-700 text-sm font-semibold min-w-32 flex items-center"
              htmlFor="images"
            >
              Image URLs
              <RedStar />
            </label>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={newImage} // Controlled input value
                  onChange={(e) => {
                    setNewImage(e.target.value);
                    clearErrors("images"); // Clear errors when user types
                  }} // Update state
                  className="border p-2 rounded flex-1"
                />
                <button
                  type="button"
                  className="border p-2 rounded bg-blue-500 text-white"
                  onClick={handleAddImageUrl}
                >
                  +
                </button>
              </div>
              <div>
                {watchImages && watchImages.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {watchImages.map((image: string, index: number) => (
                      <div key={index} className="relative">
                        <img
                          className="h-32 w-32 object-cover rounded-lg shadow-md"
                          src={image}
                          alt={`Product image ${index + 1}`}
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 m-1"
                          onClick={() =>
                            setValue(
                              "images",
                              watchImages.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <MinusIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {errors.images && (
              <p className="text-red-500 text-xs italic">
                {errors.images.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="ml-[23rem] bg-blue-500 hover:bg-blue-400 text-base transition-all duration-300 font-poppins text-white font-bold py-3 px-16 rounded-xl focus:outline-none focus:shadow-outline"
          >
            {loading ? <Loading /> : initialProduct ? "Update" : "Save"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ProductForm;
