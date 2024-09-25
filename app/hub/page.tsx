import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:1337';
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://127.0.0.1:1337';

async function getCampuses() {
  try {
    console.log("Fetching campuses...");
    const res = await fetch(`${API_BASE_URL}/api/all-buildings`, {
      headers: {
        'Authorization': 'Bearer 531bc9e5ca41fc9ea6a2987e0dc5093d395ebe159f443eb01d7dc3f77fd536607a11422b9642d27ee096b9d13ac96d9e19688a7649552a9d5743459eaebd019ac6775ad830973b72d923e98556766f72181184733b7b4612f83d078db8d54d91a3aea3777ae2425a13a8960996859bea7304af0911ce99219b68d4084cc32df9'
      },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Raw API response:", data);
    console.log("Processed campuses data:", data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch campuses:', error);
    return null;
  }
}

interface Campus {
  id: number;
  location: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  url: string;
}

export default async function Page() {
  const campuses = await getCampuses();

  return (
    <div className="container mx-auto px-4 py-8 overflow-y-hidden">
      <h1 className="text-3xl font-bold text-center py-5 mb-8 text-black">Nos campus</h1>
      {campuses === null ? (
        <div className="text-center text-red-500">
          <p>Unable to load campus data. Please try again later.</p>
        </div>
      ) : campuses.length === 0 ? (
        <div className="text-center">
          <p>No campuses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 cursor-pointer">
          {campuses.map((campus: Campus) => (
            <a href={`/hub/${campus.id}`} key={campus.id} className="relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src={`http://127.0.0.1:1337/${campus.url}`}
                alt={`Campus ${campus.name}`}
                width={300}
                height={200}
                layout="responsive"
                objectFit="cover"
                className="hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
                <h2 className="text-white text-3xl font-bold mb-2">{campus.name}</h2>
                <p className="text-white text-xl">{campus.location}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
