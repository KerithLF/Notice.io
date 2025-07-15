import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Book, Scale, Search } from 'lucide-react';

interface IPCSectionsProps {
  subject?: string;
}

const ipcSections = [
  {
    id: 'section-302',
    title: 'Section 302 - Murder',
    description: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    keywords: ['murder', 'homicide', 'death', 'life imprisonment']
  },
  {
    id: 'section-420',
    title: 'Section 420 - Cheating',
    description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person.',
    keywords: ['cheating', 'fraud', 'dishonesty', 'property']
  },
  {
    id: 'section-498a',
    title: 'Section 498A - Domestic Violence',
    description: 'Husband or relative of husband of a woman subjecting her to cruelty.',
    keywords: ['domestic violence', 'cruelty', 'harassment', 'dowry']
  },
  {
    id: 'section-376',
    title: 'Section 376 - Rape',
    description: 'Whoever commits rape shall be punished with imprisonment of either description for a term which shall not be less than seven years.',
    keywords: ['rape', 'sexual assault', 'consent', 'imprisonment']
  },
  {
    id: 'section-379',
    title: 'Section 379 - Theft',
    description: 'Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years.',
    keywords: ['theft', 'stealing', 'movable property', 'dishonesty']
  },
  {
    id: 'section-406',
    title: 'Section 406 - Criminal Breach of Trust',
    description: 'Whoever commits criminal breach of trust shall be punished with imprisonment of either description for a term which may extend to three years.',
    keywords: ['breach of trust', 'criminal breach', 'entrustment', 'dishonesty']
  }
];

export const IPCSections: React.FC<IPCSectionsProps> = ({ subject = '' }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredSections, setFilteredSections] = React.useState(ipcSections);

  React.useEffect(() => {
    // Filter sections based on search term and subject
    let filtered = ipcSections;
    
    if (searchTerm) {
      filtered = filtered.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Auto-recommend based on subject
    if (subject) {
      const subjectLower = subject.toLowerCase();
      filtered = filtered.sort((a, b) => {
        const aRelevant = a.keywords.some(keyword => 
          subjectLower.includes(keyword.toLowerCase())
        );
        const bRelevant = b.keywords.some(keyword => 
          subjectLower.includes(keyword.toLowerCase())
        );
        
        if (aRelevant && !bRelevant) return -1;
        if (!aRelevant && bRelevant) return 1;
        return 0;
      });
    }
    
    setFilteredSections(filtered);
  }, [searchTerm, subject]);
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Book className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold">IPC Sections</h2>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search IPC sections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D6A767] focus:border-transparent text-sm"
        />
      </div>

      <Droppable droppableId="ipc-sections">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4"
          >
            {filteredSections.map((section, index) => (
              <Draggable key={section.id} draggableId={section.title} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`drag-item p-4 border rounded-lg cursor-move ${
                      snapshot.isDragging
                        ? 'dragging shadow-lg border-[#D6A767] bg-[#E6D0B1]'
                        : 'border-gray-200 hover:border-[#D6A767] hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Scale className="h-4 w-4 text-[#D6A767] mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 mb-1">
                          {section.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          {section.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {section.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-[#E6D0B1] text-xs rounded-full text-[#3C222F]"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Recommendations Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Recommendations</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">SUGGESTION</span>
            <span className="text-gray-600">Add recipient details for clarity</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">ALERT</span>
            <span className="text-gray-600">Check grammar in paragraph 2</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">SUGGESTION</span>
            <span className="text-gray-600">Consider adding a timeline of events</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">ALERT</span>
            <span className="text-gray-600">Verify jurisdiction details</span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Notes</h3>
        <textarea
          placeholder="Confirm client address before sending."
          className="w-full p-3 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D6A767] focus:border-transparent resize-none"
          rows={3}
        />
      </div>
    </div>
  );
};