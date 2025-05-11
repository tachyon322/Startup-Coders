import Link from "next/link";

interface StartupHeaderProps {
  name: string;
  tags: {
    id: number;
    name: string;
  }[];
  description: string;
}

// Server component for the header section
export default function StartupHeader({ name, tags, description }: StartupHeaderProps) {
  return (
    <div className="bg-gray-50 rounded-xs overflow-hidden">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-indigo-950 mb-4">{name}</h1>
        
        {/* Description with optimized rendering */}
        <div className="prose max-w-none text-gray-700 mb-6">
          {description.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span 
              key={tag.id} 
              className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 