type SectionProps = {
  title: string;
  fields: { label: string; value?: string }[];
};

const ProfileSection = ({ title, fields }: SectionProps) => {
  return (
    <div className="flex flex-col gap-2 text-xl w-full">
      <div className="text-3xl font-semibold">{title}</div>
      {fields.map(
        (field, idx) =>
          field.value && (
            <div key={idx} className="flex gap-1">
              <span className="font-semibold">{field.label}:</span>
              <span>{field.value}</span>
            </div>
          )
      )}
    </div>
  );
};

export default ProfileSection;