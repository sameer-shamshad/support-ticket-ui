'use client';
import { TicketPriority } from "@/types";
import Modal from "@/components/ui/Modal";
import { useState, type FormEvent } from "react";

type CreateTicketFormValues = {
  title: string;
  requester: string;
  email: string;
  priority: TicketPriority;
  description: string;
};

type CreateTicketFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTicketFormValues) => void;
};

const defaultValues: CreateTicketFormValues = {
  title: "",
  requester: "",
  email: "",
  priority: "normal",
  description: "",
};

const CreateTicketForm = ({ isOpen, onClose, onSubmit }: CreateTicketFormProps) => {
  const [formValues, setFormValues] = useState(defaultValues);

  const resetForm = () => setFormValues(defaultValues);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formValues);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Create New Ticket
        </h2>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 transition"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <TextField
          label="Subject"
          value={formValues.title}
          onChange={(value) =>
            setFormValues((prev) => ({ ...prev, title: value }))
          }
          required
        />
        <TextField
          label="Requester Name"
          value={formValues.requester}
          onChange={(value) =>
            setFormValues((prev) => ({ ...prev, requester: value }))
          }
          required
        />
        <TextField
          label="Email"
          type="email"
          value={formValues.email}
          onChange={(value) =>
            setFormValues((prev) => ({ ...prev, email: value }))
          }
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={formValues.priority}
            onChange={(event) =>
              setFormValues((prev) => ({
                ...prev,
                priority: event.target.value as TicketPriority,
              }))
            }
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formValues.description}
            onChange={(event) =>
              setFormValues((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            rows={3}
            required
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition"
          >
            Create Ticket
          </button>
        </div>
      </form>
    </Modal>
  );
};

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
};

const TextField = ({ label, value, onChange, type = "text", required = false }: TextFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type={type}
      required={required}
      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

export default CreateTicketForm;