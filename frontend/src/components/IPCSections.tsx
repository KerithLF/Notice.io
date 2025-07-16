import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Book, Scale } from 'lucide-react';

interface IPCSection {
  id: string;
  title: string;
  description: string;
  keywords?: string[];
}

interface IPCSectionsProps {
  recommendations?: IPCSection[];
}

export const IPCSections: React.FC<IPCSectionsProps> = ({ recommendations = [] }) => {
  // Only show if recommendations are provided and non-empty
  if (!recommendations.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm min-h-[120px] flex flex-col justify-center items-center">
        <div className="flex items-center space-x-2 mb-6">
          <Book className="h-5 w-5 text-[#D6A767]" />
          <h2 className="text-xl font-semibold">IPC Sections</h2>
        </div>
        {/* Empty state: show a shallow message */}
        <div className="text-center w-full">
          <span className="text-sm text-gray-400 italic">IPC sections will be recommended based on the subject line you provide above.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Book className="h-5 w-5 text-[#D6A767]" />
        <h2 className="text-xl font-semibold">IPC Sections</h2>
      </div>
      <Droppable droppableId="ipc-sections">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4"
          >
            {recommendations.map((section, index) => (
              <Draggable key={section.id} draggableId={section.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`drag-item p-4 border rounded-lg cursor-move bg-[#FFF9F2] ${
                      snapshot.isDragging
                        ? 'dragging shadow-lg border-[#D6A767] bg-[#E6D0B1]'
                        : 'border-[#D6A767] hover:border-[#C19653] hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Scale className="h-4 w-4 text-[#D6A767] mt-0.5 flex-shrink-0" />
                      <div className="w-full">
                        <h3 className="font-bold text-base text-black mb-1">
                          {section.title}{section.description && ' Explanation:'}
                        </h3>
                        <p className="text-sm text-gray-700 mb-1 font-normal leading-relaxed whitespace-pre-line">
                          {section.description}
                        </p>
                        {section.keywords && (
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
                        )}
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
    </div>
  );
};