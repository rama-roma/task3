"use client";

import axios from "axios";
import { Edit2Icon, Info, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal, Button, Input, Switch, Select, Checkbox } from "antd";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  image: string;
  status: boolean;
  job: string;
  company: string;
  address: string;
}

const Async = () => {
  const API = "https://695f4e0e7f037703a8134c52.mockapi.io/users";

  const [data, setData] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | null>(null);

  const [infoModal, setInfoModal] = useState(false);
  const [infoUser, setInfoUser] = useState<User | null>(null);

  const { handleSubmit, reset, control } = useForm<User>();

  async function getData() {
    try {
      const res = await fetch(API, { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.log(error);
    }
  }

  async function getById(id: number) {
    try {
      const res = await fetch(`${API}/${id}`, { cache: "no-store" });
      const json = await res.json();
      setInfoUser(json);
      setInfoModal(true);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function deleteData(id: number) {
    try {
      await axios.delete(`${API}/${id}`);
      const res = await axios.get(API);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function addUser(data: User) {
    try {
      await axios.post(API, data);
      getData();
      setMode(null);
      reset();
    } catch (e) {
      console.log(e);
    }
  }

  async function editUser(data: User) {
    if (!currentUser) return;
    try {
      await axios.put(`${API}/${currentUser.id}`, data);
      getData();
      setMode(null);
      setCurrentUser(null);
      reset();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getData();
  }, []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  function filteredData(data: User[]) {
    return data.filter((user) => {
      const matchSearch = user.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? user.status === true
          : user.status === false;

      return matchSearch && matchStatus;
    });
  }

  async function checkout(id: number) {
    try {
      const user = data.find((u) => u.id === id);
      if (!user) return;

      await axios.put(`${API}/${id}`, {
        ...user,
        status: !user.status,
      });

      setData((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: !u.status } : u))
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <main>
        <div className="mb-10 flex items-center justify-center gap-[10px]">
          <Button
            type="primary"
            onClick={() => {
              reset({
                name: "",
                image: "",
                job: "",
                company: "",
                address: "",
                status: false,
              });
              setMode("add");
            }}
          >
            + Add user
          </Button>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-[3px] w-50 h-7 p-2 rounded-[3px]"
          />
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            style={{ width: 180 }}
            options={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </div>
        <div className="w-full h-20 p-3 flex items-center justify-center rounded-2xl border-[3px]">
          <div className="w-30">
            <span>AVATAR:</span>
          </div>
          <div className="w-25">
            <span>NAME:</span>
          </div>
          <div className="w-30">
            <span>STATUS:</span>
          </div>
          <div className="w-40">
            <span>ADDRESS:</span>
          </div>
          <div className="w-70">
            <span>JOB:</span>
          </div>
          <div className="w-60">
            <span>COMPANY:</span>
          </div>
          <div className="w-30">
            <span>ACTIONS:</span>
          </div>
        </div>
        <br />
        <div className="flex items-center justify-center flex-col gap-[20px]">
          {filteredData(data).map((e: any) => {
            return (
              <div
                key={e.id}
                className="w-full h-20 p-3 flex items-center justify-center rounded-2xl border-[3px]"
              >
                <div className="w-30">
                  <img
                    className="w-15 rounded-2xl border"
                    src={e.image}
                    alt=""
                  />
                </div>
                <h1 className="w-25">{e.name}</h1>
                <div className="w-30">
                  <p
                    className={
                      e.status
                        ? "text-green-500 bg-green-200 p-1 rounded-2xl w-20 text-center"
                        : "text-red-500 bg-red-200 text-center p-1 rounded-2xl w-20"
                    }
                  >
                    {e.status ? "Active" : "Inactive"}
                  </p>
                </div>
                <span className="w-40">{e.address}</span>
                <span className="w-70">{e.job}</span>
                <span className="w-60">{e.company}</span>
                <div className="w-30 flex items-center gap-[10px]">
                  <Trash
                    className="cursor-pointer"
                    onClick={() => deleteData(e.id)}
                    size={17}
                    color="red"
                  />
                  <Edit2Icon
                    className="cursor-pointer"
                    size={17}
                    color="orange"
                    onClick={() => {
                      setCurrentUser(e);
                      reset(e);
                      setMode("edit");
                    }}
                  />
                  <Info
                    onClick={() => getById(e.id)}
                    className="cursor-pointer"
                    size={17}
                    color="blue"
                  />
                  <Checkbox checked={e.status} onClick={() => checkout(e.id)} />
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Modal
        open={mode !== null}
        onCancel={() => {
          setMode(null);
          setCurrentUser(null);
          reset();
        }}
        footer={null}
        title={mode === "add" ? "Add user" : "Edit user"}
      >
        <form onSubmit={handleSubmit(mode === "add" ? addUser : editUser)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Name"
                style={{ marginBottom: 10 }}
              />
            )}
          />
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Image URL"
                style={{ marginBottom: 10 }}
              />
            )}
          />
          <Controller
            name="job"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Job"
                style={{ marginBottom: 10 }}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Address"
                style={{ marginBottom: 10 }}
              />
            )}
          />
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Company"
                style={{ marginBottom: 10 }}
              />
            )}
          />
          <div style={{ marginBottom: 15 }}>
            <span>Status: </span>
            <Controller
              name="status"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />
          </div>
          <Button type="primary" htmlType="submit" block>
            {mode === "add" ? "Add" : "Save"}
          </Button>
        </form>
      </Modal>

      <Modal
        open={infoModal}
        onCancel={() => setInfoModal(false)}
        footer={null}
        title="User Info"
      >
        {infoUser ? (
          <div className="flex flex-col gap-2">
            <img src={infoUser.image} alt="" className="w-20 rounded-2xl" />
            <p>
              <strong>ID:</strong> {infoUser.id}
            </p>
            <p>
              <strong>Name:</strong> {infoUser.name}
            </p>
            <p>
              <strong>Job:</strong> {infoUser.job}
            </p>
            <p>
              <strong>Company:</strong> {infoUser.company}
            </p>
            <p>
              <strong>Address:</strong> {infoUser.address}
            </p>
            <p>
              <strong>Status:</strong> {infoUser.status ? "Active" : "Inactive"}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </>
  );
};

export default Async;
