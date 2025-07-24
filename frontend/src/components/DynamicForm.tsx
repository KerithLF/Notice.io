import React, { useState } from "react";
import { NoticeData } from "../types/notice";
import { TemplateSelector } from "./TemplateSelector";
import { AIRecommendations } from "./AIRecommendations";
import { IncidentsSection } from "./IncidentsSection";

interface DynamicFormProps {
  onSubmit: (data: NoticeData) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<NoticeData>({
    litigationType: "",
    tone: "formal",
    subject: "",
    issueDate: "",
    issueMonth: "", // <-- add
    issueYear: "", // <-- add
    problemDate: "",
    noticePeriod: "",
    totalAmount: "",
    senderName: "",
    senderAddress: "",
    senderTitle: "",
    senderCompany: "",
    senderMail: "", // <-- add
    senderPhone: "", // <-- add
    recipientName: "",
    recipientAddress: "",
    recipientMail: "", // <-- add
    recipientPhone: "", // <-- add
    recipientTitle: "",
    recipientCompany: "",
    signature: "",
    caseDescription: "",
    customFields: {},
    selectedTemplate: "",
  });
  const [issueDateMode, setIssueDateMode] = useState<
    "full-date" | "month-year"
  >("full-date");

  const litigationTypes = [
    { value: "civil", label: "Civil Litigation" },
    { value: "criminal", label: "Criminal Litigation" },
    { value: "family", label: "Family Law" },
    { value: "corporate", label: "Corporate Law" },
    { value: "property", label: "Property Dispute" },
    { value: "employment", label: "Employment Law" },
  ];

  const tones = [
    { value: "formal", label: "Formal" },
    { value: "casual", label: "Casual" },
    { value: "stern", label: "Stern" },
    { value: "diplomatic", label: "Diplomatic" },
  ];

