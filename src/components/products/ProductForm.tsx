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
    .max(80, "Product name must be at most 50 characters"),
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
      <div className="p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Product Name */}
          <div className="flex items-center justify-between mb-6">
            <label
              htmlFor="name"
              className="text-gray-700 text-sm font-semibold min-w-[120px] flex items-center"
            >
              Product Name
              <RedStar />
            </label>
            <div className="flex-1">
              <input
                id="name"
                type="text"
                placeholder="Enter product name"
                {...register("name")}
                className={`w-full py-2 px-4 border rounded text-gray-700 placeholder:text-sm focus:outline-none focus:shadow-md transition-all ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between mb-6">
            <label
              htmlFor="categoryId"
              className="text-gray-700 text-sm font-semibold min-w-[120px] flex items-center"
            >
              Category
              <RedStar />
            </label>
            <div className="flex-1">
              <select
                id="categoryId"
                {...register("categoryId")}
                className={`w-full py-2 px-4 border rounded text-gray-700 focus:outline-none focus:shadow-md transition-all ${
                  errors.categoryId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" hidden>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-6">
            <label
              htmlFor="price"
              className="text-gray-700 text-sm font-semibold min-w-[120px] flex items-center"
            >
              Price
              <RedStar />
            </label>
            <div className="flex-1">
              <input
                id="price"
                type="number"
                placeholder="Enter price"
                {...register("price")}
                className={`w-full py-2 px-4 border rounded text-gray-700 focus:outline-none focus:shadow-md transition-all ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center justify-between mb-6">
            <label
              htmlFor="stock"
              className="text-gray-700 text-sm font-semibold min-w-[120px] flex items-center"
            >
              Stock
              <RedStar />
            </label>
            <div className="flex-1">
              <input
                id="stock"
                type="number"
                placeholder="Enter stock quantity"
                {...register("stock")}
                className={`w-full py-2 px-4 border rounded text-gray-700 focus:outline-none focus:shadow-md transition-all ${
                  errors.stock ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex items-center justify-between mb-6">
            <label
              htmlFor="description"
              className="text-gray-700 text-sm font-semibold min-w-[120px] flex items-center"
            >
              Description
              <RedStar />
            </label>
            <div className="flex-1">
              <textarea
                id="description"
                placeholder="Enter product description"
                {...register("description")}
                className={`w-full py-2 px-4 border rounded text-gray-700 focus:outline-none focus:shadow-md transition-all ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="flex items-center justify-between mb-6">
            <label
              htmlFor="images"
              className="text-gray-700 text-sm font-semibold min-w-[120px] flex items-center"
            >
              Image URLs
              <RedStar />
            </label>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={newImage}
                  onChange={(e) => {
                    setNewImage(e.target.value);
                    clearErrors("images");
                  }}
                  className="w-full py-2 px-4 border rounded focus:outline-none focus:shadow-md"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="py-1 px-8 rounded bg-blue-500 text-white hover:bg-blue-400"
                >
                  <span className="scale-150 font-bold text-3xl mb-1">+</span>
                </button>
              </div>
              {watchImages && watchImages.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {watchImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="h-32 w-32 object-cover rounded-md shadow"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setValue(
                            "images",
                            watchImages.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.images && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.images.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-400 text-white text-base font-semibold py-2 px-8 rounded-lg transition-all duration-300 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loading /> : initialProduct ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductForm;
