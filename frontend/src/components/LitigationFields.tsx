import React from 'react';

interface LitigationFieldsProps {
  litigationType: string;
  onChange: (name: string, value: string) => void;
  values: Record<string, string>;
}

export const LitigationFields: React.FC<LitigationFieldsProps> = ({
  litigationType,
  onChange,
  values
}) => {
  const renderFields = () => {
    switch (litigationType) {
      case 'Employment Law':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Name
              </label>
              <input
                type="text"
                name="employee_name"
                value={values.employee_name || ''}
                onChange={(e) => onChange('employee_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employer Name
              </label>
              <input
                type="text"
                name="employer_name"
                value={values.employer_name || ''}
                onChange={(e) => onChange('employer_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Period
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="employment_start"
                  value={values.employment_start || ''}
                  onChange={(e) => onChange('employment_start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="date"
                  name="employment_end"
                  value={values.employment_end || ''}
                  onChange={(e) => onChange('employment_end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
              </div>
            </div>
          </>
        );

      case 'Property':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Address
              </label>
              <textarea
                name="property_address"
                value={values.property_address || ''}
                onChange={(e) => onChange('property_address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="property_type"
                value={values.property_type || ''}
                onChange={(e) => onChange('property_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                required
              >
                <option value="">Select property type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="agricultural">Agricultural</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dispute Type
              </label>
              <select
                name="dispute_type"
                value={values.dispute_type || ''}
                onChange={(e) => onChange('dispute_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                required
              >
                <option value="">Select dispute type</option>
                <option value="ownership">Ownership Dispute</option>
                <option value="boundary">Boundary Dispute</option>
                <option value="tenancy">Tenancy Dispute</option>
                <option value="trespassing">Trespassing</option>
              </select>
            </div>
          </>
        );

      case 'Civil':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plaintiff Name
              </label>
              <input
                type="text"
                name="plaintiff_name"
                value={values.plaintiff_name || ''}
                onChange={(e) => onChange('plaintiff_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Defendant Name
              </label>
              <input
                type="text"
                name="defendant_name"
                value={values.defendant_name || ''}
                onChange={(e) => onChange('defendant_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Claim Amount
              </label>
              <input
                type="number"
                name="claim_amount"
                value={values.claim_amount || ''}
                onChange={(e) => onChange('claim_amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                required
              />
            </div>
          </>
        );

      case 'Criminal':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complainant Name
              </label>
              <input
                type="text"
                name="complainant_name"
                value={values.complainant_name || ''}
                onChange={(e) => onChange('complainant_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accused Name
              </label>
              <input
                type="text"
                name="accused_name"
                value={values.accused_name || ''}
                onChange={(e) => onChange('accused_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Police Station
              </label>
              <input
                type="text"
                name="police_station"
                value={values.police_station || ''}
                onChange={(e) => onChange('police_station', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                FIR Number (if any)
              </label>
              <input
                type="text"
                name="fir_number"
                value={values.fir_number || ''}
                onChange={(e) => onChange('fir_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderFields()}
    </div>
  );
}; 