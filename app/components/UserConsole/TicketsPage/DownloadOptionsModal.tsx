"use client";
import React from "react";
import Button from "@/app/components/ui/button";
import { DialogWrapper } from "../../Dialog/DialogWrapper";

interface DownloadOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (selectedFields: string[]) => void;
  availableFields: string[];
  selectedFields: string[];
  setSelectedFields: (fields: string[]) => void;
  isDownloading: boolean;
}

const DownloadOptionsModal: React.FC<DownloadOptionsModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  availableFields,
  selectedFields,
  setSelectedFields,
  isDownloading,
}) => {
  if (!isOpen) return null;

  const handleCheckboxChange = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFields.length === availableFields.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields(availableFields);
    }
  };

  return (
    <DialogWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Select Fields to Download"
      containerClass="!bg-dark-grey-2"
      titleClass="!text-white"
    >
      {/* <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-dark-grey-2 p-6 rounded-lg w-full max-w-md"> */}
      {/* <h3 className="text-white text-xl mb-4">Select Fields to Download</h3> */}
      <div className="mb-4 w-fit">
        <label className="flex items-center text-white cursor-pointer w-fit hover:opacity-80">
          <input
            type="checkbox"
            checked={selectedFields.length === availableFields.length}
            onChange={handleSelectAll}
            className="mr-2 accent-primary-color"
          />
          Select All
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {availableFields.map((field) => (
          <label
            key={field}
            className="flex items-center text-white cursor-pointer w-fit"
          >
            <input
              type="checkbox"
              checked={selectedFields.includes(field)}
              onChange={() => handleCheckboxChange(field)}
              className="mr-2 accent-primary-color"
            />
            {field}
          </label>
        ))}
      </div>
      <div className="flex justify-end gap-4">
        <Button onClick={onClose} className="text-white hover:bg-slate-500">
          Cancel
        </Button>
        <Button
          onClick={() => onDownload(selectedFields)}
          isLoading={isDownloading}
          disabled={isDownloading || selectedFields.length === 0}
          className="bg-primary-color text-white w-fit hover:!text-primary-color"
        >
          Download
        </Button>
      </div>
      {/* </div>
      </div> */}
    </DialogWrapper>
  );
};

export default DownloadOptionsModal;
