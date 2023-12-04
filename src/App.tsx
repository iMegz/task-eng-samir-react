import { FormEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import Modal from "./components/Modal/Modal";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Pagination from "./components/Pagination/Pagination ";

interface Item {
  id: number;
  name: string;
  brand: string;
  model: string;
  color: string;
  price: number;
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const page = +(searchParams.get("p") || 1);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_ORIGIN}/item/count`).then((count) => {
      setCount(count.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_ORIGIN}/item?p=${page}`)
      .then(({ data }) => {
        setItems(data);
      });
  }, [searchParams]);

  function handleEditPrice(index: number, itemId: number) {
    return function (e: FormEvent) {
      e.preventDefault();
      const data = { price: inputRefs.current[index].value };
      axios.patch(`${import.meta.env.VITE_ORIGIN}/item/${itemId}`, data);
      alert("Price changed");
    };
  }

  function renderItems() {
    if (!items.length) return <h3>Loading...</h3>;
    else
      return (
        <table>
          <thead>
            <tr>
              <th />
              {items.map((item) => (
                <th key={item.id}>{item.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Brand</td>
              {items.map((item) => (
                <td key={item.id}>{item.brand}</td>
              ))}
            </tr>
            <tr>
              <td>Model</td>
              {items.map((item) => (
                <td key={item.id}>{item.model}</td>
              ))}
            </tr>
            <tr>
              <td>Color</td>
              {items.map((item) => (
                <td key={item.id}>{item.color}</td>
              ))}
            </tr>
            <tr>
              <td>Price</td>
              {items.map((item, i) => (
                <td key={item.id}>
                  <form
                    className="price-form"
                    onSubmit={handleEditPrice(i, item.id)}
                  >
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      defaultValue={item.price}
                      ref={(el) => (inputRefs.current[i] = el!)}
                    />
                    <button className="btn btn-primary-sm">Edit</button>
                  </form>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      );
  }

  return (
    <>
      <nav>
        <div className="container">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            Add new item
          </button>
        </div>
      </nav>
      <main>
        <div className="container">
          <h1 style={{ margin: "20px 0" }}>Items</h1>
          {renderItems()}
          <br />
          <Pagination
            count={count}
            current={page}
            setParams={setSearchParams}
          />
        </div>
        {showModal
          ? createPortal(
              <Modal closeModal={() => setShowModal(false)} />,
              document.getElementById("modal") as Element
            )
          : null}
      </main>
    </>
  );
}

export default App;
