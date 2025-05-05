import React from "react";
import { Globe, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

interface StartupMetadataProps {
  startup: {
    websiteUrl: string | null;
    createdAt: Date;
    updatedAt?: Date;
  };
}

export default function StartupMetadata({ startup }: StartupMetadataProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-indigo-950 mb-4">Information</h2>
      
      <div className="space-y-4">
        {startup.websiteUrl && (
          <div className="flex items-start">
            <div className="mt-0.5 mr-3">
              <Globe className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Website</h3>
              <a 
                href={startup.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {startup.websiteUrl.replace(/^https?:\/\//i, '')}
              </a>
            </div>
          </div>
        )}
        
        <div className="flex items-start">
          <div className="mt-0.5 mr-3">
            <Calendar className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Created</h3>
            <p className="text-gray-600">
              {format(new Date(startup.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
        
        {startup.updatedAt && (
          <div className="flex items-start">
            <div className="mt-0.5 mr-3">
              <Clock className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Last Updated</h3>
              <p className="text-gray-600">
                {format(new Date(startup.updatedAt), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 