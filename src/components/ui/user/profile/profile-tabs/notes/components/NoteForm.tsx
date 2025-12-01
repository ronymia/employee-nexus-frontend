"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomSelect from "@/components/form/input/CustomSelect";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";

interface IUser {
  id: number;
  email: string;
  profile?: {
    fullName: string;
  };
}

interface INote {
  id: number;
  userId: number;
  user?: IUser;
  createdBy: number;
  creator?: IUser;
  title: string;
  content: string;
  category?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NoteFormProps {
  userId: number;
  note?: INote;
  actionType: "create" | "update";
  onClose: () => void;
}

export default function NoteForm({
  userId,
  note,
  actionType,
  onClose,
}: NoteFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Note Form Submit:", {
      ...data,
      userId,
      actionType,
    });
    // TODO: Implement GraphQL mutation
    onClose();
  };

  const defaultValues = {
    title: note?.title || "",
    content: note?.content || "",
    category: note?.category || "",
    isPrivate: note?.isPrivate ?? true,
  };

  const categoryOptions = [
    { label: "General", value: "General" },
    { label: "Performance", value: "Performance" },
    { label: "Incident", value: "Incident" },
    { label: "Feedback", value: "Feedback" },
  ];

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <div className="space-y-4">
        {/* Note Information */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Note Information
          </h4>
          <div className="space-y-4">
            <CustomInputField
              dataAuto="title"
              name="title"
              label="Note Title"
              placeholder="Enter note title"
              type="text"
              required={true}
            />

            <CustomSelect
              dataAuto="category"
              name="category"
              label="Category"
              placeholder="Select category"
              required={false}
              isLoading={false}
              options={categoryOptions}
            />

            <CustomTextareaField
              dataAuto="content"
              name="content"
              label="Note Content"
              placeholder="Enter note content..."
              required={true}
              rows={6}
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Privacy Settings
          </h4>
          <div className="space-y-4">
            {/* Private Toggle */}
            <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-base-content">
                  Private Note
                </label>
                <p className="text-xs text-base-content/60 mt-1">
                  Only you and authorized personnel can view this note
                </p>
              </div>
              <ToggleSwitch name="isPrivate" />
            </div>

            <div className="alert alert-info text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                Private notes are only visible to managers and HR personnel.
                Public notes can be viewed by the employee.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <FormActionButton isPending={false} cancelHandler={onClose} />
      </div>
    </CustomForm>
  );
}
