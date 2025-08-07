import React from 'react';

interface Incident {
  date: string;
  description: string;
  month?: string;
  year?: string;
  fullDate?: string;
}

interface IncidentsSectionProps {
  incidents: any[];
  onChange: (incidents: any[]) => void;
  disabled?: boolean;
}

export const IncidentsSection: React.FC<IncidentsSectionProps> = ({ incidents, onChange }) => {
  const handleIncidentChange = (index: number, field: keyof Incident, value: string) => {
    const updated = incidents.map((incident, i) =>
      i === index ? { ...incident, [field]: value } : incident
    );
    onChange(updated);
  };

  const handleAddIncident = () => {
    onChange([
      ...incidents,
      { date: '', description: '', month: '', year: '', fullDate: '' }
    ]);
  };

  const handleRemoveIncident = (index: number) => {
    const updated = incidents.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-6 w-full">
      {incidents.map((incident, idx) => (
        <div
          key={idx}
          className="border rounded-xl p-6 bg-white shadow-sm mb-2 transition hover:shadow-md relative w-full"
        >
          
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* Date Section */}
            <div className="max-w-xs min-w-[180px] w-full md:w-60">
              <label htmlFor={`incident-date-mode-${idx}`} className="block text-sm font-semibold text-gray-800 mb-2 tracking-wide">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4 text-black-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3M16 7V3M4 11H20M5 21H19A2 2 0 0021 19V7A2 2 0 0019 5H5A2 2 0 003 7V19A2 2 0 005 21Z" /></svg>
                  Date
                </span> 
              </label>
              <div className="flex items-center gap-2 mb-3">
                <button
                  id={`incident-date-mode-${idx}`}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs bg-[#D6A767] font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm ${
                    incident.date === 'full-date'
                      ? 'text-white '
                      : ' text-white hover:bg-[#c49655]'
                  }`}
                  onClick={() =>
                    handleIncidentChange(
                      idx,
                      'date',
                      incident.date === 'full-date' ? 'month-year' : 'full-date'
                    )
                  }
                  aria-label="Toggle date input mode"
                >
                  {incident.date !== 'full-date' ? (
                    <>
                      <span className="inline-flex items-center gap-1">
                        
                        Full Date
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1">
                        
                        Month & Year
                      </span>
                    </>
                  )}
                </button>
              </div>
              {incident.date !== 'full-date' && (
                <div className="flex gap-2">
                  <select
                    className="w-32 rounded-lg border-gray-300 text-sm focus:ring-blue-400 focus:border-blue-400 h-10 bg-gray-50"
                    value={incident.month || ''}
                    onChange={e => handleIncidentChange(idx, 'month', e.target.value)}
                    aria-label="Select month"
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="w-24 rounded-lg border-gray-300 text-sm focus:ring-blue-400 focus:border-blue-400 h-10 bg-gray-50"
                    placeholder="Year"
                    min={1900}
                    max={2100}
                    value={incident.year || ''}
                    onChange={e => handleIncidentChange(idx, 'year', e.target.value)}
                    aria-label="Enter year"
                  />
                </div>
              )}
              {incident.date === 'full-date' && (
                <div>
                  <input
                    type="date"
                    className="input-style focus-gold w-36 max-w-xs h-10 text-sm rounded-lg border-gray-300 bg-gray-50"
                    style={{ minWidth: '140px' }}
                    value={incident.fullDate || ''}
                    onChange={e => handleIncidentChange(idx, 'fullDate', e.target.value)}
                    aria-label="Select full date"
                  />
                </div>
              )}
            </div>
            {/* Description Section */}
            <div className="flex-1 flex flex-col">
              <label htmlFor={`incident-description-${idx}`} className="block text-sm font-semibold text-gray-800 mb-2 tracking-wide">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4 text-black-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 16h8M8 12h8M8 8h8M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6" /></svg>
                  Description
                </span>
              </label>
              <textarea
                id={`incident-description-${idx}`}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400 text-sm bg-gray-50 resize-none p-2"
                value={incident.description}
                onChange={e => handleIncidentChange(idx, 'description', e.target.value)}
                rows={3}
                placeholder="Describe the incident details..."
                aria-label="Incident description"
                style={{ minHeight: '60px' }}
              />
            </div>
            
            {/* Remove Button - absolutely positioned top right */}
            <button
              type="button"
              className="absolute top-4 right-4 flex items-center gap-1 text-red-600 hover:text-white hover:bg-red-500 border border-red-200 bg-red-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              onClick={() => handleRemoveIncident(idx)}
              aria-label="Remove incident"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="w-full border-2 border-dashed border-blue-300 rounded-lg py-3 text-blue-700 hover:bg-blue-50 text-sm font-semibold transition-colors"
        onClick={handleAddIncident}
        aria-label="Add new incident"
      >
        + Add Incident
      </button>
    </div>
  );
};
