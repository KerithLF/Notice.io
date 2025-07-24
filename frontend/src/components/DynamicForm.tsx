import React, { useEffect, useState } from 'react';
import { getLitigationFields } from '../api/notice';
import { Field } from '../types/notice';

interface DynamicFormProps {
  litigationType: string;
  onFieldChange: (fieldName: string, value: string) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ litigationType, onFieldChange }) => {
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const data = await getLitigationFields(litigationType);
        setFields(data);
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };

    if (litigationType) {
      fetchFields();
    }
  }, [litigationType]);

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <input
            type="text"
            id={field.name}
            name={field.name}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;