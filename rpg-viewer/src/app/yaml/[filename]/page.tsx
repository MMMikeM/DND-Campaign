import { getProcessedYamlData } from '@/server/yaml';
import YamlDisplay from '@/components/YamlDisplay';
import { notFound } from 'next/navigation';

// Define parameters interface
interface YamlPageParams {
  params: {
    filename: string;
  };
}

// This is a Server Component
export default async function YamlPage({ params }: YamlPageParams) {
  // Decode the filename from the URL
  const filename = decodeURIComponent(params.filename);
  
  try {
    // Fetch data directly on the server
    const data = await getProcessedYamlData(filename);
    
    if (!data) {
      return notFound();
    }
    
    // Pass the data directly to the YamlDisplay component
    return (
      <div className="container mx-auto p-6">
        <YamlDisplay 
          filename={filename} 
          data={data} 
        />
      </div>
    );
  } catch (error) {
    console.error(`Error loading YAML file: ${filename}`, error);
    return (
      <div className="container mx-auto p-6 text-red-500">
        Error loading YAML data: {(error as Error).message}
      </div>
    );
  }
} 