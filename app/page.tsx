"use client";

import { Checkbox, Modal } from "antd";
import { Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface User {
  id: number;
  name: string;
  status: boolean;
}

interface UserForm {
  name: string;
  status: boolean;
}

const Page = () => {
  const [data, setData] = useState<User[]>([
    {
      id: 1,
      name: "Ramziya",
      status: false,
    },
    {
      id: 2,
      name: "Damir",
      status: true,
    },
    {
      id: 3,
      name: "Mijgona",
      status: false,
    },
    {
      id: 4,
      name: "Rohila",
      status: true,
    },
  ]);

  function deleteUser(id: number) {
    setData((data) => data.filter((e) => e.id !== id));
  }

  const { register, handleSubmit, reset } = useForm<UserForm>();

  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("all");

  function openEditUser(user: User) {
    setIsEdit(true);
    setEditId(user.id);
    setOpenEdit(true);

    reset({
      name: user.name,
      status: user.status,
    });
  }

  function openAddUser() {
    setIsEdit(false);
    setEditId(null);
    reset({
      name: "",
      status: false,
    });
    setOpenEdit(true);
  }
  function onSubmit(formData: UserForm) {
    if (isEdit && editId !== null) {
      setData((prev) =>
        prev.map((e) => (e.id === editId ? { ...e, ...formData } : e))
      );
    } else {
      const newUser: User = {
        id: Date.now(),
        ...formData,
      };

      setData((prev) => [...prev, newUser]);
    }

    setOpenEdit(false);
    setEditId(null);
  }

  function checkout(id: number) {
    setData((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: !e.status } : e))
    );
  }

  return (
    <>
      <main>
        <div className="flex items-center mb-10 gap-[10px]">
          <button
            onClick={openAddUser}
            className="bg-green-500 text-white px-4 py-2 rounded-xl"
          >
            Add User
          </button>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-[3px] h-10 rounded-[10px] w-160 p-2"
            placeholder="Search..."
          />
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="border-[3px] p-2 rounded-[10px]"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-[30px]">
          {data
            .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
            .filter((e) => {
              if (selected === "active") return e.status === true;
              if (selected === "inactive") return e.status === false;
              return true;
            })
            .map((e) => {
              return (
                <div
                  key={e.id}
                  className="bg-accent p-4 w-65 h-60 border flex flex-col items-center gap-[10px] justify-center rounded-[30px]"
                >
                  <h1>{e.name}</h1>
                  <p
                    className={
                      e.status
                        ? "text-green-500 bg-green-100 p-1 w-20 text-center rounded-2xl"
                        : "text-red-500 w-20 p-1 text-center bg-red-200 rounded-2xl"
                    }
                  >
                    {e.status ? "Active" : "Inactive"}
                  </p>
                  <div className="flex items-center gap-[10px]">
                    <button
                      className="bg-red-500 p-1 w-20 rounded-2xl text-[white]"
                      onClick={() => deleteUser(e.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="text-[white] bg-orange-400 p-1 w-20 rounded-2xl"
                      onClick={() => openEditUser(e)}
                    >
                      Edit
                    </button>
                    <Checkbox
                      checked={e.status}
                      onChange={() => checkout(e.id)}
                    />
                    <Link href={`/${e.id}`}>
                      <Info />
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      <Modal
        title="Edit User"
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        footer={null}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 p-4 border rounded-xl"
        >
          <input
            {...register("name", { required: true })}
            className="border p-2 rounded"
            placeholder="Name"
          />

          <label className="flex gap-2 items-center">
            <input type="checkbox" {...register("status")} />
            Active
          </label>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Save
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Page;
