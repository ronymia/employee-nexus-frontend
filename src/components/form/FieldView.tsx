interface FieldViewProps {
  label: string;
  value: string | number | null;
}

const FieldView: React.FC<FieldViewProps> = ({ label, value }) => {
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <strong>{label}:</strong> <span>{value ?? "-"}</span>
    </div>
  );
};

export default FieldView;
