import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // Importing the X icon

function LegalDocuments({ selectedRequest }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to handle the click event and open the modal
  const handleImageClick = (doc) => {
    setSelectedImage(doc); // Set the clicked image as the selected image
    setIsModalOpen(true);  // Open the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null); // Clear the selected image when closing the modal
  };

  // Function to handle outside click to close the modal
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      handleCloseModal();
    }
  };

  return (
    <div className="mt-2 py-5">
      <h2 className="py-5">
        <strong>III. Legal Documents</strong>
      </h2>
      <div className="py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedRequest.legal_docs && selectedRequest.legal_docs.length > 0 ? (
          selectedRequest.legal_docs.map((doc, index) => (
            <img
              key={index}
              src={doc}
              alt={`Legal Document ${index + 1}`}
              className="w-full h-auto rounded-lg cursor-pointer" // Add pointer cursor for clickable effect
              onClick={() => handleImageClick(doc)} // Handle click event
            />
          ))
        ) : (
          <p>No legal documents available</p>
        )}
      </div>

      {/* Modal for displaying the clicked image */}
      {isModalOpen && selectedImage && (
        <div
          className="modal-overlay fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleOutsideClick} // Close when clicking outside the image
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected Legal Document"
              className="max-h-[80vh] w-auto" // Adjusted height for better fit
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-[-2.5rem] right-[-3.5rem] p-2 bg-white text-black rounded-full"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LegalDocuments;
