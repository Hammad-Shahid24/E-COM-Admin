import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { fetchAllTags, clearError } from "../../redux/tags/tagSlice";
import { editProduct } from "../../redux/products/productSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { RxCross2, RxCheck } from "react-icons/rx";
import Loading from "../../shared/Loading";
import { Product } from "../../types/Shopping";

interface ProductActionsModalProps {
  onClose: () => void;
}

const ProductActionsModal: FC<ProductActionsModalProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tags, loading, error } = useSelector(
    (state: RootState) => state.tags
  );
  const { product } = useSelector((state: RootState) => state.products);

  // State
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  useEffect(() => {
    if (tags.length === 0) {
      dispatch(fetchAllTags());
    }
  }, [dispatch, tags.length]);

  useEffect(() => {
    if (error && error.length > 0) {
      toast.error("An error occurred while fetching tags.", {
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [error]);

  // Toggle tag selection (add/remove tags)
  const handleTagClick = (tagName: string) => {
    setSelectedTags(
      (prevSelectedTags) =>
        prevSelectedTags.includes(tagName)
          ? prevSelectedTags.filter((tag) => tag !== tagName) // Unselect
          : [...prevSelectedTags, tagName] // Select
    );
  };

  // Validation for start date: must be ahead of the current date and time
  const handleStartDateChange = (date: Date | null) => {
    if (date && date <= new Date()) {
      toast.info("Start time must be in the future.", {
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      setStartDate(date);
    }
  };

  // Validation for expiry date: must be ahead of the start date and time
  const handleExpiryDateChange = (date: Date | null) => {
    if (date && startDate && date <= startDate) {
      toast.info("Expiry time must be after the start time.", {
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      setExpiryDate(date);
    }
  };

  // Validation for discount percentage
  const handleSubmit = async () => {
    if (discountPercentage <= 0 || discountPercentage > 100) {
      toast.error("Discount percentage must be between 1 and 100.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    if (!startDate) {
      toast.error("Please select a valid start date and time.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    if (!expiryDate) {
      toast.error("Please select a valid expiry date and time.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    try {
      if (!product) {
        toast.error("Product not found.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }

      console.log("Product", product);
      console.log("Selected Tags", selectedTags);
      console.log("Start Date", startDate);
      console.log("Expiry Date", expiryDate);

      await dispatch(
        editProduct({
          id: product.id as string,
          updatedProduct: {
            ...product,
            tags: selectedTags,
            discountStartDate: startDate,
            discountExpiryDate: expiryDate,
            discountPercentage,
          },
        })
      ).unwrap();

      toast.success("Product updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      onClose();
    } catch (error) {
      toast.error("Failed to update product. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/5 mx-auto font-poppins">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Tags Section */}
          <div className="flex flex-col items-center w-full md:w-1/2 gap-y-4">
            <h3 className="text-xl font-semibold mb-4">Set Tags</h3>
            {loading ? (
              <Loading />
            ) : (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className={`px-2 h-12 flex items-center bg-white justify-center border-2 cursor-pointer text-sm font-medium rounded-lg transition-all duration-300 ${
                      selectedTags.includes(tag.name)
                        ? "border-blue-500 text-gray-800 shadow-md" // Selected: Blue border, tick icon
                        : "border-gray-300 text-gray-600 hover:border-blue-200" // Unselected: Gray border, cross icon
                    }`}
                    onClick={() => handleTagClick(tag.name)}
                  >
                    <span className="mr-2">
                      {selectedTags.includes(tag.name) ? (
                        <RxCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <RxCross2 className="h-4 w-4 text-red-500" />
                      )}
                    </span>
                    <span>{tag.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date-Time Pickers Section */}
          <div className="flex flex-col items-center w-full md:w-1/2 gap-y-4">
            <h3 className="text-xl font-semibold mb-4">Set Sale</h3>

            {/* Sale Start Time Picker */}
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Set Start Date & Time
              </label>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="Pp"
                placeholderText="Pick a start date and time"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Sale Expiry Date Picker */}
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Set Expiry Date & Time
              </label>
              <DatePicker
                disabled={!startDate}
                selected={expiryDate}
                onChange={handleExpiryDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="Pp"
                placeholderText="Pick an expiry date and time"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Discount Percentage Input */}
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Set Discount Percentage
              </label>
              <input
                type="number"
                value={discountPercentage}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (isNaN(value)) {
                    setDiscountPercentage(0);
                  } else if (value > 100) {
                    setDiscountPercentage(100);
                  } else if (value < 0) {
                    setDiscountPercentage(0);
                  } else {
                    setDiscountPercentage(value);
                  }
                }}
                placeholder="Enter a discount percentage"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>

        {/* Submit and Close Buttons */}
        <div className="flex justify-end mt-6 gap-x-4">
          <button
            onClick={onClose}
            className="py-2 px-4 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="py-2 px-6 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductActionsModal;
