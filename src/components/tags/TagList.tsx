import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ComponentHeader from "../../shared/ComponentHeader";
import { FaEdit, FaTrash, FaRegEye } from "react-icons/fa"; // Importing icons
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { fetchAllTags, removeTag } from "../../redux/tags/tagSlice"; // Updated imports for tags
import { Tag } from "../../types/Shopping"; // Updated for Tag
import { toast } from "react-toastify";
import { clearError } from "../../redux/tags/tagSlice"; // Updated for tags
import Loading from "../../shared/Loading";
import Swal from "sweetalert2";

const TagList: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { tags, loading, error } = useSelector(
    (state: RootState) => state.tags // Accessing tags state instead of categories
  );

  // Fetch tags when the component mounts
  useEffect(() => {
    if (tags.length === 0) {
      dispatch(fetchAllTags());
    }
  }, [dispatch, tags.length]);

  // Show a toast message if an error occurs
  useEffect(() => {
    if (error && error.length > 0) {
      toast.error(error);

      // Clear the error after showing the toast
      return () => {
        dispatch(clearError()); // Clear the error message when the component is unmounted
      };
    }
  }, [error, dispatch]);

  // Handle deletion of a tag with confirmation
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeTag(id))
          .then(() => {
            Swal.fire("Deleted!", "Your tag has been deleted.", "success");
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was an error deleting the tag.",
              "error"
            );
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your tag is safe :)", "error");
      } else {
        Swal.fire("Cancelled", "Your tag is safe :)", "error");
      }
    });
  };

  // Handle the editing of a tag
  const handleEdit = (tag: Tag) => {
    // Navigate to the edit page
    navigate(`edit/${tag.id}`, {
      state: { tag }, // Passing the tag data to the edit page
    });
  };

  // Handle the viewing of a tag
  const handleView = (tag: Tag) => {
    Swal.fire({
      imageWidth: 400,
      imageHeight: 300,
      imageAlt: tag.name,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      padding: 0,
    });
  };

  if (loading) {
    return (
      <div>
        <ComponentHeader heading="Tag List" />
        <div className="p-4 flex justify-center bg-white rounded-lg shadow-md">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <>
      <ComponentHeader heading="Tag List" />
      <div className="p-4 bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-50 text-left text-base font-semibold text-gray-900 w-1/3">
                Tag Name
              </th>
              <th className="px-4 py-2 bg-gray-50 text-left text-base font-semibold text-gray-900 w-1/4">
                Items Count
              </th>
              <th className="px-4 py-2 bg-gray-50 text-left text-base font-semibold text-gray-900 w-1/4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag, index) => {
              const rowClass = index % 2 === 0 ? "bg-gray-100" : "bg-white";

              return (
                <tr
                  key={index}
                  className={`${rowClass} hover:bg-gray-200`} // Add hover effect here
                >
                  <td className="py-2 px-4 w-1/3">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 font-medium">
                        {tag.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4 w-1/4">
                    <span className="text-base text-gray-700 font-medium">
                      0 {/* Assuming Items count is static or can be derived */}
                    </span>
                  </td>
                  <td className="py-2 px-4 w-1/4">
                    <div className="flex space-x-2 justify-start">
                      {/* Eye Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="View Image"
                        onClick={() => handleView(tag)} // Passing tag to the view handler
                        className="flex items-center px-3 py-1.5 text-sm text-gray-500 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <FaRegEye />
                      </button>

                      {/* Edit Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Edit"
                        onClick={() => handleEdit(tag)} // Passing tag to the edit handler
                        className="flex items-center px-3 py-1.5 text-sm text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>

                      {/* Delete Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Delete"
                        onClick={() => tag.id && handleDelete(tag.id)}
                        className="flex items-center px-3 py-1.5 text-sm text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Tooltip
          id="my-tooltip"
          style={{
            backgroundColor: "#d1d5db",
            color: "#374151",
            borderRadius: "0.25rem",
            padding: "0.5rem",
            fontWeight: "500",
          }}
        />
      </div>
    </>
  );
};

export default TagList;
