import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ComponentHeader from "../../shared/ComponentHeader";
import RedStar from "../../shared/RedStar";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  createTag,
  setTagById,
  editTag,
  clearError,
  resetTag,
} from "../../redux/tags/tagSlice";
import { Tag } from "../../types/Shopping";
import { toast } from "react-toastify";
import Loading from "../../shared/Loading";
import { useLocation } from "react-router-dom";

// Validation schema for the form
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Tag name is required")
    .min(3, "Tag name must be at least 3 characters")
    .max(50, "Tag name must be at most 50 characters"),
});

const TagForm: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [initialTagId, setInitialTagId] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setInitialTagId(location.pathname.split("/").pop() || null);
    } else {
      dispatch(resetTag());
      setInitialTagId(null);
      setValue("name", "");
    }
  }, [location]);

  // Get the tag if the tagId is set
  useEffect(() => {
    if (initialTagId) {
      dispatch(setTagById(initialTagId));
    }
  }, [initialTagId]);

  useEffect(() => {
    return () => {
      dispatch(resetTag());
    };
  }, []);

  const {
    tag: InitialTag,
    loading,
    error,
  } = useSelector((state: RootState) => state.tags);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Tag>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: InitialTag?.name || "",
    },
  });

  // Effect to populate form values if tag is provided (for editing)
  useEffect(() => {
    if (InitialTag) {
      setValue("name", InitialTag.name);
    }
  }, [InitialTag, setValue]);

  // Show a toast message if an error occurs
  useEffect(() => {
    if (error && error.length > 0) {
      toast.error(error);

      // Clear the error after showing the toast
      return () => {
        dispatch(clearError());
      };
    }
  }, [error]);

  // Handle form submission
  const onSubmit = (data: Tag) => {
    console.log("b");
    if (InitialTag) {
      dispatch(
        editTag({
          id: initialTagId as string,
          updatedTag: { id: initialTagId as string, ...data },
        })
      ).then((result) => {
        if (editTag.fulfilled.match(result)) {
          toast.success("Tag updated successfully");
          setValue("name", "");
        } else {
          toast.error("Failed to update tag");
        }
      });
    } else {
      dispatch(createTag(data)).then((result) => {
        if (createTag.fulfilled.match(result)) {
          toast.success("Tag added successfully");
          setValue("name", "");
        }
      });
    }
  };

  return (
    <>
      <ComponentHeader heading={InitialTag ? "Edit Tag" : "New Tag"} />
      <div className="p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Tag Name Field */}
          <div className="flex items-center justify-between mb-6">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-gray-700 min-w-[120px] flex items-center"
            >
              Tag Name
              <RedStar />
            </label>
            <div className="flex-1">
              <input
                id="name"
                type="text"
                placeholder="Enter tag name (e.g., 'New Release')"
                {...register("name")}
                className={`w-full py-2 px-4 border rounded text-gray-700 placeholder:text-sm placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all ${
                  errors.name
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs italic text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-400 text-white text-base font-bold py-2 px-8 rounded-lg transition-all duration-300 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50"
            >
              {loading ? <Loading /> : InitialTag ? "Update Tag" : "Create Tag"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TagForm;
