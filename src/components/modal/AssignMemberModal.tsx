import { useState } from "react";
import CustomModal from "@/components/modal/CustomModal";

interface AssignMemberModalProps {
  open: boolean;
  onClose: () => void;
  onAssign: (userId: number, role: string) => void;
  isLoading?: boolean;
}

const MEMBER_ROLES = [
  { value: "Member", label: "Member" },
  { value: "Lead", label: "Lead" },
  { value: "Manager", label: "Manager" },
  { value: "Developer", label: "Developer" },
  { value: "Designer", label: "Designer" },
  { value: "Tester", label: "Tester" },
];

export default function AssignMemberModal({
  open,
  onClose,
  onAssign,
  isLoading = false,
}: AssignMemberModalProps) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [memberRole, setMemberRole] = useState("Member");

  const handleAssign = () => {
    if (!selectedUserId) return;
    onAssign(Number(selectedUserId), memberRole);
    // Reset form
    setSelectedUserId("");
    setMemberRole("Member");
  };

  const handleClose = () => {
    setSelectedUserId("");
    setMemberRole("Member");
    onClose();
  };

  return (
    <CustomModal open={open} onClose={handleClose} title="Assign Member">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            User ID <span className="text-error">*</span>
          </label>
          <input
            type="number"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter user ID"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the ID of the user you want to assign to this project
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Role <span className="text-error">*</span>
          </label>
          <select
            value={memberRole}
            onChange={(e) => setMemberRole(e.target.value)}
            className="select select-bordered w-full"
            disabled={isLoading}
          >
            {MEMBER_ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleClose}
            className="btn btn-outline flex-1"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="btn btn-primary flex-1"
            disabled={isLoading || !selectedUserId}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Assigning...
              </>
            ) : (
              "Assign"
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
