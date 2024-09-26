import Image from 'next/image';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:1337';
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://127.0.0.1:1337';

async function getCampuses() {
  try {
    console.log("Fetching campuses...");
    const res = await fetch(`${API_BASE_URL}/api/all-buildings`, {
      headers: {
        'Authorization': 'Bearer c410e18811d6b3920585b0d8a0f2b06303e50a20dd32be15cb6dca4fb1cdeb820b72dbaaacbc140c94a57946612509a974bc79c37293dd81602cea05503b56f6d2fd094c6f566f3eecb905bdc9eb3c440bb8f2eed42682f3a93852046277647cdd2c5a971a24eb1fc8d094e73d150989a3740c2968c95eaf456c024bfc1e5fdc'
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
  const cookieStore = cookies();
  console.log("cookieStore", cookieStore);
  const isAuthenticated = cookieStore.get('isAuthenticated');

  console.log("isAuthenticated", isAuthenticated);

  if (!isAuthenticated || isAuthenticated.value !== 'true') {
    redirect('/login');
  }

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
