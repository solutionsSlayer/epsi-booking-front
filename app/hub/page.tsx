import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:1337';
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://127.0.0.1:1337';

async function getCampuses() {
  try {
    console.log("Fetching campuses...");
    const res = await fetch(`${API_BASE_URL}/api/all-buildings`, {
      headers: {
        'Authorization': 'Bearer b12b60f2bf72ab8a229e67fafdee402082505bd67e65d402ff359e3c1b5b751e6bc60c9e2206c106dfd3aa6b2b481b3086519648584ad500d618c1b1bd3219862966d086efbedef853859e7f561122d21c77f3e5ad7f3a3fe1f322b1ebdd84e0d89af8dfe0613994cfbddd30f4e14bd6d8387cd852c5fee306ab2d05fc170b7c'
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
