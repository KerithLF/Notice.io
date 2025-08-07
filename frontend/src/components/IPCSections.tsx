import React from 'react';
<<<<<<< HEAD
// import { Draggable, Droppable } from 'react-beautiful-dnd';
// import { Book, Scale } from 'lucide-react';

interface IPCSection {
  // id: string;
  section: string;
  title: string;
  description: string[];
  // keywords?: string[];
  applicability: string;
}

// interface IPCSectionsProps {
//   recommendations: IPCSection[];
// }

// export const IPCSections: React.FC<IPCSectionsProps> = ({ recommendations = [] }) => {
//   // Only show if recommendations are provided and non-empty
//   if (!recommendations.length) {
//     return (
//       <div className="bg-white p-6 rounded-lg shadow-sm min-h-[120px] flex flex-col justify-center items-center">
//         <div className="flex items-center space-x-2 mb-6">
//           <Book className="h-5 w-5 text-[#D6A767]" />
//           <h2 className="text-xl font-semibold">IPC Sections</h2>
//         </div>
//         {/* Empty state: show a shallow message */}
//         <div className="text-center w-full">
//           <span className="text-sm text-gray-400 italic">IPC sections will be recommended based on the subject line you provide above.</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-sm">
//       <div className="flex items-center space-x-2 mb-6">
//         <Book className="h-5 w-5 text-[#D6A767]" />
//         <h2 className="text-xl font-semibold">IPC Sections</h2>
//       </div>
//       <Droppable droppableId="ipc-sections">
//         {(provided) => (
//           <div
//             ref={provided.innerRef}
//             {...provided.droppableProps}
//             className="space-y-4"
//           >
//             {recommendations.map((section, index) => (
//               <Draggable key={section.id} draggableId={section.id} index={index}>
//                 {(provided, snapshot) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     className={`drag-item p-4 border rounded-lg cursor-move bg-[#FFF9F2] ${
//                       snapshot.isDragging
//                         ? 'dragging shadow-lg border-[#D6A767] bg-[#E6D0B1]'
//                         : 'border-[#D6A767] hover:border-[#C19653] hover:shadow-sm'
//                     }`}
//                   >
//                     <div className="flex items-start space-x-3">
//                       <Scale className="h-4 w-4 text-[#D6A767] mt-0.5 flex-shrink-0" />
//                       <div className="w-full">
//                         <h3 className="font-bold text-base text-black mb-1">
//                           {section.title}{section.description && ' Explanation:'}
//                         </h3>
//                         <p className="text-sm text-gray-700 mb-1 font-normal leading-relaxed whitespace-pre-line">
//                           {section.description}
//                         </p>
//                         {section.description && (
//                           <div className="flex flex-wrap gap-1">
//                             {section.description.map((description, idx) => (
//                               <span
//                                 key={idx}
//                                 className="px-2 py-1 bg-[#E6D0B1] text-xs rounded-full text-[#3C222F]"
//                               >
//                                 {description}
//                               </span>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     </div>
//   );
// };



interface IPCSectionsProps {
  recommendations: IPCSection[];
}

export const IPCSections: React.FC<IPCSectionsProps> = ({ recommendations }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">IPC Recommendations</h2>
      {recommendations.map((section, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-600">
                Section {section.section}
              </h3>
              <p className="text-gray-700 font-medium mt-1">{section.title}</p>
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-2">
            <p className="text-sm text-gray-600">{section.description}</p>
          </div>

          {/* Applicability Explanation */}
          <div className="mt-3 bg-orange-50 p-3 rounded-md">
            <h4 className="text-sm font-semibold text-orange-700 mb-1">Why this section applies:</h4>
            <p className="text-sm text-gray-700">{section.applicability}</p>
          </div>
          {/* Optional: Add citation or reference */}
          <div className="mt-2 text-xs text-gray-500">
            Reference: Indian Penal Code, {section.section}
          </div>
        </div>
      ))}
=======
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
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
    </div>
  );
};