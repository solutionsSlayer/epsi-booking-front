import Image from 'next/image';

export default function Hub() {
  const campuses = [
    { name: 'BRUGES', imageUrl: '/campus_bruges.png' },
    { name: 'BORDEAUX', imageUrl: '/campus_bordeaux.jpg' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 overflow-y-hidden">
      <h1 className="text-3xl font-bold text-center py-5 mb-8 text-black">Nos campus</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 cursor-pointer">
        {campuses.map((campus) => (
          <div key={campus.name} className="relative overflow-hidden rounded-lg shadow-lg">
            <Image
              src={campus.imageUrl}
              alt={`Campus ${campus.name}`}
              width={300}
              height={200}
              layout="responsive"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h2 className="text-white text-3xl font-bold">{campus.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