  const getDynamicFields = () => {
    switch (formData.litigationType) {
      case "civil":
        return [
          { key: "plaintiff", label: "Plaintiff Name", type: "text" },
          { key: "defendant", label: "Defendant Name", type: "text" },
          { key: "claimAmount", label: "Claim Amount", type: "number" },
        ];
      case "criminal":
        return [
          { key: "accused", label: "Accused Name", type: "text" },
          { key: "crimeType", label: "Type of Crime", type: "text" },
          { key: "policeStation", label: "Police Station", type: "text" },
        ];
      case "family":
        return [
          { key: "petitioner", label: "Petitioner Name", type: "text" },
          { key: "respondent", label: "Respondent Name", type: "text" },
          { key: "marriageDate", label: "Marriage Date", type: "date" },
        ];
      case "corporate":
        return [
          { key: "companyName", label: "Company Name", type: "text" },
          { key: "breachType", label: "Breach Type", type: "text" },
          { key: "contractDate", label: "Contract Date", type: "date" },
        ];
      case "property":
        return [
          { key: "propertyAddress", label: "Property Address", type: "text" },
          { key: "propertyType", label: "Property Type", type: "text" },
          { key: "disputeNature", label: "Nature of Dispute", type: "text" },
        ];
      case "employment":
        return [
          { key: "employer", label: "Employer Name", type: "text" },
          { key: "employee", label: "Employee Name", type: "text" },
          { key: "terminationDate", label: "Termination Date", type: "date" },
        ];
      default:
        return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Set issueDate based on mode before submit
    let submitData = { ...formData };
    if (issueDateMode === "month-year") {
      submitData.issueDate =
        formData.issueMonth && formData.issueYear
          ? `${formData.issueYear}-${formData.issueMonth}`
          : "";
    }
    onSubmit(submitData);
  };

  const handleCustomFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [key]: value,
      },
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setFormData((prev) => ({ ...prev, selectedTemplate: templateId }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm w-full m-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">
          Notice Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Litigation Type and Tone in a row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Litigation Type
              </label>
              <select
                value={formData.litigationType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    litigationType: e.target.value,
                  }))
                }
                className="input-style focus-gold w-full"
                required
              >
                <option value="">Select litigation type</option>
                {litigationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                value={formData.tone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tone: e.target.value }))
                }
                className="input-style focus-gold w-full"
              >
                {tones.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Issue Date & Subject in a row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            {/* Issue Date Field with toggle */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date
              </label>
              <button
                type="button"
                className={`mb-2 px-2 py-1 rounded-md text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  issueDateMode === "full-date"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-blue-700 border-blue-300 hover:bg-blue-50"
                }`}
                onClick={() =>
                  setIssueDateMode((mode) =>
                    mode === "full-date" ? "month-year" : "full-date"
                  )
                }
                aria-label="Toggle issue date input mode"
              >
                {issueDateMode === "full-date"
                  ? "Switch to Month & Year"
                  : "Switch to Full Date"}
              </button>
              {issueDateMode === "full-date" ? (
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      issueDate: e.target.value,
                    }))
                  }
                  className="input-style focus-gold w-full h-10"
                  placeholder="dd-mm-yyyy"
                  required
                />
              ) : (
                <div className="flex gap-2">
                  <select
                    className="flex-1 rounded-md border-gray-300 text-sm focus:ring-blue-400 focus:border-blue-400 h-10"
                    value={(formData.issueMonth as string) || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        issueMonth: e.target.value,
                      }))
                    }
                    aria-label="Select month"
                    required
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option
                        key={i + 1}
                        value={String(i + 1).padStart(2, "0")}
                      >
                        {new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="flex-1 rounded-md border-gray-300 text-sm focus:ring-blue-400 focus:border-blue-400 h-10"
                    placeholder="Year"
                    min={1900}
                    max={2100}
                    value={(formData.issueYear as string) || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        issueYear: e.target.value,
                      }))
                    }
                    aria-label="Enter year"
                    required
                  />
                </div>
              )}
            </div>
            {/* Subject Field */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <div className="mb-2 invisible">placeholder</div>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                className="input-style focus-gold w-full h-11"
                placeholder="Enter the subject of your legal notice"
                required
              />
            </div>
          </div>

          {/* Sender Details */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sender Details
            </label>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
              <div className="flex flex-row gap-2 items-center">
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      senderName: e.target.value,
                    }))
                  }
                  className="input-style focus-gold w-40 h-8 text-sm"
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  value={formData.senderAddress}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      senderAddress: e.target.value,
                    }))
                  }
                  className="input-style focus-gold w-56 h-8 text-sm"
                  placeholder="Address"
                  required
                />
                <input
                  type="text"
                  value={formData.senderMail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      senderMail: e.target.value,
                    }))
                  }
                  className="input-style focus-gold w-44 h-8 text-sm"
                  placeholder="Email"
                  required
                />
                <input
                  type="tel"
                  value={formData.senderPhone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      senderPhone: e.target.value.replace(/[^0-9]/g, "").slice(0, 15), // allow only digits, max 15 digits
                    }))
                  }
                  className="input-style focus-gold w-36 h-8 text-sm"
                  placeholder="Mobile Number"
                  pattern="[0-9]{10,15}"
                  inputMode="numeric"
                  required
                />
              </div>
            </div>
          </div>

          {/* Recipient Details */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Details
            </label>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
              <div className="flex flex-row gap-2 items-center">
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recipientName: e.target.value,
                    }))
                  }
                  className="input-style focus-gold w-40 h-8 text-sm"
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  value={formData.recipientAddress}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recipientAddress: e.target.value,
                    }))
                  }
                  className="input-style focus-gold w-56 h-8 text-sm"
                  placeholder="Address"
                  required
                />
                <input
                  type="text"
                  value={formData.recipientMail || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recipientMail: e.target.value,
                    }))
                  }
                  className="input-style focus-gold w-44 h-8 text-sm"
                  placeholder="Email"
                  required
                />
                <input
                  type="tel"
                  value={formData.recipientPhone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recipientPhone: e.target.value.replace(/[^0-9]/g, "").slice(0, 15),
                    }))
                  }
                  className="input-style focus-gold w-36 h-8 text-sm"
                  placeholder="Mobile Number"
                  pattern="[0-9]{10,15}"
                  inputMode="numeric"
                  required
                />
              </div>
            </div>
          </div>

          {/* Council Details */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Council Details
            </label>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
              <div className="flex flex-row gap-2 items-center">
                <input
                  type="text"
                  value={formData.councilName || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      councilName: e.target.value,
                    }))
                  }
                  className="input-style focus-gold w-40 h-8 text-sm"
                  placeholder="Council Name"
                  required
                />
                <input
                  type="text"
                  value={formData.councilAddress || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      councilAddress: e.target.value,
                    }))
                  }
                  className="input-style focus-gold w-56 h-8 text-sm"
                  placeholder="Council Address"
                  required
                />
                <input
                  type="text"
                  value={formData.councilMail || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      councilMail: e.target.value,
                    }))
                  }
                  className="input-style focus-gold w-44 h-8 text-sm"
                  placeholder="Council Email"
                  required
                />
                <input
                  type="tel"
                  value={formData.councilPhone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      councilPhone: e.target.value.replace(/[^0-9]/g, "").slice(0, 15),
                    }))
                  }
                  className="input-style focus-gold w-36 h-8 text-sm"
                  placeholder="Council Mobile Number"
                  pattern="[0-9]{10,15}"
                  inputMode="numeric"
                  required
                />
              </div>
            </div>
          </div>

          {/* Incidents Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incidents
            </label>
            <IncidentsSection
              incidents={
                formData.customFields &&
                Array.isArray(formData.customFields.incidents) &&
                formData.customFields.incidents.length > 0
                  ? formData.customFields.incidents
                  : [
                      { description: "" },
                      { description: "" },
                      { description: "" },
                    ]
              }
              onChange={(incidents) =>
                setFormData((prev) => ({
                  ...prev,
                  customFields: {
                    ...(prev.customFields || {}),
                    incidents,
                  },
                }))
              }
            />
          </div>

          {/* Dynamic Fields */}
          {getDynamicFields().map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                value={String(formData.customFields?.[field.key] ?? "")}
                onChange={(e) =>
                  handleCustomFieldChange(field.key, e.target.value)
                }
                className="input-style focus-gold"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            </div>
          ))}

          <button type="submit" className="w-full btn-primary">
            Generate Notice
          </button>
        </form>
      </div>

      <TemplateSelector
        selectedTemplate={formData.selectedTemplate || ""}
        onTemplateSelect={handleTemplateSelect}
        litigationType={formData.litigationType}
      />

      <AIRecommendations
        formData={formData}
        selectedTemplate={formData.selectedTemplate || ""}
      />
    </div>
  );
};
