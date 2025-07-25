import React, { useEffect, useState } from "react";
import { NoticeData, Field } from "../types/notice";
import { TemplateSelector } from "./TemplateSelector";
import { AIRecommendations } from "./AIRecommendations";
import { IncidentsSection } from "./IncidentsSection";
import { getLitigationFields } from '../api/notice';

interface DynamicFormProps {
  onFieldChange: (fieldName: string, value: string) => void;
  litigation_type: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ onFieldChange, litigation_type }) => {
  const [dynamicFields, setDynamicFields] = useState<Field[]>([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        if (litigation_type) {
          const data = await getLitigationFields(litigation_type);
          setDynamicFields(data);
        }
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };

      fetchFields();
  }, [litigation_type]);

  return (
    <div className="space-y-4">
      {dynamicFields.map((field) => (
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
