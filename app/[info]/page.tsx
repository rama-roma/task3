'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  status: boolean;
  description: string;
}

const users: User[] = [
  { id: 1, name: "Ramziya", status: false, description: "girl" },
  { id: 2, name: "Damir", status: true, description: "boy" },
  { id: 3, name: "Mijgona", status: false, description: "girl" },
  { id: 4, name: "Rohila", status: true, description: "girl" },
];

export default function InfoPage() {
  const params = useParams(); 
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const id = Number(params.info); 
    const found = users.find(u => u.id === id);
    if (!found) {
      router.back();
    } else {
      setUser(found);
    }
  }, [params.id, router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-10 border rounded-xl w-80 mx-auto mt-10 flex flex-col gap-4">
      <h1>User Info</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p>
        <strong>Status:</strong>{" "}
        {user.status ? "Active" : "Inactive"}
      </p>
      <p>
        <strong>Description:</strong>{" "}
        {user.description}
      </p>
    </div>
  );
}
